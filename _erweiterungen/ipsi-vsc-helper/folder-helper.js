/* ==================================================================
   ipsi-vsc-helper  v1.2
   ------------------------------------------------------------------
   Lokaler Helfer für das Copy-Buttons-Userscript (VSC-Ordner-Öffner).

   Routen:
   - GET  /ping                    → Lebenszeichen (zum Testen im Browser)
   - GET  /scan?path=...           → listet alle Unterordner eines Pfads
   - GET  /diag?path=...           → Schritt-für-Schritt-Diagnose des Weckdienstes
   - POST /open           (Body=Pfad) → öffnet den Ordner in VS Code (neues Fenster)
   - POST /open-explorer  (Body=Pfad) → öffnet den Ordner im Windows-Explorer

   Neu in v1.3:
   - Zuverlässiger Programmstart: VS Code/Explorer werden über das
     bewährte "cmd /c start" gestartet (setzt den Fensterstatus explizit
     auf "normal"). Der Rückgabewert wird geprüft – Startfehler werden
     jetzt ehrlich als Fehlermeldung durchgereicht statt blind "ok" zu
     melden. Notnagel: Direktstart wie in v1.0.
   - Weckdienst-Log nennt den betroffenen Laufwerksbuchstaben (der immer
     aus dem übergebenen Pfad stammt, also aus der copy_drive-Einstellung)

   Neu in v1.2:
   - Geduldiger Netzlaufwerk-Weckdienst: probiert bis zu ~25 Sekunden
     abwechselnd Laufwerksbuchstabe und UNC-Pfad (ein aufwachendes
     NAS braucht gerne 10–30 s – der Explorer wartet auch einfach).
     Echte "Ordner existiert nicht"-Fälle werden weiterhin in unter
     einer Sekunde erkannt (Wurzel erreichbar + Ziel fehlt = fertig).
   - UNC-Ermittlung über drei Quellen: Registry (HKCU\Network),
     "net use" und Get-SmbMapping (PowerShell)
   - not_found-Antworten enthalten jetzt einen "reason" (wird im
     Userscript mit angezeigt)
   - Neue Diagnose-Route /diag für die Fehlersuche
   - Größerer fs-Threadpool, damit blockierende SMB-Zugriffe parallele
     Anfragen nicht ausbremsen

   Neu in v1.1:
   - VS Code startet auch dann sichtbar, wenn es vorher geschlossen war
     (Start über PowerShell/Start-Process mit -WindowStyle Normal)
   - /open-explorer für das Rechtsklick-Menü des Pfad-Buttons

   Sicherheit:
   - Lauscht NUR auf 127.0.0.1 (von außen nicht erreichbar)
   - Akzeptiert nur Anfragen von https://ipsi.securewebsystems.net
   - Nur absolute Windows-Pfade ohne Shell-Metazeichen werden angenommen
   - Es wird nie eine Shell mit Nutzdaten gefüttert – Pfade wandern
     ausschließlich als Argumente bzw. über Umgebungsvariablen
   ================================================================== */
'use strict';

// Mehr Threads für fs-Operationen: hängende SMB-Zugriffe (getrennte
// Laufwerke) blockieren sonst den kleinen Standard-Pool (4) und damit
// auch alle weiteren Anfragen. Muss vor dem ersten fs-Zugriff stehen.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '16';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execFile } = require('child_process');

const HOST = '127.0.0.1';
const PORT = 48620;
const VERSION = '1.3';
const ALLOWED_ORIGINS = ['https://ipsi.securewebsystems.net'];
const CODE_PATH_OVERRIDE = ''; // Optional: kompletter Pfad zur Code.exe eintragen, falls die Auto-Suche fehlschlägt
const PID_FILE = path.join(__dirname, 'helper.pid');
const WAKE_BUDGET_MS = 25000; // maximale Geduld des Weckdienstes pro Anfrage

// ---------- kleine Async-Helfer -------------------------------------
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const statAsync = (p) => new Promise((resolve, reject) => fs.stat(p, (err, stats) => err ? reject(err) : resolve(stats)));
const readdirAsync = (p, opts) => new Promise((resolve, reject) => fs.readdir(p, opts, (err, result) => err ? reject(err) : resolve(result)));

// Kappen für hängende SMB-Zugriffe: nicht ewig auf einen toten Server warten
function withTimeout(promise, ms) {
    let timer;
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'TIMEOUT' })), ms); });
    promise.catch(() => {}); // späte Fehler des Verlierers nicht als "unhandled" hochblubbern lassen
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// execFile als Promise (löst immer auf – Fehler stehen im Ergebnis)
function execFileAsync(file, args, opts = {}) {
    return new Promise((resolve) => {
        execFile(file, args, { timeout: 5000, windowsHide: true, ...opts }, (err, stdout, stderr) => {
            resolve({ err, stdout: String(stdout || ''), stderr: String(stderr || '') });
        });
    });
}

// ---------- VS Code (Code.exe) finden ------------------------------
let codeExe = null;
function resolveCodeExe(callback) {
    if (codeExe) return callback(codeExe);
    const candidates = [
        CODE_PATH_OVERRIDE,
        process.env.IPSI_CODE_PATH || '',
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Microsoft VS Code', 'Code.exe'),
        path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Microsoft VS Code', 'Code.exe'),
    ].filter(Boolean);

    for (const candidate of candidates) {
        try { if (fs.existsSync(candidate)) { codeExe = candidate; return callback(codeExe); } } catch (e) {}
    }

    // Fallback: "code" im PATH suchen und von ...\bin\code.cmd auf ...\Code.exe schließen
    execFile('where.exe', ['code'], (err, stdout) => {
        if (!err && stdout) {
            for (const line of stdout.split(/\r?\n/).map(s => s.trim()).filter(Boolean)) {
                const guess = line.toLowerCase().endsWith('.exe')
                    ? line
                    : path.join(path.dirname(line), '..', 'Code.exe');
                try { if (fs.existsSync(guess)) { codeExe = guess; return callback(codeExe); } } catch (e) {}
            }
        }
        callback(null);
    });
}
const resolveCodeExeAsync = () => new Promise((resolve) => resolveCodeExe(resolve));

// ---------- Pfad-Validierung ---------------------------------------
// Nur absolute Windows-Pfade mit Laufwerksbuchstabe (UNC-Pfade werden
// ausschließlich intern vom Weckdienst gebildet, nie von außen angenommen).
function sanitizeWinPath(input) {
    if (typeof input !== 'string') return null;
    const p = input.trim().replace(/\//g, '\\');
    if (!/^[A-Za-z]:\\/.test(p)) return null;        // muss mit Laufwerksbuchstabe beginnen (z.B. "A:\")
    if (p.includes('..')) return null;               // keine Pfad-Traversierung
    if (/[<>|?*"\x00-\x1F]/.test(p)) return null;    // in Windows-Pfaden ohnehin verbotene Zeichen
    if (/[&^%!;`]/.test(p)) return null;             // Shell-Metazeichen sicherheitshalber ablehnen
    return p;
}

// abschließende Backslashes entfernen (Laufwerkswurzel behält ihren)
function trimTrailingBackslashes(p) {
    const trimmed = p.replace(/\\+$/, '');
    if (/^[A-Za-z]:$/.test(trimmed)) return `${trimmed}\\`;
    return trimmed || p;
}

// ---------- Netzlaufwerk-Weckdienst ---------------------------------
// "Nicht verbundene" Netzlaufwerke sind nur gespeicherte Zuordnungen –
// die SMB-Verbindung baut Windows erst bei Bedarf auf, zuverlässig aber
// nur über den Explorer. Der Weckdienst macht das nach: UNC-Ziel des
// Buchstabens ermitteln (Registry, "net use" oder Get-SmbMapping), die
// Freigabe direkt über den UNC-Pfad ansprechen (baut die Session mit
// gespeicherten Anmeldedaten auf – und weckt schlafende NAS-Platten),
// Buchstaben-Zuordnung wiederbeleben. Falls der Buchstabe stur bleibt,
// wird die Anfrage transparent über den UNC-Pfad bedient (nach außen
// bleibt immer der gewohnte Buchstaben-Pfad sichtbar).
const uncCache = new Map(); // Laufwerksbuchstabe → UNC (z.B. 'L' → '\\server\freigabe')

async function getUncForDrive(letter, trace = null) {
    const log = (source, value) => { if (trace) trace.push({ step: 'unc-quelle', source, value }); };
    if (!/^[A-Za-z]$/.test(letter)) return null;
    if (uncCache.has(letter)) { log('cache', uncCache.get(letter)); return uncCache.get(letter); }
    let unc = null;

    // 1) Persistente Zuordnung aus der Registry (HKCU\Network\<Buchstabe>)
    const reg = await execFileAsync('reg.exe', ['query', `HKCU\\Network\\${letter}`, '/v', 'RemotePath']);
    let match = reg.stdout.match(/RemotePath\s+REG_(?:EXPAND_)?SZ\s+(\\\\[^\r\n]+)/i);
    if (match) unc = match[1].trim();
    log('registry', unc);

    // 2) Fallback: "net use" (auch nicht-persistente Verbindungen; Ausgabe sprachunabhängig nach UNC durchsuchen)
    if (!unc) {
        const nu = await execFileAsync('net.exe', ['use', `${letter}:`]);
        match = `${nu.stdout}\n${nu.stderr}`.match(/(\\\\[^\s]+\\[^\s]+)/);
        if (match) unc = match[1].trim();
        log('net use', unc);
    }

    // 3) Fallback: Get-SmbMapping (kennt auch getrennte SMB-Zuordnungen)
    if (!unc) {
        const ps = await execFileAsync('powershell.exe',
            ['-NoProfile', '-NonInteractive', '-Command', `(Get-SmbMapping -LocalPath '${letter}:' -ErrorAction SilentlyContinue).RemotePath`],
            { timeout: 8000 });
        match = ps.stdout.match(/(\\\\[^\r\n]+)/);
        if (match) unc = match[1].trim();
        log('Get-SmbMapping', unc);
    }

    if (unc) unc = unc.replace(/[\\\s]+$/, ''); // abschließende Backslashes/Leerzeichen weg
    if (unc && /^\\\\[^\\/]+\\[^\\/]+/.test(unc)) {
        uncCache.set(letter, unc);
        return unc;
    }
    return null;
}

function toUncPath(letterPath, unc) { // 'L:\a\b' + '\\srv\share' → '\\srv\share\a\b'
    const rest = letterPath.slice(2).replace(/^\\+/, '');
    const base = unc.replace(/\\+$/, '');
    return rest ? `${base}\\${rest}` : base;
}

// Prüft/erzwingt die Erreichbarkeit eines Pfads. Probiert innerhalb des
// Zeitbudgets geduldig abwechselnd Buchstaben- und UNC-Pfad und liefert
// { effective } (nutzbarer Pfad) oder { effective: null, reason }.
// Echte "existiert nicht"-Fälle werden früh erkannt und sofort gemeldet.
async function resolveAccessiblePath(p, budgetMs = WAKE_BUDGET_MS, trace = null) {
    const t0 = Date.now();
    const deadline = t0 + budgetMs;
    const remaining = () => deadline - Date.now();
    const cap = (ms) => Math.max(300, Math.min(ms, remaining()));

    const tryStat = async (target, capMs) => {
        const started = Date.now();
        try {
            const stats = await withTimeout(statAsync(target), cap(capMs));
            if (trace) trace.push({ t: Date.now() - t0, step: 'stat', target, ok: true, ms: Date.now() - started, istOrdner: stats.isDirectory() });
            return stats.isDirectory() ? 'dir' : 'nodir';
        } catch (e) {
            if (trace) trace.push({ t: Date.now() - t0, step: 'stat', target, ok: false, ms: Date.now() - started, code: e.code || e.message });
            return e.code === 'ENOENT' ? 'enoent' : 'fail';
        }
    };
    const tryPoke = async (target, capMs) => { // readdir – Fehler egal, dient nur dem Aufwecken/Verbinden
        const started = Date.now();
        try {
            await withTimeout(readdirAsync(target), cap(capMs));
            if (trace) trace.push({ t: Date.now() - t0, step: 'anstupsen', target, ok: true, ms: Date.now() - started });
            return true;
        } catch (e) {
            if (trace) trace.push({ t: Date.now() - t0, step: 'anstupsen', target, ok: false, ms: Date.now() - started, code: e.code || e.message });
            return false;
        }
    };

    const letter = p[0].toUpperCase();
    const root = p.slice(0, 3); // z.B. 'A:\'
    let unc = null, uncPath = null, uncLookupDone = false, netUseFired = false, rounds = 0, announced = false;

    while (remaining() > 0) {
        rounds++;

        // 1) Buchstaben-Pfad direkt probieren
        const r = await tryStat(p, 4000);
        if (r === 'dir') return { effective: p };
        if (r === 'nodir') return { effective: null, reason: 'Ziel ist kein Ordner' };
        if (!announced) { // welcher Buchstabe geweckt wird, kommt immer aus dem Pfad selbst (= copy_drive-Einstellung)
            announced = true;
            console.log(`[weckdienst] Laufwerk ${letter}: reagiert nicht – wecke ${root} ...`);
        }
        if (r === 'enoent') {
            // ENOENT kann "existiert nicht" ODER "Laufwerk getrennt" bedeuten → Wurzel entscheidet
            if (await tryPoke(root, 2500)) {
                const confirm = await tryStat(p, 2500);
                if (confirm === 'dir') return { effective: p };
                if (confirm === 'enoent' || confirm === 'nodir') return { effective: null, reason: 'Ordner existiert dort nicht' };
                // Timeout o.ä. → unten regulär weiterprobieren
            }
        }

        // 2) UNC-Ziel des Buchstabens ermitteln (einmalig)
        if (!uncLookupDone) {
            uncLookupDone = true;
            unc = await getUncForDrive(letter, trace);
            if (unc) uncPath = toUncPath(p, unc);
            if (trace) trace.push({ t: Date.now() - t0, step: 'unc-ziel', unc });
        }

        if (uncPath) {
            // 3) Direkt über den UNC-Pfad – baut die SMB-Session auf und weckt das NAS
            const ru = await tryStat(uncPath, 8000);
            if (ru === 'dir') {
                if (!netUseFired) { // Buchstaben-Zuordnung wiederbeleben (best effort, nicht warten)
                    netUseFired = true;
                    execFileAsync('net.exe', ['use', `${letter}:`, unc]);
                    if (trace) trace.push({ t: Date.now() - t0, step: 'net-use-wiederbeleben' });
                }
                const back = await tryStat(p, 1500); // dem Buchstaben eine kurze Chance geben
                return { effective: back === 'dir' ? p : uncPath };
            }
            if (ru === 'enoent') {
                // ENOENT über UNC: Wenn die Freigabe-Wurzel erreichbar ist, fehlt der Ordner wirklich
                if (await tryStat(unc, 4000) === 'dir') return { effective: null, reason: 'Ordner existiert dort nicht' };
            }
            await tryPoke(unc, 8000); // Freigabe-Wurzel anstupsen (Session/NAS aufwecken)
        } else {
            await tryPoke(root, 3000); // weckt verbundene, aber schlafende Laufwerke (z.B. USB)
            if (rounds >= 2) { // ohne UNC-Ziel bringt langes Warten nichts
                return { effective: null, reason: 'Laufwerk nicht verbunden und kein UNC-Ziel gefunden' };
            }
        }

        if (remaining() <= 0) break;
        await delay(Math.min(1200, Math.max(100, remaining())));
        if (trace) trace.push({ t: Date.now() - t0, step: 'neuer-versuch' });
    }
    return { effective: null, reason: unc ? 'Server nicht erreichbar (Zeitüberschreitung)' : 'Laufwerk nicht verbunden und kein UNC-Ziel gefunden' };
}

// Ziel prüfen (existiert + ist Ordner); liefert { effective } oder { error }
async function prepareTarget(p) {
    const { effective, reason } = await resolveAccessiblePath(p);
    if (!effective) return { error: `Ordner nicht gefunden: ${p}${reason ? ` – ${reason}` : ''}` };
    return { effective };
}

// ---------- Ordner auflisten ----------------------------------------
async function listFolders(p) {
    const { effective, reason } = await resolveAccessiblePath(p);
    if (!effective) return { status: 'not_found', path: p, reason };
    try {
        const entries = await withTimeout(readdirAsync(effective, { withFileTypes: true }), 8000);
        const folders = entries
            .filter(entry => entry.isDirectory() || entry.isSymbolicLink())
            .map(entry => entry.name)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        return { status: 'ok', path: p, folders }; // nach außen immer der gewohnte Buchstaben-Pfad
    } catch (e) {
        return { status: 'error', message: `Lesen fehlgeschlagen (${e.code || e.message})` };
    }
}

// ---------- Programme sichtbar starten -------------------------------
// Der Helfer läuft unsichtbar (Autostart per VBS). Ein direkter Spawn kann
// diesen Fensterstatus an eine NEU startende Hauptinstanz vererben – dann
// startet z.B. VS Code zwar, zeigt aber kein Fenster. Deshalb: Start über
// das bewährte "cmd /c start" – das setzt den Fensterstatus des gestarteten
// Programms explizit auf "normal". Der Rückgabewert von cmd wird geprüft,
// damit Startfehler ehrlich gemeldet werden (kein blindes "ok" mehr).
// Anführungszeichen/Metazeichen sind in den Pfaden verboten (sanitize) –
// das Zusammensetzen der Kommandozeile ist dadurch sicher.
function quoteForCmd(value) {
    let v = String(value);
    if (/\\$/.test(v)) v += '\\'; // abschließender Backslash würde sonst das schließende Anführungszeichen maskieren
    return `"${v}"`;
}

function launchApp(file, args) {
    return new Promise((resolve) => {
        const cmdLine = ['start', '""', quoteForCmd(file), ...args.map(quoteForCmd)].join(' ');
        console.log(`[launch] ${cmdLine}`);
        let settled = false;
        const finish = (result) => { if (!settled) { settled = true; resolve(result); } };

        const direct = (why) => { // Notnagel: direkter Start (bewährtes v1.0-Verhalten; Fenster kann bei frisch startendem VSC unsichtbar bleiben)
            console.log(`[launch] cmd/start fehlgeschlagen (${why}) – versuche Direktstart`);
            try {
                const child = spawn(file, args, { detached: true, stdio: 'ignore' });
                child.on('error', (e) => finish({ ok: false, detail: `${why}; Direktstart: ${e.message}` }));
                child.unref();
                setTimeout(() => finish({ ok: true, note: 'Direktstart' }), 200);
            } catch (e) { finish({ ok: false, detail: `${why}; Direktstart: ${e.message}` }); }
        };

        try {
            execFile(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `"${cmdLine}"`], {
                windowsVerbatimArguments: true,
                windowsHide: true,
                timeout: 10000,
            }, (err, stdout, stderr) => {
                if (!err) return finish({ ok: true });
                const detail = `${String(stderr || '')}\n${String(stdout || '')}`.trim().split(/\r?\n/).filter(Boolean)[0] || err.message;
                direct(detail);
            });
        } catch (e) { direct(e.message); }
    });
}

// ---------- Ordner in VS Code öffnen ---------------------------------
async function openInCode(p) {
    const target = await prepareTarget(p);
    if (target.error) return { status: 'error', message: target.error };
    const exe = await resolveCodeExeAsync();
    if (!exe) return { status: 'error', message: 'Code.exe nicht gefunden – CODE_PATH_OVERRIDE im Helfer-Script eintragen' };
    const result = await launchApp(exe, ['--new-window', trimTrailingBackslashes(target.effective)]);
    return result.ok
        ? { status: 'ok', name: path.basename(trimTrailingBackslashes(p)) }
        : { status: 'error', message: `Start fehlgeschlagen: ${result.detail}` };
}

// ---------- Ordner im Explorer öffnen --------------------------------
async function openInExplorer(p) {
    const target = await prepareTarget(p);
    if (target.error) return { status: 'error', message: target.error };
    const explorerExe = path.join(process.env.SystemRoot || 'C:\\Windows', 'explorer.exe');
    const result = await launchApp(explorerExe, [trimTrailingBackslashes(target.effective)]);
    return result.ok
        ? { status: 'ok', name: path.basename(trimTrailingBackslashes(p)) }
        : { status: 'error', message: `Start fehlgeschlagen: ${result.detail}` };
}

// ---------- HTTP-Plumbing -------------------------------------------
function sendJson(res, code, obj) {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
}

function applyCors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Private-Network', 'true'); // Chrome "Private Network Access"-Preflight
    res.setHeader('Access-Control-Max-Age', '600');
    return !origin || ALLOWED_ORIGINS.includes(origin); // erlaubt: ipsi-Seite oder lokale Tools ohne Origin (curl, Browser-Adresszeile)
}

function readBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; if (body.length > 4096) req.destroy(); });
        req.on('end', () => resolve(body));
        req.on('error', () => resolve(''));
    });
}

const server = http.createServer((req, res) => {
    try {
        const allowed = applyCors(req, res);
        if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
        if (!allowed) return sendJson(res, 403, { status: 'error', message: 'Origin nicht erlaubt' });

        const url = new URL(req.url, `http://${HOST}:${PORT}`);

        if (req.method === 'GET' && url.pathname === '/ping') {
            return sendJson(res, 200, { status: 'ok', app: 'ipsi-vsc-helper', version: VERSION });
        }

        if (req.method === 'GET' && url.pathname === '/scan') {
            const p = sanitizeWinPath(url.searchParams.get('path'));
            if (!p) return sendJson(res, 200, { status: 'error', message: 'Ungültiger oder nicht unterstützter Pfad' });
            console.log(`[scan] ${p}`);
            listFolders(p)
                .then(result => sendJson(res, 200, result))
                .catch(e => sendJson(res, 200, { status: 'error', message: e.message }));
            return;
        }

        if (req.method === 'GET' && url.pathname === '/diag') { // Schritt-für-Schritt-Diagnose des Weckdienstes
            const raw = url.searchParams.get('path');
            const p = sanitizeWinPath(raw);
            const info = { app: 'ipsi-vsc-helper', version: VERSION, eingabe: raw, bereinigt: p };
            if (!p) return sendJson(res, 200, { ...info, error: 'Ungültiger oder nicht unterstützter Pfad' });
            console.log(`[diag] ${p}`);
            const trace = [];
            resolveAccessiblePath(p, WAKE_BUDGET_MS, trace)
                .then(result => sendJson(res, 200, { ...info, ergebnis: result, schritte: trace }))
                .catch(e => sendJson(res, 200, { ...info, error: e.message, schritte: trace }));
            return;
        }

        if (req.method === 'POST' && (url.pathname === '/open' || url.pathname === '/open-explorer')) {
            const inExplorer = url.pathname === '/open-explorer';
            readBody(req).then(body => {
                const p = sanitizeWinPath(body);
                if (!p) return sendJson(res, 200, { status: 'error', message: 'Ungültiger oder nicht unterstützter Pfad' });
                console.log(`[${inExplorer ? 'open-explorer' : 'open'}] ${p}`);
                (inExplorer ? openInExplorer(p) : openInCode(p))
                    .then(result => sendJson(res, 200, result))
                    .catch(e => sendJson(res, 200, { status: 'error', message: e.message }));
            });
            return;
        }

        sendJson(res, 404, { status: 'error', message: 'Unbekannte Route' });
    } catch (e) {
        try { sendJson(res, 500, { status: 'error', message: e.message }); } catch (_) {}
    }
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`ipsi-vsc-helper läuft bereits (Port ${PORT} ist belegt) – dieser Prozess beendet sich.`);
        process.exit(0);
    }
    console.error('Serverfehler:', err);
    process.exit(1);
});

server.listen(PORT, HOST, () => {
    try { fs.writeFileSync(PID_FILE, String(process.pid)); } catch (e) {}
    console.log(`ipsi-vsc-helper v${VERSION} läuft auf http://${HOST}:${PORT}`);
    resolveCodeExe((exe) => console.log(exe ? `VS Code gefunden: ${exe}` : 'Hinweis: Code.exe noch nicht gefunden – wird beim ersten Öffnen erneut gesucht.'));
});

// Robustheit: unerwartete Fehler loggen statt den Helfer zu beenden
process.on('unhandledRejection', (reason) => console.error('Unbehandelte Promise-Ablehnung:', reason));
process.on('uncaughtException', (err) => console.error('Unerwarteter Fehler:', err));

const cleanup = () => { try { fs.unlinkSync(PID_FILE); } catch (e) {} process.exit(0); };
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
