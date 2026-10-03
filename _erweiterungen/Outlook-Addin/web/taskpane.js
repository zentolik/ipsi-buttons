/* Copy-Buttons für Outlook – Aufgabenbereich */
(function () {
    var $ = function (id) { return document.getElementById(id); };
    var show = function (id, on) { $(id).classList.toggle('hidden', !on); };
    var msg = function (id, text, tone) { var el = $(id); el.textContent = text || ''; el.className = 'status' + (tone ? ' ' + tone : ''); };
    var auto = {}; // schon übernommene Mails in dieser Sitzung

    var paintItem = function () {
        var item = Office.context.mailbox.item;
        var linked = !!cbTok();
        show('compose', !!item && item.itemType === Office.MailboxEnums.ItemType.Message && typeof item.body.setAsync === 'function');
        var isRead = !!item && typeof item.body.setAsync !== 'function';
        show('read', isRead);
        msg('readmsg', '');
        msg('composemsg', '');
        if (!isRead) return;
        var from = String((item.from && item.from.emailAddress) || '').toLowerCase();
        var to = cbAddr(item.to).concat(cbAddr(item.cc));
        var bg = cbIsBg([from]) || cbIsBg(to);
        $('readmeta').textContent = (item.subject || '(ohne Betreff)') + ' – ' + (bg ? (cbIsBg([from]) ? 'Antwort von BG' : 'an BG') : 'keine BG-Mail');
        $('logbtn').disabled = !bg || !linked;
        // angeheftet: BG-Mails beim Öffnen gleich übernehmen
        var key = item.internetMessageId || item.itemId;
        if (bg && linked && !auto[key]) {
            auto[key] = 1;
            doLog(true);
        }
    };
    var doLog = function (quiet) {
        msg('readmsg', 'Wird übernommen …');
        cbLogRead(Office.context.mailbox.item).then(function (r) {
            if (r && r.skipped) { msg('readmsg', r.skipped, 'muted'); return; }
            msg('readmsg', r && r.stored ? ('In BG-Ticket #' + r.ticket + ' übernommen' + (r.new ? ' (neu angelegt)' : '') + '.') : 'War schon übernommen (BG-Ticket #' + (r && r.ticket) + ').', 'ok');
        }).catch(function (e) { msg('readmsg', e.message || 'Fehlgeschlagen', 'bad'); });
    };
    var paintLink = function () {
        var tok = cbTok();
        show('pair', !tok);
        show('linked', !!tok);
        if (!tok) return;
        $('who').textContent = 'Mit den Copy-Buttons verbunden …';
        cbDb('cb_bg_whoami', { p_tok: tok, p_version: CB_ADDIN_VERSION }).then(function (r) {
            $('who').textContent = 'Verbunden mit ' + String((r && r.name) || 'Copy-Buttons').replace(/\s*,\s*/g, ' ') + ' · ' + ((r && r.tickets) || 0) + ' BG-Tickets';
        }).catch(function (e) {
            $('who').textContent = e.message || 'Nicht erreichbar';
            $('who').className = 'bad';
            if (/nicht gekoppelt/i.test(e.message || '')) cbTokSet('').then(function () { paintLink(); paintItem(); });
        });
    };

    Office.onReady(function () {
        $('ver').textContent = 'Add-in v' + CB_ADDIN_VERSION;
        $('pairbtn').addEventListener('click', function () {
            var raw = $('code').value.trim();
            if (!raw) { $('code').focus(); return; }
            // Kopplungs-Code aus den Copy-Buttons: "CB1." + Code und Datenbank-Schlüssel
            var pack = null;
            try { if (raw.indexOf('CB1.') === 0) pack = JSON.parse(atob(raw.slice(4))); } catch (e) { pack = null; }
            if (!pack || !pack.c || !pack.k) {
                // nur der kurze Code (abgetippt oder aus einer älteren Copy-Buttons-Version kopiert)
                var short = /^[A-Z0-9]{4}-?[A-Z0-9]{4}$/i.test(raw);
                msg('pairmsg', short
                    ? 'Das ist nur der kurze Code – dem Add-in fehlt damit der Schlüssel. Bitte die Copy-Buttons auf die aktuelle Version bringen (ab 1.0767), einen neuen Code erzeugen, darauf klicken (kopiert ihn) und hier einfügen.'
                    : 'Bitte den Code in den Copy-Buttons per Klick kopieren und hier einfügen (nicht abtippen).', 'bad');
                return;
            }
            $('pairbtn').disabled = true;
            msg('pairmsg', 'Wird gekoppelt …');
            var mbx = '';
            try { mbx = Office.context.mailbox.userProfile.emailAddress; } catch (e) {}
            CB_KEY = pack.k;
            cbDb('cb_bg_link', { p_code: pack.c, p_mailbox: mbx, p_version: CB_ADDIN_VERSION }).then(function (r) {
                return cbTokSet(r.token, pack.k).then(function () { msg('pairmsg', ''); $('code').value = ''; paintLink(); paintItem(); });
            }).catch(function (e) { msg('pairmsg', e.message || 'Fehlgeschlagen', 'bad'); })
              .then(function () { $('pairbtn').disabled = false; });
        });
        $('code').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') $('pairbtn').click(); });
        $('unlink').addEventListener('click', function () {
            var tok = cbTok();
            cbDb('cb_bg_unlink', { p_tok: tok }).catch(function () {}).then(function () { return cbTokSet(''); }).then(function () { paintLink(); paintItem(); });
        });
        $('fmtbtn').addEventListener('click', function () {
            cbFormatItem(Office.context.mailbox.item).then(function (changed) {
                msg('composemsg', changed ? 'Vorlage formatiert.' : 'Keine BG-Vorlage im Text gefunden.', changed ? 'ok' : 'muted');
            });
        });
        $('logbtn').addEventListener('click', function () { doLog(false); });
        try { Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, function () { paintItem(); }); } catch (e) {}
        paintLink();
        paintItem();
    });
})();
