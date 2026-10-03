/* Copy-Buttons für Outlook – gemeinsame Logik
 * - BG-Vorlage formatieren (Rot/Fett wie in den Copy-Buttons)
 * - gesendete Mails an support@viscomp.bg in den Copy-Buttons ablegen (beim Senden)
 * - Antworten von BG ablegen (Aufgabenbereich, auch automatisch beim Öffnen, wenn angeheftet)
 * Läuft im Aufgabenbereich (taskpane.html), in commands.html (Outlook im Web / neues Outlook)
 * und als reine JS-Datei im klassischen Outlook für Windows (Ereignisse).
 */
var CB_ADDIN_VERSION = '1.2';
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
var CB_LABELS = ['Backup Domain', 'Backup Time', 'Target Domain', 'Customer ID', 'Domain', 'DFS', 'Project (IPSI)', 'Project', 'Shop folder'];
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

// ── Mail zerlegen ──
// Aus dem HTML der Mail werden Zeilen (jede merkt sich ihren ersten Knoten). Daran erkennt
// der Zerleger Zitat, Signatur und OTRS-Beiwerk - und das HTML wird an genau denselben
// Stellen gekürzt. Übrig bleibt nur die eigentliche Nachricht, in der Sprache des
// Chat-Editors der Copy-Buttons (Fett, Farben als Namen usw.).
var CB_BLOCK = /^(DIV|P|LI|TR|H[1-6]|BLOCKQUOTE|TABLE|TBODY|THEAD|UL|OL|PRE|HR|SECTION|ARTICLE|HEADER|FOOTER|CENTER|DL|DT|DD|ADDRESS)$/;
var CB_SKIP = /^(STYLE|SCRIPT|HEAD|TITLE|META|LINK|IMG|SVG|OBJECT|IFRAME|NOSCRIPT|TEMPLATE|XML|BUTTON)$/;
function cbLinesOf(root) {
    var lines = [], cur = null, bullet = '';
    var open = function (node, off) { cur = { text: bullet, node: node, off: off }; bullet = ''; lines.push(cur); };
    var walk = function (el, pre) {
        for (var n = el.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3) {
                if (pre) {
                    var parts = n.data.split('\n'), pos = 0;
                    for (var k = 0; k < parts.length; k++) {
                        if (k > 0) cur = null;
                        if (!cur) open(n, pos);
                        cur.text += parts[k];
                        pos += parts[k].length + 1;
                    }
                } else {
                    if (!cur) {
                        var lead = n.data.search(/[^\s\u00a0]/);
                        if (lead < 0) continue;
                        open(n, lead);
                    }
                    cur.text += n.data;
                }
            } else if (n.nodeType === 1) {
                var tag = n.tagName.toUpperCase();
                if (CB_SKIP.test(tag)) continue;
                if (tag === 'BR') { if (!cur) open(n, null); cur = null; continue; }
                var block = CB_BLOCK.test(tag);
                if (block) cur = null;
                if (tag === 'LI') bullet = '• '; // kommt vor die erste Zeile im Punkt
                else if ((tag === 'TD' || tag === 'TH') && cur) cur.text += ' ';
                walk(n, pre || tag === 'PRE' || /white-space\s*:\s*pre/i.test(n.getAttribute('style') || ''));
                if (block) cur = null;
            }
        }
    };
    walk(root, false);
    lines.forEach(function (l) { l.text = l.text.replace(/[\s\u00a0]+/g, ' ').trim(); });
    return lines;
}
// Zitat-Beginn: OTRS ("09/24/2026 14:08 - Name wrote:"), Outlook ("Von: … / Gesendet: …"), sonstige
var CB_OTRS_Q = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),? (\d{1,2}):(\d{2}) - (.{1,80}?) wrote:\s*(.*)$/i;
var CB_QUOTE = [CB_OTRS_Q, /^-{2,}\s*(Original Message|Ursprüngliche Nachricht)/i, /^<snip>$/i, /^(Am|On) .{4,140} (schrieb|wrote).{0,80}:$/i, /^_{8,}$/];
function cbAhead(texts, i, n) {
    var out = [];
    for (var j = i + 1; j < texts.length && out.length < n; j++) if (texts[j]) out.push(texts[j]);
    return out;
}
function cbIsQuote(texts, i) {
    var t = texts[i];
    if (!t) return false;
    for (var k = 0; k < CB_QUOTE.length; k++) if (CB_QUOTE[k].test(t)) return true;
    return /^(Von|From):\s*\S/.test(t) && /^(Gesendet|Sent|Datum|Date|An|To|Bis):/i.test(cbAhead(texts, i, 1)[0] || '');
}
function cbIsSig(texts, i) {
    var t = texts[i];
    if (!t) return false;
    var ahead = cbAhead(texts, i, 6).join('\n');
    if (/^Mit freundlichen Grüßen,?$/i.test(t) && /wwwe|Webdesign|Geschäftsführer/i.test(ahead)) return true;
    if (/^--\s*$/.test(t) && /Best regards|IT Operations|OTRS/i.test(ahead)) return true;
    if (/^(Powered by OTRS|Viscomp OTRS Notification System)/i.test(t)) return true;
    if (/^(Kind |Best )?Regards,?$/i.test(t) && /IT\s+Department|@viscomp\.bg|Viscomp/i.test(ahead)) return true;
    return false;
}
function cbAgentOf(texts) {
    var name = '';
    texts.forEach(function (t, i) {
        if (!/^(Kind |Best )?Regards,?$/i.test(t)) return;
        var a = cbAhead(texts, i, 3);
        if (a.length > 1 && /^[A-ZÀ-Ž][\w'.-]+( [A-ZÀ-Ž][\w'.-]+){1,3}$/.test(a[0]) && /IT\s+Department|@viscomp\.bg|Viscomp/i.test(a.slice(1).join(' '))) name = a[0];
    });
    return name;
}
// was von den Zeilen bleibt: Beginn, Ende (Zitat/Signatur), weggelassene Zeilen
function cbParse(texts) {
    var r = { cut: texts.length, drop: {}, quote: -1 };
    var i, first = -1;
    for (i = 0; i < Math.min(texts.length, 6); i++) {
        if (!texts[i]) continue;
        if (/^\[Ticket#\d+\]/i.test(texts[i])) { r.drop[i] = 1; continue; } // OTRS wiederholt den Betreff
        first = i;
        break;
    }
    // OTRS-Benachrichtigung: "Hello, Name," vor der eigentlichen Anrede
    if (first > -1 && /^(Hello|Hallo|Dear),?\s.{1,60},$/i.test(texts[first]) && /^(Hi|Hello|Hallo|Dear|Hey)\b/i.test(cbAhead(texts, first, 1)[0] || '')) r.drop[first] = 1;
    var content = false;
    for (i = 0; i < texts.length; i++) {
        if (r.drop[i]) continue;
        if (cbIsQuote(texts, i)) { r.cut = i; r.quote = i; break; }
        if (content && cbIsSig(texts, i)) { r.cut = i; break; }
        if (texts[i]) content = true;
    }
    return r;
}
function cbTidy(text) {
    return String(text || '').replace(/\[cid:[^\]]*\]/gi, '').replace(/<mailto:[^>]*>/gi, '').replace(/\[\d{1,2}\]/g, '')
        .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
// Uhrzeit in einer Zeitzone (OTRS der BG schreibt Ortszeit Sofia) -> ISO
function cbTzOff(date, tz) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
        .formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - date.getTime();
}
function cbZoned(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    try {
        var off = cbTzOff(new Date(guess), tz);
        return new Date(guess - cbTzOff(new Date(guess - off), tz)).toISOString();
    } catch (e) { return new Date(guess).toISOString(); }
}
function cbResult(texts, p, subject) {
    var keep = [];
    for (var i = 0; i < p.cut; i++) if (!p.drop[i]) keep.push(texts[i]);
    var all = texts.join('\n');
    var r = {
        bgno: (/\[Ticket#(\d+)\]/i.exec(subject || '') || [])[1] || '',
        kind: /Ticket locked notification/i.test(subject || '') ? 'locked' : 'msg',
        agent: cbAgentOf(texts),
        text: cbTidy(keep.join('\n')),
        body: cbTidy(all),
        html: '', orig: '', origAt: null
    };
    if (r.kind === 'locked') {
        var m0 = /in the hands of (.{2,60}?) and will/i.exec(all.replace(/\s+/g, ' '));
        if (m0) r.agent = m0[1].trim();
    }
    // zitierte eigene Mail (OTRS: "MM/DD/YYYY HH:MM - Name wrote:") - fehlt sie im Ticket, wird sie daraus ergänzt
    var start = -1, m = null;
    if (p.quote > -1 && (m = CB_OTRS_Q.exec(texts[p.quote]))) start = p.quote;
    else if (r.kind === 'locked') texts.forEach(function (t, i) { if (start < 0 && /^<snip>$/i.test(t)) start = i; });
    if (start > -1) {
        var o = m && m[7] ? [m[7]] : [];
        for (var j = start + 1; j < texts.length; j++) {
            if (cbIsSig(texts, j) || cbIsQuote(texts, j)) break;
            o.push(texts[j]);
        }
        r.orig = cbTidy(o.join('\n'));
        if (m) r.origAt = cbZoned(+m[3], +m[1], +m[2], +m[4], +m[5], 'Europe/Sofia');
        r.origLines = [start, j, !!m]; // für das HTML der zitierten Mail
    }
    return r;
}
// Farben als Namen wie im Chat-Editor (Grau/Schwarz/Weiß fallen weg - die passt der Dunkelmodus an)
function cbRgb(v) {
    v = String(v || '').replace(/!important/i, '').trim().toLowerCase();
    var m;
    if ((m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v))) return [parseInt(m[1] + m[1], 16), parseInt(m[2] + m[2], 16), parseInt(m[3] + m[3], 16)];
    if ((m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec(v))) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    if ((m = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(v))) return [+m[1], +m[2], +m[3]];
    var named = { red: [255, 0, 0], darkred: [139, 0, 0], maroon: [128, 0, 0], orange: [255, 165, 0], yellow: [255, 255, 0], green: [0, 128, 0], lime: [0, 255, 0], teal: [0, 128, 128],
        blue: [0, 0, 255], navy: [0, 0, 128], purple: [128, 0, 128], fuchsia: [255, 0, 255], magenta: [255, 0, 255], aqua: [0, 255, 255], cyan: [0, 255, 255] };
    return named[v] || null;
}
function cbHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min, h = 0;
    var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s: s, l: l };
}
function cbColorName(v) {
    var c = cbRgb(v);
    if (!c) return '';
    var x = cbHsl(c);
    if (x.s < 0.3 || x.l < 0.12 || x.l > 0.9) return '';
    return x.h < 15 || x.h >= 330 ? 'red' : x.h < 65 ? 'orange' : x.h < 170 ? 'green' : x.h < 260 ? 'blue' : 'purple';
}
function cbMarkName(v) {
    var c = cbRgb(v);
    if (!c) return '';
    var x = cbHsl(c);
    if (x.s < 0.3 || x.l < 0.2 || x.l > 0.97) return '';
    return x.h >= 40 && x.h < 75 ? 'yellow' : x.h >= 75 && x.h < 165 ? 'green' : x.h >= 165 && x.h < 260 ? 'blue' : 'pink';
}
// leere Zeilen, Umbrüche und Linien am Anfang und Ende entfernen (auch verschachtelt)
function cbTrimEdges(el) {
    ['firstChild', 'lastChild'].forEach(function (side) {
        var n = el[side];
        while (n) {
            var next = side === 'firstChild' ? n.nextSibling : n.previousSibling;
            var tag = n.nodeType === 1 ? n.tagName.toUpperCase() : '';
            var blank = n.nodeType === 3 ? !n.data.replace(/[\s\u00a0]+/g, '')
                : n.nodeType !== 1 || tag === 'BR' || tag === 'HR' || CB_SKIP.test(tag) || !n.textContent.replace(/[\s\u00a0]+/g, '');
            if (blank) { n.parentNode.removeChild(n); n = next; continue; }
            if (n.nodeType === 1) cbTrimEdges(n);
            break;
        }
    });
}
function cbChatHtml(root) {
    var out = '';
    var walk = function (el, pre, f) { // f: schon aktive Formatierung (nichts doppelt verschachteln)
        for (var n = el.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3) {
                // nur ein geschütztes Leerzeichen: in Outlook eine Leerzeile - bleibt als &nbsp; erhalten
                out += pre ? cbEsc(n.data).replace(/\n/g, '<br>') : /^[ \u00a0]*\u00a0[ \u00a0]*$/.test(n.data) ? '&nbsp;' : cbEsc(n.data.replace(/[\s\u00a0]+/g, ' '));
                continue;
            }
            if (n.nodeType !== 1) continue;
            var tag = n.tagName.toUpperCase();
            if (CB_SKIP.test(tag)) continue;
            if (tag === 'BR') { out += '<br>'; continue; }
            if (tag === 'HR') { out += '<hr>'; continue; }
            var st = n.getAttribute('style') || '';
            var css = function (prop) { var m = new RegExp('(?:^|;)\\s*' + prop + '\\s*:\\s*([^;]+)', 'i').exec(st); return m ? m[1].trim() : ''; };
            var open = [], close = [], g = Object.assign({}, f);
            var wrap = function (o, c) { open.push(o); close.unshift(c); };
            if (/^(P|DIV|H[1-6]|CENTER|ADDRESS|TR|DT|DD|SECTION|ARTICLE|TABLE|PRE)$/.test(tag)) wrap('<div>', '</div>');
            else if (tag === 'UL' || tag === 'OL') wrap('<' + tag.toLowerCase() + '>', '</' + tag.toLowerCase() + '>');
            else if (tag === 'LI') wrap('<li>', '</li>');
            else if (tag === 'BLOCKQUOTE') wrap('<blockquote>', '</blockquote>');
            else if (tag === 'TD' || tag === 'TH') wrap('', ' ');
            else if (tag === 'A') {
                var href = (n.getAttribute('href') || '').trim();
                if (!g.a && /^(https?:\/\/|mailto:)/i.test(href)) { wrap('<a href="' + cbEsc(href) + '">', '</a>'); g.a = 1; }
            }
            if (!g.b && (/^(B|STRONG|H[1-6])$/.test(tag) || /^(bold|bolder|[6-9]00)/i.test(css('font-weight')))) { wrap('<b>', '</b>'); g.b = 1; }
            if (!g.i && (/^(I|EM)$/.test(tag) || /italic/i.test(css('font-style')))) { wrap('<i>', '</i>'); g.i = 1; }
            if (!g.u && tag !== 'A' && (tag === 'U' || /underline/i.test(css('text-decoration')))) { wrap('<u>', '</u>'); g.u = 1; }
            if (!g.s && (/^(S|STRIKE|DEL)$/.test(tag) || /line-through/i.test(css('text-decoration')))) { wrap('<s>', '</s>'); g.s = 1; }
            var col = tag === 'A' ? '' : cbColorName(css('color') || n.getAttribute('color') || '');
            if (col && col !== g.c) { wrap('<span data-cb_c="' + col + '">', '</span>'); g.c = col; }
            var mk = cbMarkName(css('background-color'));
            if (mk && mk !== g.m) { wrap('<mark data-cb_m="' + mk + '">', '</mark>'); g.m = mk; }
            out += open.join('');
            walk(n, pre || tag === 'PRE' || /pre/i.test(css('white-space')), g);
            out += close.join('');
        }
    };
    walk(root, false, {});
    var prev;
    do {
        prev = out;
        out = out.replace(/<(b|i|u|s|li|blockquote)>\s*<\/\1>/g, '').replace(/<span data-cb_c="\w+">\s*<\/span>/g, '').replace(/<mark data-cb_m="\w+">\s*<\/mark>/g, '')
            .replace(/<a href="[^"]*">\s*<\/a>/g, '').replace(/<(ul|ol)>\s*<\/\1>/g, '').replace(/<div>\s*<\/div>/g, '');
    } while (out !== prev);
    var empty = '(?:\\s|&nbsp;|<br>|<div>(?:\\s|&nbsp;|<br>)*<\\/div>)';
    out = out.replace(new RegExp('^' + empty + '+'), '').replace(new RegExp(empty + '+$'), '')
        .replace(/(<div>(?:\s|&nbsp;|<br>)*<\/div>\s*){2,}/g, '<div><br></div>').replace(/(<br>\s*){3,}/g, '<br><br>')
        .replace(/(<\/(ul|ol)>)\s*<div>(?:\s|&nbsp;|<br>)*<\/div>/g, '$1') // Listen haben schon Abstand
        .replace(/<div>(?:\s|&nbsp;)+<\/div>/g, '<div><br></div>');
    return out.length > 150000 ? '' : out;
}
// äußere Hüllen ohne Bedeutung weg (<div><div>…</div></div>, OTRS setzt die ganze Antwort kursiv)
function cbUnwrap(html) {
    if (!html) return html;
    var b = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html').body;
    for (var k = 0; k < 40; k++) {
        var kids = Array.prototype.filter.call(b.childNodes, function (n) { return n.nodeType === 1 || n.data.replace(/[\s\u00a0]+/g, ''); });
        if (kids.length !== 1 || kids[0].nodeType !== 1 || !/^(DIV|I)$/.test(kids[0].tagName)) break;
        b.innerHTML = kids[0].innerHTML;
    }
    return b.innerHTML.trim();
}
// ganze Mail (HTML) -> { bgno, kind, agent, text, body, html, orig, origAt }
function cbParseHtml(html, subject) {
    var doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    var root = doc.body;
    var lines = cbLinesOf(root);
    var texts = lines.map(function (l) { return l.text; });
    var p = cbParse(texts);
    var r = cbResult(texts, p, subject);
    // zitierte eigene Mail mit Formatierung (Rot, Fett …) - zweite Kopie, daraus nur das Zitat
    if (r.orig && r.origLines) {
        try {
            var doc2 = new DOMParser().parseFromString(String(html || ''), 'text/html'), root2 = doc2.body, lines2 = cbLinesOf(root2), rg = doc2.createRange();
            var os = r.origLines[0], oe = r.origLines[1];
            if (oe < lines2.length && root2.lastChild) {
                var le = lines2[oe];
                if (le.off !== null && le.node.nodeType === 3) rg.setStart(le.node, le.off); else rg.setStartBefore(le.node);
                rg.setEndAfter(root2.lastChild);
                rg.deleteContents();
            }
            var ls = lines2[os];
            rg.setStartBefore(root2.firstChild);
            var k = r.origLines[2] && ls.node.nodeType === 3 ? ls.node.data.indexOf('wrote:', ls.off || 0) : -1;
            if (k > -1) rg.setEnd(ls.node, k + 6); else rg.setEndAfter(ls.node);
            rg.deleteContents();
            cbTrimEdges(root2);
            r.origHtml = cbUnwrap(cbChatHtml(root2));
        } catch (e) { r.origHtml = ''; }
    }
    delete r.origLines;
    if (r.kind === 'locked') return r;
    var rng = doc.createRange();
    var at = function (l, end) {
        if (l.off !== null && l.node.nodeType === 3) { if (end) rng.setEnd(l.node, l.off); else rng.setStart(l.node, l.off); }
        else if (end) rng.setEndBefore(l.node); else rng.setStartBefore(l.node);
    };
    try {
        if (p.cut < lines.length && root.lastChild) { at(lines[p.cut], false); rng.setEndAfter(root.lastChild); rng.deleteContents(); }
        Object.keys(p.drop).map(Number).sort(function (a, b) { return b - a; }).forEach(function (i) {
            if (i >= p.cut) return;
            at(lines[i], false);
            if (i + 1 < p.cut && i + 1 < lines.length) at(lines[i + 1], true); else rng.setEndAfter(root.lastChild);
            rng.deleteContents();
        });
        cbTrimEdges(root);
        r.html = cbUnwrap(cbChatHtml(root));
    } catch (e) { r.html = ''; }
    return r;
}
function cbParseText(text, subject) {
    var texts = String(text || '').replace(/\r\n?/g, '\n').split('\n').map(function (t) { return t.replace(/[\s\u00a0]+/g, ' ').trim(); });
    var r = cbResult(texts, cbParse(texts), subject);
    delete r.origLines;
    return r;
}
function cbBodyHtml(item) { return cbGet(function (cb) { item.body.getAsync(Office.CoercionType.Html, cb); }); }
// Inhalt einer Mail - aus dem HTML (mit Zeilenumbrüchen und Formatierung), sonst aus dem reinen Text
function cbMailParts(item, subject) {
    return cbBodyHtml(item).then(function (html) {
        if (html && typeof DOMParser !== 'undefined') {
            try { return cbParseHtml(html, subject); } catch (e) {}
        }
        return cbBodyText(item).then(function (text) { return cbParseText(text, subject); });
    });
}
function cbLogArgs(parts) {
    return { p_bgno: parts.bgno || null, p_kind: parts.kind, p_agent: parts.agent || null, p_text: parts.text || null, p_html: parts.html || null,
        p_orig: parts.orig || null, p_orig_at: parts.origAt || null, p_orig_html: parts.origHtml || null };
}

// ── Mail ablegen ──
function cbLogCompose(item) {
    var tok = cbTok();
    if (!tok) return Promise.resolve({ skipped: 'nicht gekoppelt' });
    return Promise.all([
        cbGet(function (cb) { item.to.getAsync(cb); }),
        cbGet(function (cb) { item.cc.getAsync(cb); }),
        cbGet(function (cb) { item.subject.getAsync(cb); })
    ]).then(function (v) {
        var to = cbAddr(v[0]).concat(cbAddr(v[1]));
        if (!cbIsBg(to)) return { skipped: 'nicht an BG' };
        var me = '';
        try { me = Office.context.mailbox.userProfile.emailAddress; } catch (e) {}
        return cbMailParts(item, v[2] || '').then(function (parts) {
            return cbDb('cb_bg_log', Object.assign({
                p_tok: tok, p_dir: 'out', p_key: 'out:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
                p_conv: item.conversationId || null, p_subject: v[2] || '', p_sender: me, p_recipients: to.join(', '),
                p_body: parts.body || '', p_at: new Date().toISOString(), p_version: CB_ADDIN_VERSION
            }, cbLogArgs(parts)));
        });
    });
}
function cbLogRead(item) {
    var tok = cbTok();
    if (!tok) return Promise.reject(new Error('Noch nicht mit den Copy-Buttons gekoppelt'));
    var from = String((item.from && item.from.emailAddress) || '').toLowerCase();
    var to = cbAddr(item.to).concat(cbAddr(item.cc));
    if (!cbIsBg([from]) && !cbIsBg(to)) return Promise.resolve({ skipped: 'keine BG-Mail' });
    return cbMailParts(item, item.subject || '').then(function (parts) {
        return cbDb('cb_bg_log', Object.assign({
            p_tok: tok, p_dir: cbIsBg([from]) ? 'in' : 'out', p_key: item.internetMessageId || item.itemId,
            p_conv: item.conversationId || null, p_subject: item.subject || '', p_sender: from, p_recipients: to.join(', '),
            p_body: parts.body || '', p_at: (item.dateTimeCreated ? new Date(item.dateTimeCreated) : new Date()).toISOString(), p_version: CB_ADDIN_VERSION
        }, cbLogArgs(parts)));
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
