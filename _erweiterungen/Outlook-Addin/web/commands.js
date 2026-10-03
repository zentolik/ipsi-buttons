/* Copy-Buttons für Outlook – gemeinsame Logik
 * - BG-Vorlage formatieren (Rot/Fett wie in den Copy-Buttons)
 * - gesendete Mails an support@viscomp.bg in den Copy-Buttons ablegen (beim Senden)
 * - Antworten von BG ablegen (Aufgabenbereich, auch automatisch beim Öffnen, wenn angeheftet)
 * Läuft im Aufgabenbereich (taskpane.html), in commands.html (Outlook im Web / neues Outlook)
 * und als reine JS-Datei im klassischen Outlook für Windows (Ereignisse).
 */
var CB_ADDIN_VERSION = '1.0';
var CB_DB = 'https://pbxaezsviymladoptcep.supabase.co/rest/v1/rpc/';
// Der Datenbank-Schlüssel kommt beim Koppeln aus den Copy-Buttons (Kopplungs-Code) und
// liegt danach in den Roaming-Einstellungen des Add-ins - hier steht absichtlich keiner.
var CB_KEY = '';
var CB_BG_DOMAIN = '@viscomp.bg';

// ── Datenbank ──
function cbKey() {
    try { return Office.context.roamingSettings.get('cbKey') || CB_KEY; } catch (e) { return CB_KEY; }
}
function cbDb(fn, body) {
    var key = cbKey();
    if (!key) return Promise.reject(new Error('Noch nicht mit den Copy-Buttons gekoppelt'));
    return fetch(CB_DB + fn, {
        method: 'POST',
        headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {})
    }).then(function (res) {
        return res.text().then(function (text) {
            var data = null;
            try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
            if (!res.ok) throw new Error((data && (data.message || data.hint)) || ('HTTP ' + res.status));
            return data;
        });
    });
}

// ── Kopplung (Schlüssel liegt in den Roaming-Einstellungen des Add-ins) ──
function cbTok() {
    try { return (Office.context.roamingSettings.get('cbTok') || ''); } catch (e) { return ''; }
}
function cbTokSet(tok, key) {
    return new Promise(function (done) {
        try {
            if (tok) Office.context.roamingSettings.set('cbTok', tok); else Office.context.roamingSettings.remove('cbTok');
            if (key) Office.context.roamingSettings.set('cbKey', key); else if (!tok) Office.context.roamingSettings.remove('cbKey');
            Office.context.roamingSettings.saveAsync(function () { done(); });
        } catch (e) { done(); }
    });
}

// ── kleine Helfer für die Office-API ──
function cbGet(fn) {
    return new Promise(function (resolve) {
        try { fn(function (r) { resolve(r && r.status === Office.AsyncResultStatus.Succeeded ? r.value : null); }); }
        catch (e) { resolve(null); }
    });
}
function cbBodyText(item) { return cbGet(function (cb) { item.body.getAsync(Office.CoercionType.Text, cb); }); }
function cbAddr(list) {
    return (list || []).map(function (x) { return String((x && x.emailAddress) || '').toLowerCase(); }).filter(Boolean);
}
function cbIsBg(addrs) { return addrs.some(function (a) { return a.indexOf(CB_BG_DOMAIN) > -1; }); }

// ── Formatieren: Klartext der Copy-Buttons-Vorlage -> HTML mit Rot/Fett ──
var CB_LABELS = ['Backup Domain', 'Backup Time', 'Target Domain', 'Customer ID', 'Domain', 'DFS', 'Project', 'Shop folder'];
function cbEsc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function cbLooksLikeTemplate(text) { return /(^|\n)Customer ID:/.test(String(text || '')); }
function cbFormat(text) {
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    var html = lines.map(function (line) {
        if (!line.trim()) return '<div><br></div>';
        var m = /^(Please make sure that the backup is uploaded to the Target \w+-Domain: )(\S+)\s*$/.exec(line);
        if (m) {
            return '<div style="color:#d0021b;font-weight:bold;">' + cbEsc(m[1])
                + '<a href="https://' + cbEsc(m[2]) + '" style="color:#d0021b;text-decoration:underline;">' + cbEsc(m[2]) + '</a></div>';
        }
        for (var i = 0; i < CB_LABELS.length; i++) {
            var lbl = CB_LABELS[i] + ':';
            if (line.indexOf(lbl) === 0) return '<div><b>' + cbEsc(lbl) + '</b>' + cbEsc(line.slice(lbl.length)) + '</div>';
        }
        var h = cbEsc(line).replace(/( to the following \w+-domain)/, '<b>$1</b>');
        return '<div>' + h + '</div>';
    }).join('');
    return '<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;">' + html + '</div>';
}
// im Mailfenster: formatierte Fassung einsetzen; liefert true, wenn etwas geändert wurde.
// Zuerst die Fassung, die die Copy-Buttons bei "E-Mail öffnen" bereitgelegt haben (gleicher
// Betreff, auch eigene Vorlagen mit allen Farben), sonst die Standard-Vorlage aus dem Text erkennen.
function cbSetHtml(item, html) {
    return new Promise(function (resolve) {
        item.body.setAsync(html, { coercionType: Office.CoercionType.Html }, function (r) {
            resolve(r.status === Office.AsyncResultStatus.Succeeded);
        });
    });
}
function cbFormatItem(item) {
    var tok = cbTok();
    var pending = !tok ? Promise.resolve(null) : cbGet(function (cb) { item.subject.getAsync(cb); }).then(function (subject) {
        if (!subject) return null;
        return cbDb('cb_bg_pending_get', { p_tok: tok, p_subject: subject, p_version: CB_ADDIN_VERSION }).catch(function () { return null; });
    });
    return pending.then(function (html) {
        if (html) return cbSetHtml(item, '<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;">' + html + '</div>');
        return cbBodyText(item).then(function (text) {
            if (!text || !cbLooksLikeTemplate(text)) return false;
            return cbSetHtml(item, cbFormat(text));
        });
    });
}

// ── Mail ablegen ──
function cbLogCompose(item) {
    var tok = cbTok();
    if (!tok) return Promise.resolve({ skipped: 'nicht gekoppelt' });
    return Promise.all([
        cbGet(function (cb) { item.to.getAsync(cb); }),
        cbGet(function (cb) { item.cc.getAsync(cb); }),
        cbGet(function (cb) { item.subject.getAsync(cb); }),
        cbBodyText(item)
    ]).then(function (v) {
        var to = cbAddr(v[0]).concat(cbAddr(v[1]));
        if (!cbIsBg(to)) return { skipped: 'nicht an BG' };
        var me = '';
        try { me = Office.context.mailbox.userProfile.emailAddress; } catch (e) {}
        return cbDb('cb_bg_log', {
            p_tok: tok, p_dir: 'out', p_key: 'out:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            p_conv: item.conversationId || null, p_subject: v[2] || '', p_sender: me, p_recipients: to.join(', '),
            p_body: v[3] || '', p_at: new Date().toISOString(), p_version: CB_ADDIN_VERSION
        });
    });
}
function cbLogRead(item) {
    var tok = cbTok();
    if (!tok) return Promise.reject(new Error('Noch nicht mit den Copy-Buttons gekoppelt'));
    var from = String((item.from && item.from.emailAddress) || '').toLowerCase();
    var to = cbAddr(item.to).concat(cbAddr(item.cc));
    if (!cbIsBg([from]) && !cbIsBg(to)) return Promise.resolve({ skipped: 'keine BG-Mail' });
    return cbBodyText(item).then(function (text) {
        return cbDb('cb_bg_log', {
            p_tok: tok, p_dir: cbIsBg([from]) ? 'in' : 'out', p_key: item.internetMessageId || item.itemId,
            p_conv: item.conversationId || null, p_subject: item.subject || '', p_sender: from, p_recipients: to.join(', '),
            p_body: text || '', p_at: (item.dateTimeCreated ? new Date(item.dateTimeCreated) : new Date()).toISOString(), p_version: CB_ADDIN_VERSION
        });
    });
}

// ── Befehle und Ereignisse ──
// Knopf "BG formatieren" im Mailfenster
function cbFormatCommand(event) {
    var item = Office.context.mailbox.item;
    cbFormatItem(item).then(function (changed) {
        try {
            item.notificationMessages.replaceAsync('cbfmt', {
                type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
                message: changed ? 'Copy-Buttons: Vorlage formatiert.' : 'Copy-Buttons: keine BG-Vorlage im Text gefunden.',
                icon: 'Icon.16x16', persistent: false
            });
        } catch (e) {}
    }).then(function () { event.completed(); }, function () { event.completed(); });
}
// neues Mailfenster: steht schon eine Copy-Buttons-Vorlage drin (über "E-Mail öffnen"), gleich formatieren
function cbOnNewCompose(event) {
    var item = Office.context.mailbox.item;
    setTimeout(function () {
        cbFormatItem(item).then(function () { event.completed(); }, function () { event.completed(); });
    }, 600);
}
// Senden: Mails an BG in den Copy-Buttons ablegen - das Senden selbst wird nie aufgehalten
function cbOnSend(event) {
    var item = Office.context.mailbox.item;
    var done = false;
    var finish = function () { if (done) return; done = true; event.completed({ allowEvent: true }); };
    setTimeout(finish, 4000);
    cbLogCompose(item).then(finish, finish);
}

// Ereignis- und Knopf-Funktionen anmelden (oben auf Dateiebene, wie Outlook es für Ereignisse verlangt)
if (typeof Office !== 'undefined' && Office.actions && Office.actions.associate) {
    Office.actions.associate('cbFormatCommand', cbFormatCommand);
    Office.actions.associate('cbOnNewCompose', cbOnNewCompose);
    Office.actions.associate('cbOnSend', cbOnSend);
}
