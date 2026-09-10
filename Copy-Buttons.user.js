// ==UserScript==
// @name         Copy-Buttons
// @namespace    https://github.com/zentolik
// @version      1.05
// @description  doing stuff ʕ·͡ᴥ·ʔ
// @author       Zentolik
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @match        https://ipsi.securewebsystems.net/contract/detailed/*
// @match        https://ipsi.securewebsystems.net/dailyresults
// @match        https://app.absence.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=euroweb.de
// @updateURL    https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @downloadURL  https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

!(function() { // ʕ·͡ᴥ·ʔ hi & ty <3
    'use strict';
    const SCRIPT_VERSION = '1.05';
    console.log(`ʕ·͡ᴥ·ʔ *bup* v${SCRIPT_VERSION}`);
    let settings = {
        button_position: true, // ändert die position vom btn (wenn auf "false", empfähle ich "copy_icon" zu aktivieren") //
        button_position_space: '20px', // Abstand vom Button nach unten und rechts //
        copy_work_button: true, // Pfad geht bis zu "L:\EDO\ID\WORK\" //
        copy_drive: 'a', // Laufwerk für den Pfad //
        copy_icon: false, // copy-icon als button-text (anstatt des pfades) //
        button_color: 'blue', // red / yellow / blue / cyan / green / gray / #rrggbb (HEX-Color) //
        delete_button: false, // erstellt ein delete-button, der beim klicken die projekt-daten aus dem local storage löscht //
        vsc_open: false, // Linksklick auf den Pfad-Button listet die Ordner im Pfad und öffnet sie in VS Code (benötigt den lokalen ipsi-vsc-helper) //
        sandbox_check: true, // prüft beim Laden der Seite nacheinander alle Formix-Einträge und markiert in der Status-Spalte, ob die Sandbox aktiviert ist //
        darkmode: false,
        default_email_client: 'browser',
        department: '',
        user: '',
        user_email: '',
        user_role: '', // Rolle aus der IPSI-Kopfzeile – im User-Panel änderbar //
        user_ipsi_id: '', // Mitarbeiter-ID aus IPSI – im User-Panel änderbar //
        ls_sort: 'project_id', // Sortierkriterium der Projekt-Auflistung: 'project_id' oder 'client_id' (wird auch als führender Wert im Label angezeigt)
        ps_labels: true, // zeigt in der Meilensteine-Übersicht die PS-/Zeit-Labels an //
        auto_collect: true, // liest die Projektdaten (KD-Nr., DFS-Speicherort usw.) automatisch beim Laden der Seite aus – Speicherort über die DFS-API, Domains-Panel nur als Fallback //
        orga_icons: { // Icons für die Status der Orga-Projektnotiz (leer = kein Icon) – einstellbar über das Zahnrad im Orga-Modal //
            open: '📁',
            progress: '⚙️',
            done: '✅',
            canceled: '❌',
            delayed: '🕒',
        },
        orga_line_mode: 'br', // Zeilenabstand in der Orga-Notiz: 'br' (Standard) oder 'br2' (zwei <br>) – einstellbar über das Zahnrad im Orga-Modal //
        week_panel: true, // Panel mit den Wochenstunden auf der Tagesresultate-Seite //
        week_hours: 39, // Soll-Stunden pro Arbeitswoche //
        absence_day_hours: 7.8, // Stunden, mit denen ein Abwesenheitstag (Urlaub, Krank, ...) gezählt wird //
        absence_work_reasons: ['Office', 'Mobile Office'], // Abwesenheits-Arten, an denen normal gestempelt wird (werden NICHT angerechnet) //
        absence_count_holidays: true, // Feiertage wie einen Abwesenheitstag anrechnen //
        absence_include_pending: true, // noch nicht genehmigte Abwesenheiten mitzählen //
        absence_hours_mode: 'max', // 'max' = gestempelte oder angerechnete Zeit (das Höhere) / 'sum' = beides addieren / 'credit' = an Abwesenheitstagen nur die Gutschrift //
        absence_auto_sync: false, // absence.io automatisch in einem Hintergrund-Tab abfragen, wenn die Daten älter als 12 Std. sind //
        week_view: 'month', // Mini-Kalender im Wochenstunden-Panel: 'week' (aktuelle Woche) oder 'month' (ganzer Monat) – umschaltbar über das Zahnrad im Panel //
        week_hours_scope: 'both', // Soll-/Offen-Anzeige: 'week' / 'month' (ganzer Monat) / 'both' (Woche groß, Monat klein) – umschaltbar über das Zahnrad im Panel //
        week_until_hours: 4, // Feierabend-Uhrzeit erst einblenden, wenn weniger als so viele Stunden offen sind – einstellbar über das Zahnrad im Panel //
        cal_collapsed: 'closed', // Mini-Kalender beim Seitenstart: 'open' / 'closed' – umschaltbar über das Zahnrad im Panel //
        cal_remember: 'off', // ein-/ausgeklappten Zustand des Mini-Kalenders merken: 'on' / 'off' //
        cal_collapsed_mode: 'week', // was der eingeklappte Mini-Kalender in der Monats-Ansicht zeigt: 'week' (nur die aktuelle Woche) / 'none' (nichts) //
        keys: { nav_prev: 'ArrowLeft', nav_next: 'ArrowRight', nav_today: 't', view_toggle: 'm', cal_toggle: 'Enter' }, // Tastatur-Steuerung des Wochenstunden-Panels – anpassbar über das Zahnrad im Panel //
        phone_prefix_show: true, // zeigt neben Firma und Brand klein "(Vorwahl: X)" aus der Amtsholungs-Liste //
        phone_prefixes: {}, // eigene Amtsholungen, z.B. { 'net365': '16' } – überschreibt die Liste im Script (Klick auf "(Vorwahl: …)") //
        phone_links: true, // Telefon-/Handy-Nummern in den Vertragsdaten als 3CX-Anruflink + Copy-Icon //
        phone_scheme: 'tel', // Protokoll des Anruflinks: 'tel' / 'callto' / 'sip' – 3CX registriert diese unter Windows //
        phone_intl_prefix: '00', // so werden "+49…"-Nummern gewählt ('00' -> 0049…, leer -> +49… bleibt stehen) //
        phone_note: true, // nach dem Anruf die Leiste "Telefonat läuft" einblenden und danach eine Telefon-Notiz anbieten //
        phone_note_scan: true, // alle Seiten der Kundenkommunikation nach eigenen Telefon-Notizen durchsuchen (läuft während des Telefonats) //
        phone_note_panel_auto: true, // Notizzettel (Kundendaten + Notizfeld) beim Anruf automatisch aufklappen //
        phone_note_line: '{datum}, {zeit} Uhr – {nummer} | {doku}', // Zeile der Telefon-Notiz; Platzhalter: {datum} {zeit} {nummer} {waehlnummer} {dauer} {label} {doku} //
    };

    const saveSettings = (newSettings) => { // Settings speichern – auch außerhalb des Settings-Popups nutzbar //
        settings = { ...settings, ...newSettings };
        localStorage.setItem('settings', JSON.stringify(settings));
    };

    let refreshPsLabels = () => {}; // wird von "setupPsLabels" gesetzt, damit das Setting sofort greift //
    let refreshUserButtons = () => {}; // wird in "setupDepartmentDropdown" auf updateCopyButton gesetzt //

    // ── Nutzerdaten aus IPSI ──────────────────────────────────────────────────
    // Login-Name und Rolle stehen in der Kopfzeile jeder IPSI-Seite; voller Name,
    // Mitarbeiter-ID, Abteilung und Team stehen auf "/calendar" – die Selects sind
    // dort serverseitig auf den angemeldeten Nutzer vorbelegt (option[selected]).
    // Die Werte dienen im User-Panel als Platzhalter und werden benutzt, solange in
    // den Feldern nichts Eigenes steht. Der Sync-Button holt sie erneut und schreibt
    // sie sichtbar in die Felder.
    let ipsiUser = { firstname: '', lastname: '', user: '', user_email: '', user_role: '',
                     user_ipsi_id: '', department: '', team: '', department_value: '' };
    const ipsiDefault = { user: false, user_email: false, user_role: false, user_ipsi_id: false, department: false };

    const cbStoredSettings = () => { // was wirklich gespeichert ist (nicht die Laufzeit-Defaults)
        try { return JSON.parse(localStorage.getItem('settings') || '{}'); } catch (e) { return {}; }
    };

    const cbPlainName = (text) => String(text || '').toLowerCase()
        .split('ä').join('ae').split('ö').join('oe').split('ü').join('ue').split('ß').join('ss');

    const cbIpsiHeader = (selector, doc) => { // Werte aus der IPSI-Kopfzeile
        const node = (doc || document).querySelector('.userIdentity ' + selector);
        return node ? node.textContent.trim() : '';
    };
    const cbIpsiLogin = (doc) => cbIpsiHeader('.userName', doc).split('@')[0]; // z.B. "k.korkmaz"

    const cbSetSelectValue = (select, value) => { // fehlende Optionen ergänzen, damit jeder Wert passt
        if (!select || !value) return;
        const known = Array.prototype.some.call(select.options, (option) => option.value === value);
        if (!known) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        }
        select.value = value;
    };

    const cbSelectDepartment = (value) => { // "Webdepartment Berlin/Team X" auf beide Selects verteilen
        const mainSelect = document.getElementById('main_dept_select');
        const subSelect = document.getElementById('sub_dept_select_webdepartmentberlin');
        const subBox = document.getElementById('cb_user_webdepartmentberlin_container');
        if (!mainSelect || !value) return;
        const isWeb = value.indexOf('Webdepartment Berlin') === 0;
        cbSetSelectValue(mainSelect, isWeb ? 'Webdepartment Berlin' : value);
        if (subBox) subBox.style.display = isWeb ? 'block' : 'none';
        if (isWeb && subSelect) cbSetSelectValue(subSelect, value.split('/')[1] || '');
    };

    const cbFetchIpsiUser = () => fetch('/calendar', { credentials: 'same-origin' })
        .then(response => response.ok ? response.text() : '')
        .then(html => {
            if (!html) return;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const picked = (id) => { // die vorbelegte Option des jeweiligen Selects
                const select = doc.getElementById(id);
                const option = select ? select.querySelector('option[selected]') : null;
                return option
                    ? { text: option.textContent.trim(), value: (option.getAttribute('value') || '').trim() }
                    : { text: '', value: '' };
            };
            const employee = picked('employee'); // Format "Nachname, Vorname"
            const parts = employee.text.split(',');
            const lastname = (parts[0] || '').trim(), firstname = (parts[1] || '').trim();
            const login = cbIpsiLogin() || cbIpsiLogin(doc);
            if (login) ipsiUser.user_email = login;
            ipsiUser.user_role = cbIpsiHeader('.userRole') || cbIpsiHeader('.userRole', doc);
            // Sicherheitsnetz: der vorbelegte Mitarbeiter muss zum Login passen
            if (!firstname || !lastname || cbPlainName(login).indexOf(cbPlainName(lastname)) === -1) {
                console.log('ʕ·͡ᴥ·ʔ IPSI-Nutzerdaten passen nicht zum Login – keine Vorbelegung');
                return;
            }
            ipsiUser.firstname = firstname;
            ipsiUser.lastname = lastname;
            ipsiUser.user = firstname + ', ' + lastname; // gleiches Format wie settings.user
            ipsiUser.user_ipsi_id = employee.value;
            ipsiUser.department = picked('department').text;
            ipsiUser.team = picked('team').text;
            // settings.department fuehrt das Team nur beim Webdepartment Berlin mit
            ipsiUser.department_value = (ipsiUser.department === 'Webdepartment Berlin' && ipsiUser.team)
                ? ipsiUser.department + '/' + ipsiUser.team
                : ipsiUser.department;
        })
        .catch(() => { console.log('ʕ·͡ᴥ·ʔ IPSI-Nutzerdaten nicht erreichbar'); });

    const cbApplyIpsiUser = () => { // Platzhalter setzen und Defaults in die settings legen
        const placeholder = (id, value) => {
            const input = document.getElementById(id);
            if (input && value) input.placeholder = value;
        };
        placeholder('cb_user_firstname', ipsiUser.firstname);
        placeholder('cb_user_lastname', ipsiUser.lastname);
        placeholder('cb_user_email', ipsiUser.user_email);
        placeholder('cb_user_role', ipsiUser.user_role);
        placeholder('cb_user_ipsi_id', ipsiUser.user_ipsi_id);

        const stored = cbStoredSettings();
        const useDefault = (key, value) => { // ein gespeicherter eigener Wert hat immer Vorrang
            if (stored[key]) { ipsiDefault[key] = false; return; }
            if (!value) return;
            settings[key] = value;
            ipsiDefault[key] = true;
        };
        useDefault('user', ipsiUser.user);
        useDefault('user_email', ipsiUser.user_email);
        useDefault('user_role', ipsiUser.user_role);
        useDefault('user_ipsi_id', ipsiUser.user_ipsi_id);
        useDefault('department', ipsiUser.department_value);

        const mainSelect = document.getElementById('main_dept_select');
        if (mainSelect && !mainSelect.value && ipsiDefault.department) { // Abteilung + Team vorauswählen
            cbSelectDepartment(settings.department);
        }
        if (ipsiDefault.user || ipsiDefault.user_email || ipsiDefault.user_role
            || ipsiDefault.user_ipsi_id || ipsiDefault.department) refreshUserButtons();
    };

    const cbFillPanelFromIpsi = () => { // Sync-Button: IPSI-Werte sichtbar in die Felder schreiben
        const setValue = (id, value) => {
            const input = document.getElementById(id);
            if (input && value) input.value = value;
        };
        setValue('cb_user_firstname', ipsiUser.firstname);
        setValue('cb_user_lastname', ipsiUser.lastname);
        setValue('cb_user_email', ipsiUser.user_email);
        setValue('cb_user_role', ipsiUser.user_role);
        setValue('cb_user_ipsi_id', ipsiUser.user_ipsi_id);
        cbSelectDepartment(ipsiUser.department_value);
    };

    if (window.location.pathname.indexOf('/detailed/') !== -1) { // nur dort gibt es das User-Panel
        ipsiUser.user_email = cbIpsiLogin();
        ipsiUser.user_role = cbIpsiHeader('.userRole');
        cbFetchIpsiUser().then(cbApplyIpsiUser);
    }

    const selectors = { // Attribute, zum selektieren der Container
        server_attr: ['data-v-7fcb082d','data-v-8744275e'], // selector zum edo-btn
        href_attr: 'data-v-2a36c6f6', // selector zur live-domain vom Kunden
        dfs_attr: 'data-v-08642a33',
    };

    // ICONS- / SVG-Variablen
    const xmlns_svg = 'http://www.w3.org/2000/svg',
          copy_svg = `<svg xmlns="${xmlns_svg}" x="0px" y="0px" viewBox="0 0 115.77 122.88" version="1.1" id="Layer_1" xmlns:xlink="http://www.w3.org/1999/xlink" style="enable-background:new 0 0 115.77 122.88; width: 11px;" fill="white" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>`,
          folder_svg = `<svg xmlns="${xmlns_svg}" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M 5 4 C 3.3544268 4 2 5.3555411 2 7 L 2 16 L 2 26 L 2 43 C 2 44.644459 3.3544268 46 5 46 L 45 46 C 46.645063 46 48 44.645063 48 43 L 48 26 L 48 16 L 48 11 C 48 9.3549372 46.645063 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.562937 10 46 10.437063 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4364589 4.4355732 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 26 L 46 43 C 46 43.562937 45.562937 44 45 44 L 5 44 C 4.4355732 44 4 43.563541 4 43 L 4 26 L 4 16 C 4 15.43497 4.4349698 15 5 15 z"></path></svg>`,
          sun_svg = `<svg xmlns="${xmlns_svg}" width="13px" height="13px" viewBox="0 0 24 24" fill="none"><path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
          moon_svg = `<svg xmlns="${xmlns_svg}" width="13px" height="13px" viewBox="0 0 24 24" fill="none"><path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

    const edoList = ['pandava', 'nidhogg', 'cerberus']; // EDO-Liste
    let edo = '',
        notifications = [],
        loopListener = true,
        project_id = window.location.pathname.split('detailed/')[1]; // Projekt-ID (NICHT KD-NR)

    // ── Seiten-Typ: Projekt- oder Vertrags-Seite ─────────────────────
    // Die Vertrags-Seite (/contract/detailed/…) kennt weder Projekt-ID noch Projekt-Typ.
    // Alles andere (KD-Nr., Adresse, E-Mail, Firma/Brand, DFS-Speicherort, Live-Domain)
    // steht dort genauso zur Verfügung und wird deshalb auch dort genutzt.
    const page_type = window.location.pathname.includes('/contract/detailed/') ? 'contract' : 'project';
    const is_contract = page_type === 'contract';
    const url_id = window.location.pathname.split('detailed/')[1] || ''; // Projekt-ID (Projekt-Seite) bzw. KD-Nr. (Vertrags-Seite)
    if (is_contract) project_id = ''; // auf der Vertrags-Seite gibt es kein Projekt

    // Info-Panel mit Firma / Brand / Adresse / E-Mail:
    // Projekt-Seite  -> "collapseOne" (Projektinformationen)
    // Vertrags-Seite -> "collapseTwo" (Vertragsdaten)
    const INFO_PANEL_ID = is_contract ? 'collapseTwo' : 'collapseOne';
    const infoPanelLabels = () => Array.from(document.querySelectorAll(`#${INFO_PANEL_ID} .panel-body p b`));
    const findInfoLabel = (...names) => infoPanelLabels().find(el => names.includes((el.innerText || '').toLowerCase().trim()));

    // Die Vertrags-Seite schreibt den Ort als "ZIP : 84405, Dorfen", die Projekt-Seite als
    // "Dorfen, ZIP 84405" – damit die Daten überall identisch aussehen, wird das angeglichen.
    const normalizeLocation = (value) => {
        const text = String(value || '').trim();
        const zip = text.match(/^ZIP\s*:?\s*(\d{4,5})\s*,\s*(.+)$/i);
        return zip ? `${zip[2].trim()}, ZIP ${zip[1]}` : text;
    };

    // Speicher-Key im localStorage: Projekte weiterhin unter der reinen (numerischen)
    // Projekt-ID, Verträge unter "contract_<KD-Nr.>" – so überschreiben sich beide Seiten nicht.
    const CONTRACT_KEY_PREFIX = 'contract_';
    const storage_key = is_contract ? CONTRACT_KEY_PREFIX + url_id : url_id;

    const lsKeyInfo = (key) => { // Keys aus dem lokalen Speicher einordnen (für die Auflistung im Settings-Popup)
        if (/^\d+$/.test(key)) return { id: key, type: 'project', link: `/project/detailed/${key}`, label: 'Projektlink', title: `Link zur Projekt-Seite ${key}` };
        const contract_id = key.startsWith(CONTRACT_KEY_PREFIX) ? key.slice(CONTRACT_KEY_PREFIX.length) : '';
        if (/^\d+$/.test(contract_id)) return { id: contract_id, type: 'contract', link: `/contract/detailed/${contract_id}`, label: 'Vertragslink', title: `Link zur Vertrags-Seite ${contract_id}` };
        return null;
    };
    console.log(`ʕ·͡ᴥ·ʔ Seite: ${page_type} | Speicher-Key: ${storage_key}`);

    if (location.hostname.indexOf('absence.io') !== -1) { // auf absence.io wird nur der Abwesenheits-Sync gebraucht
        cbAbsenceSync();
        return;
    }


    const loadFromLocalStorage = () => { // Funktion, zum laden der Settings, aus dem lokalen Speicher
        const storedData = localStorage.getItem(storage_key),
              storedSettings = localStorage.getItem('settings'); // (versucht) "settings" aus dem lokalen Speicher zu ziehen
        if (storedSettings) { // Prüft, ob sich im lokalen Speicher sich "settings" befinden.
            let parsedSettings = JSON.parse(storedSettings);
            Object.keys(settings).forEach(key => { // Prüfen, ob Setting-Keys im Code existieren, die im lokalen Speicher nicht exisiteren
                if (!(key in parsedSettings)) { // fügt fehlende Keys in den lokalen Speicher hinzu
                    parsedSettings[key] = settings[key];
                }
            });

            Object.keys(parsedSettings).forEach(key => { // Prüft, die Setting-Keys aus'm localen Speicher, mit den Setting-Keys aus'm Code (Zeile 15)
                if (!(key in settings)) { // Wenn in den Settings ein Key fehlt (bzw nicht mehr existiert), wird dieser auch aus Settings im lokalen Speicher entfernt
                    delete parsedSettings[key];
                }
            });

            settings = { ...settings, ...parsedSettings }; // übernehme die Settings
            localStorage.setItem('settings', JSON.stringify(settings)); // Settings aus dem Code in den lokalen Speicher übernehmen
        } else { // Wenn keine "settings" im lokalen Speicher sind, dann:
            localStorage.setItem('settings', JSON.stringify(settings)); // Settings aus dem Code in den lokalen Speicher übernehmen
        }

        if (storedData) {
            const storedObject = JSON.parse(storedData);
            const sameEntity = is_contract ? String(storedObject.client_id || '') === url_id : storedObject.project_id === project_id;
            if (sameEntity) {
                createButtonContainer();
                createSettings();
                if (edoList.includes(storedObject.edo)) createCopyButton(false, false, false, 'copyPath'); // ohne DFS-Speicherort keinen Pfad-Button
                if (!edoList.includes(storedObject.edo)) refreshDfsForStored(storedObject); // Pfad-Button nachreichen, falls doch ein DFS existiert
                createCopyButton(false, false, false, 'copyClientdata');
                injectMilestoneIcons();
                return true;
            }
        }
        return false;
    };

    // ── DFS-Speicherort über die DFS-API ermitteln (ohne das Domains-Panel) ──
    // Der letzte Deployment-Eintrag verrät Speicherort (department_id) und Domain.
    const DFS_API_URL = 'https://dfs.securewebsystems.net/api/project-deployments';
    const DFS_TOKEN_URL = '/dfsdomains/panel/token';
    const DFS_DEPARTMENTS = { '113': 'cerberus', '1113': 'nidhogg', '128': 'plovdiv', '11113': 'pandava' }; // department_id → DFS-Speicherort
    const DFS_ACTIVE_STATES = ['ON_DEMO', 'ON_TEST']; // nur dann liegt das Projekt auch wirklich auf dem DFS
    const dfsLookup = { state: 'idle', edo: '', domain: '', startedAt: 0 }; // idle | pending | done | failed

    const dfsLookupTimedOut = () => { // gibt dem Panel-Fallback Zeit, bevor es ohne Speicherort weitergeht
      if (!dfsLookup.startedAt) return false;
      return Date.now() - dfsLookup.startedAt > (dfsLookup.state === 'failed' ? 15000 : 30000);
    };

    const lookupDfs = (clientId) => { // holt den aktuellsten Deployment-Eintrag des Vertrags
      if (dfsLookup.state !== 'idle' || !clientId) return;
      dfsLookup.state = 'pending';
      dfsLookup.startedAt = Date.now();
      fetch(DFS_TOKEN_URL, { credentials: 'same-origin' })
        .then(res => res.json())
        .then(token => fetch(`${DFS_API_URL}?ordering=-date_created&contract_number=${encodeURIComponent(clientId)}&limit=1`, {
          headers: { Authorization: `${token.token_type} ${token.access_token}` },
        }))
        .then(res => res.json())
        .then(json => {
          const deployment = json?.results?.[0] || null;
          dfsLookup.domain = deployment?.domain || '';
          dfsLookup.edo = deployment && DFS_ACTIVE_STATES.includes(deployment.state) ? (DFS_DEPARTMENTS[String(deployment.department_id)] || '') : ''; // kein aktives DFS → kein Speicherort
          dfsLookup.state = 'done';
        })
        .catch(err => { // API nicht erreichbar → zur Sicherheit auf das Domains-Panel zurückfallen
          console.warn('[Copy-Buttons] DFS-Abfrage fehlgeschlagen:', err);
          dfsLookup.state = 'failed';
        });
    };

    const refreshDfsForStored = (storedObject) => { // gespeichertes Projekt ohne Speicherort: im Hintergrund prüfen, ob inzwischen ein DFS existiert
      lookupDfs(storedObject.client_id);
      const timer = setInterval(() => {
        if (dfsLookup.state === 'pending' || dfsLookup.state === 'idle') return;
        clearInterval(timer);
        if (!edoList.includes(dfsLookup.edo)) return; // weiterhin kein DFS → alles bleibt wie es ist
        localStorage.setItem(storage_key, JSON.stringify({ ...storedObject, edo: dfsLookup.edo }));
        document.querySelector('#copyClientdata')?.remove(); // kurz entfernen, damit die Button-Reihenfolge stimmt
        createCopyButton(false, false, false, 'copyPath');
        createCopyButton(false, false, false, 'copyClientdata');
      }, 300);
      setTimeout(() => clearInterval(timer), 30000);
    };

    // ── Pfad-Button direkt nach dem Anlegen eines DFS ────────────────
    // Klickt man im Popup "DFS erstellen: <domain>" (öffnet sich über den
    // "DFS erstellen"-Button im Domains-Panel) auf den grünen
    // "DFS erstellen"-Button, steht der Speicherort bereits fest.
    // Der Pfad-Button (#copyPath) wird deshalb sofort mit dem passenden Pfad
    // erzeugt – ohne Reload und ohne auf die DFS-API zu warten.

    const dfsCreateModal = (element) => { // das geöffnete "DFS erstellen"-Popup zum angeklickten Element
        const modal = element?.closest?.('.modal, [role="dialog"]');
        if (!modal) return null;
        const title = (modal.querySelector('.modal-title, .modal-header h4, .modal-header h3')?.textContent || '').toLowerCase();
        return title.includes('dfs erstellen') ? modal : null; // nur das Anlege-Popup, keine anderen Dialoge
    };

    const dfsServerRow = (modal) => // die Tabellenzeile "Server:" im Popup
        Array.from(modal.querySelectorAll('tr')).find(row => (row.querySelector('td, th')?.textContent || '').toLowerCase().trim().startsWith('server:')) || null;

    const dfsEdoName = (value) => { // "1113-dfs5" bzw. "Nidhogg (58 Websites)" → "nidhogg"
        const byId = DFS_DEPARTMENTS[String(value || '').split('-')[0]] || '';
        return (byId || String(value || '').split('(')[0]).toLowerCase().trim();
    };

    const dfsSelectedEdo = (modal) => { // der im Popup ausgewählte Speicherort
        const row = dfsServerRow(modal);
        const select = row?.querySelector('select')
            || Array.from(modal.querySelectorAll('select')).find(sel => Array.from(sel.options).some(option => /-dfs\d/i.test(option.value))); // Fallback, falls die Zeile mal anders heißt
        const selected = select?.options?.[select.selectedIndex];
        if (select?.value) return dfsEdoName(select.value) || dfsEdoName(selected?.textContent);
        if (selected?.textContent?.trim()) return dfsEdoName(selected.textContent);
        return dfsEdoName(row?.children?.[1]?.textContent); // nichts umgestellt → Speicherort wie auf LIVE
    };

    const rebuildCopyButtons = () => { // Buttons neu aufbauen (Reihenfolge: Pfad vor Kundendaten)
        const storedObject = JSON.parse(localStorage.getItem(storage_key) || 'null');
        if (!storedObject) return false;
        createButtonContainer();
        document.querySelector('#copyPath')?.remove();
        document.querySelector('#copyClientdata')?.remove();
        if (edoList.includes(storedObject.edo)) createCopyButton(false, false, false, 'copyPath'); // ohne DFS-Speicherort keinen Pfad-Button
        createCopyButton(false, false, false, 'copyClientdata');
        return true;
    };

    const applyDfsEdo = (edoName) => { // neuen Speicherort übernehmen und die Buttons erneuern
        const storedObject = JSON.parse(localStorage.getItem(storage_key) || 'null');
        if (!storedObject) return false; // Projektdaten werden noch eingesammelt → später erneut versuchen
        edo = edoName;
        localStorage.setItem(storage_key, JSON.stringify({ ...storedObject, edo: edoName }));
        dfsLookup.state = 'done'; // die API-Antwort darf den frisch angelegten Speicherort nicht mehr überschreiben
        dfsLookup.edo = edoName;
        return rebuildCopyButtons();
    };

    let dfsPendingEdo = ''; // zuletzt im Popup angelegter Speicherort
    const applyDfsEdoWhenReady = (edoName) => { // ggf. warten, bis die Projektdaten im lokalen Speicher stehen
        dfsPendingEdo = edoName;
        if (applyDfsEdo(edoName)) return;
        const timer = setInterval(() => {
            if (dfsPendingEdo !== edoName || applyDfsEdo(edoName)) clearInterval(timer);
        }, 300);
        setTimeout(() => clearInterval(timer), 30000); // Notbremse
    };

    document.addEventListener('click', (event) => { // Klick auf "DFS erstellen" IM Popup (nicht auf den Button im Panel)
        const button = event.target?.closest?.('button');
        if (!button) return;
        const label = (button.textContent || '').toLowerCase().trim();
        if (label.includes('abbrechen') || (!label.includes('dfs erstellen') && !button.classList.contains('btn-success'))) return;
        const modal = dfsCreateModal(button);
        if (!modal) return;
        const edoName = dfsSelectedEdo(modal);
        if (!edoName) return;
        if (!edoList.includes(edoName)) return showNotification('Kein EDO-Pfad für "' + edoName + '"', 'warning'); // z.B. Plovdiv steht nicht in der edoList
        applyDfsEdoWhenReady(edoName);
    }, true);

    // ── Projektdaten automatisch beim Seitenaufruf einsammeln ────────
    // Öffnet die dafür nötigen Panels (Domains-Panel & Projekt-Infos) unsichtbar,
    // damit KD-Nr., DFS-Speicherort usw. ohne manuelles Aufklappen gelesen werden.
    const autoPanelIds = () => (dfsLookup.state === 'failed' ? [INFO_PANEL_ID, 'dfs_domain_panel'] : [INFO_PANEL_ID]); // das Domains-Panel nur noch als Fallback, wenn die DFS-API nicht antwortet
    const autoCollect = { opened: [], details: [], started: 0, finished: false };

    const addAutoCollectStyle = () => { // Panel wird zum Auslesen aus dem sichtbaren Bereich geschoben (wird gerendert, macht aber keinen Layout-Sprung)
      if (document.getElementById('cb_auto_collect_style')) return;
      const style = document.createElement('style');
      style.id = 'cb_auto_collect_style';
      style.textContent = '.cb_auto_collect { position: absolute !important; left: -99999px !important; top: 0 !important; width: 1200px !important; }';
      document.head.appendChild(style);
    };

    const togglePanel = (panel) => { // "Umschalten" klicken – das löst auch das Nachladen der Domain-Daten aus
      const link = document.querySelector(`a[data-toggle="collapse"][href="#${panel.id}"]`);
      if (link) return link.click();
      window.jQuery && window.jQuery(panel).collapse('toggle');
    };

    const ensureProjectData = () => { // sorgt dafür, dass die Daten im DOM stehen – ohne dass man selbst etwas aufklappen muss
      if (autoCollect.finished) return;
      if (!autoCollect.started) { autoCollect.started = Date.now(); addAutoCollectStyle(); }

      autoPanelIds().forEach(id => {
        const panel = document.getElementById(id);
        if (!panel || panel.classList.contains('in') || autoCollect.opened.includes(panel)) return;
        autoCollect.opened.push(panel);
        panel.classList.add('cb_auto_collect');
        togglePanel(panel);
      });

      (dfsLookup.state === 'failed' ? document.querySelectorAll('#dfs_domain_panel button .glyphicon-chevron-down') : []).forEach(icon => { // nur im Fallback: DFS-Details aufklappen, dort sitzt der Speicherort-Button
        const btn = icon.closest('button');
        if (!btn || autoCollect.details.includes(btn)) return;
        autoCollect.details.push(btn);
        btn.click();
      });

      if (Date.now() - autoCollect.started > 25000) finishAutoCollect(); // Notbremse, falls die Daten nicht geladen werden
    };

    const finishAutoCollect = () => { // alles wieder zuklappen, was automatisch geöffnet wurde
      if (autoCollect.finished) return;
      autoCollect.finished = true;
      autoCollect.details.forEach(btn => { if (btn.isConnected && btn.querySelector('.glyphicon-chevron-up')) btn.click(); });
      autoCollect.details = [];
      autoCollect.opened.forEach(panel => {
        if (panel.classList.contains('in')) togglePanel(panel);
        setTimeout(() => panel.classList.remove('cb_auto_collect'), 700); // erst nach der Zuklapp-Animation
      });
      autoCollect.opened = [];
    };

    const checkForElement = () => {
      if (loadFromLocalStorage()) return clearInterval(intervalId);
      if (!loopListener) return;

      const clientIdFromPage = is_contract
          ? (url_id || (document.querySelector('h1')?.textContent || '').replace(/\D/g, '')) // Vertrags-Seite: die KD-Nr. steht direkt in der URL
          : (document.querySelector('h1')?.textContent || '').replace(/\D/g, '');
      if (clientIdFromPage) lookupDfs(clientIdFromPage); // DFS-Speicherort + Domain im Hintergrund holen (ohne das Domains-Panel zu öffnen)

      if (settings.auto_collect !== false) ensureProjectData(); // Projekt-Infos (und im Fallback das Domains-Panel) bereitstellen

      const firmaElement = findInfoLabel('firma:'),
            brandElement = findInfoLabel('brand:'),
            typElement = findInfoLabel('typ', 'typ:'), // "Typ" steht nur auf der Projekt-Seite
            emailElement = findInfoLabel('e-mail:');
      if (!clientIdFromPage || !firmaElement || !brandElement || !emailElement) return; // Infos stehen noch nicht im DOM
      if (!is_contract && !typElement) return; // auf der Projekt-Seite gehört der Typ dazu

      // Speicherort: bevorzugt aus der DFS-API, sonst aus dem Domains-Panel (Fallback)
      const btnPrimary = document.querySelector(`button[${selectors.server_attr[0]}].btn-primary`) || document.querySelector(`div[${selectors.server_attr[1]}] > button.btn-primary`);
      const serverElement = Array.from(document.querySelectorAll(`b[${selectors.dfs_attr}]`)).find(el => el.innerText.toLowerCase().trim() === "server:");
      if (serverElement) { // wird der Speicherort im Panel umgestellt, den neuen Wert übernehmen
        const selectElement = serverElement.closest(`tr[${selectors.dfs_attr}]`)?.querySelector(`select[${selectors.dfs_attr}]`);
        selectElement?.addEventListener("input", () => {
          const selectedOption = selectElement.options[selectElement.selectedIndex]?.innerText.split(' (')[0];
          document.querySelector(`button.btn-success[${selectors.dfs_attr}]`)?.addEventListener('click', () => {
            edo = selectedOption.toLowerCase().trim();
          });
        });
      }

      if (btnPrimary) edo = btnPrimary.innerText.toLowerCase().trim() || edo;
      else if (dfsLookup.state === 'done') edo = dfsLookup.edo;
      else if (!dfsLookupTimedOut()) return; // kurz auf die DFS-Antwort warten

      const client_id = clientIdFromPage,
            client_domain = document.querySelector(`a[${selectors.href_attr}].text-primary`)?.textContent || dfsLookup.domain || '',
            client_data = (emailElement.parentElement.parentElement.parentElement.querySelector('p')?.innerText || '').split('\n'),
            client_brand = (client_data[0] || '').trim(),
            client_name = (client_data[1] || '').trim(),
            client_street = (client_data[2] || '').trim(),
            client_location = normalizeLocation(client_data[3]),
            client_email = emailElement.parentElement.textContent.replace('E-Mail: ', '').trim(),
            project_company = firmaElement.parentElement.querySelector('img')?.alt || '',
            project_brand = brandElement.parentElement.querySelector('img')?.alt || '',
            project_type = typElement ? typElement.parentElement.textContent.replace('Typ: ', '').trim() : ''; // Vertrags-Seite: kein Projekt-Typ vorhanden

      const hasEdo = edoList.includes(edo); // ohne gültigen DFS-Speicherort gibt es keinen Pfad-Button
      const dataToStore = {
        client_id,
        client_domain,
        client_brand,
        client_name,
        client_street,
        client_location,
        client_email,
        edo: hasEdo ? edo : '',
        project_id,
        project_company,
        project_brand,
                project_type,
                page_type // 'project' (Projekt-Seite) oder 'contract' (Vertrags-Seite)
      };
      const previouslyStored = JSON.parse(localStorage.getItem(storage_key) || '{}');
      if (previouslyStored.special_ps) dataToStore.special_ps = previouslyStored.special_ps; // gespeicherte Special-PS beim Neuanlegen der Projektdaten nicht verlieren
      localStorage.setItem(storage_key, JSON.stringify(dataToStore));
      finishAutoCollect(); // automatisch geöffnete Panels wieder schließen
      createButtonContainer();
      createSettings();
      loopListener = false;
      if (hasEdo) createCopyButton(edo, client_id, client_domain, 'copyPath'); // kein DFS/Demo → kein Pfad-Button
      createCopyButton(edo, client_id, client_domain, 'copyClientdata');
      injectMilestoneIcons();
      clearInterval(intervalId);
    };

    const createButtonContainer = () => {
        if (!document.querySelector('.copyBtnContainer')) {
            const container = document.createElement('div');
            const user_bar = document.querySelector('user-bar');
            const casbar = user_bar?.shadowRoot?.querySelector('.casbar-wrapper');
            const casbar_height = casbar ? casbar.clientHeight : 0;
            Object.assign(container.style, {
                position: 'fixed', right: settings.button_position ? settings.button_position_space : '0', bottom: settings.button_position ? `calc(${settings.button_position_space} + (${casbar_height} * 1px))` : '25vh', display: 'flex', gap: '5px', zIndex: '1000'
            });
            container.className = 'copyBtnContainer';
            document.body.appendChild(container);
            settings.delete_button && createRemoveButton();
        }
    };

    const createRemoveButton = () => {
        if (!document.querySelector('#removeButton')) {
            const removeButton = createButton('removeButton', 'btn btn-danger glyphicon glyphicon-trash', '');
            removeButton.title = 'Projekt aus den Lokalen Daten löschen und Buttons entfernen';
            removeButton.addEventListener('click', () => {
                localStorage.removeItem(storage_key);
                const copyPath = document.querySelector('#copyPath');
                if (copyPath) {
                    copyPath.remove();
                }
                const copyClientdata = document.querySelector('#copyClientdata');
                if (copyClientdata) {
                    copyClientdata.remove();
                }
                removeButton.remove();
            });
            document.querySelector('.copyBtnContainer').appendChild(removeButton);
        }
    };

    const createButton = (id, className, content) => {
        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        button.innerHTML = content;
        return button;
    };


    // ── Meilensteine-Ticket-Icons ───────────────────────────────────
    // Fügt vor bestimmten Meilenstein-Texten ein Icon ein, das ein
    // internes Zammad-Ticket erstellt (Domaintransfer / YourRate / Dritttermin-VL).
    const MILESTONE_TICKETS = [
        { match: 'Administratives: Domaintransfer',                                  action: 'domaintransfer' },
        { match: 'YourRate: Implementierung',                                        action: 'yourrate' },
        { match: 'Kundenkommunikation: Organisation / VL-Abnahme vom MB',            action: 'dritttermin_vl' },
    ];

    const openZammadTicket = (action, mbName) => {
        const data = JSON.parse(localStorage.getItem(storage_key) || "{}");
        const userEmail = (settings.user_email || "") + "@" + "wwwe" + ".de";
        const _domRows2 = (function(){
            var res = { live: '', demo: '' };
            var t = document.querySelector('table.domains-table');
            if (!t) return res;
            var trs = Array.prototype.slice.call(t.querySelectorAll('tr'));
            trs.forEach(function(tr){
                var anchors = Array.prototype.slice.call(tr.querySelectorAll('a'));
                anchors.forEach(function(a){
                    var txt = (a.textContent || '').trim();
                    var href = a.getAttribute('href') || '';
                    if (/securewebdemo/i.test(txt) || /securewebdemo/i.test(href)) {
                        if (!res.demo) res.demo = txt;
                    } else if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(txt) && a.classList.contains('text-primary')) {
                        if (!res.live) res.live = txt;
                    }
                });
            });
            return res;
        })();
        const demoLink = _domRows2.demo || '';
        const liveDomain = _domRows2.live || '';
        const payload = {
            ...data,
            department: settings.department || "",
            user_email: userEmail,
            demo_link: demoLink,
            live_domain: liveDomain,
            action_type: action,
        };
        if (mbName) payload.web_hunter = mbName;
        const base = "https://tickets.wwwe.systems";
        const url = base + "/#ticket/create/id/87679" + "#" + "cb" + "=" + encodeURIComponent(JSON.stringify(payload));
        return window.open(url, "_blank");
    };

    // Liest aus der DOKU (WT-Termin) den aktuellsten Web-Hunter aus.
    // DOKU ist eine Vue-SPA auf fremder Origin → wir öffnen einen echten
    // Tab, warten bis die Tabelle da ist, lesen den Namen und schließen ihn.
    const fetchWtHunterThen = (client_id, cb) => {
        // Cross-origin: DOKU-Tab als EINZIGES Popup oeffnen. Die DOKU-Bruecke
        // liest den WT-Web-Hunter (Ersterstellung WT persoenlich) und oeffnet
        // danach Zammad selbst (mit web_hunter im Payload).
        const dokuBase = "https://doku.securewebsystems.net";
        const lb = decodeURIComponent("%5B"), rb = decodeURIComponent("%5D");
        const q = String.fromCharCode(63), amp = String.fromCharCode(38), eq = String.fromCharCode(61);
        const zammadInfo = (function(){
            try {
                const data = JSON.parse(localStorage.getItem(storage_key) || "{}");
                const userEmail = (settings.user_email || "") + "@" + "wwwe" + ".de";
                const payload = Object.assign({}, data, {
                    department: settings.department || "",
                    user_email: userEmail,
                    action_type: "domaintransfer"
                });
                return amp + "cb" + eq + encodeURIComponent(JSON.stringify(payload));
            } catch (e) { return ""; }
        })();
        const dokuUrl = dokuBase + "/archive" + q + "filter" + lb + "contract" + rb + eq + encodeURIComponent(client_id)
            + zammadInfo + "#wwwe_dt";
        const win = window.open(dokuUrl, "wwwe_dt_bridge");
        if (typeof cb === "function") cb(win ? true : null);
    };
    const makeMilestoneIcon = (action) => {
        const icon = document.createElement('a');
        icon.href = '#';
        icon.className = 'glyphicon glyphicon-envelope cb_ms_ticket_icon';
        icon.title = 'Zammad-Ticket erstellen';
        icon.style.cursor = 'pointer';
        icon.style.marginRight = '6px';
        icon.style.textDecoration = 'none';
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const data = JSON.parse(localStorage.getItem(storage_key) || "{}");
            if (action === "domaintransfer") {
                // Nur EIN Popup pro Klick: die DOKU-Bruecke oeffnen.
                // Die DOKU-URL traegt bereits den Zammad-cb-Payload + #wwwe_dt.
                // Die DOKU-Bruecke liest den WT-Web-Hunter und oeffnet dann Zammad selbst.
                fetchWtHunterThen(data.client_id, function(){});
            } else {
                openZammadTicket(action);
            }
        });
        return icon;
    };

    const injectMilestoneIcons = () => {
        // (Migration Zammad: otrs_extension_active-Guard entfernt – laeuft direkt auf IPSI)
        const heading = Array.from(document.querySelectorAll('h4.panel-title')).find(el => el.textContent.trim().toLowerCase() === 'meilensteine');
        if (!heading) return;
        const panel = heading.closest('.panel');
        if (!panel) return;
        const rows = Array.from(panel.querySelectorAll('table tr'));
        rows.forEach(row => {
            const nameTd = row.querySelector('td:nth-child(3)');
            if (!nameTd) return;
            if (nameTd.querySelector('.cb_ms_ticket_icon')) return; // schon eingefügt
            const text = nameTd.textContent.trim();
            const hit = MILESTONE_TICKETS.find(m => text.includes(m.match));
            if (!hit) return;
            nameTd.insertBefore(makeMilestoneIcon(hit.action), nameTd.firstChild);
        });
    };

    const createCopyButton = (edo, client_id, client_domain, type) => {
        let color_class = 'btn-default';
        let customColor = false
        const colorMap = {
            red: 'btn-danger',
            blue: 'btn-primary',
            green: 'btn-success',
            yellow: 'btn-warning',
            cyan: 'btn-info'
        };
        const buttonColor = settings.button_color.toLowerCase().trim();
        let copy = '';
        customColor = settings.button_color.startsWith("#");
        color_class = customColor ? null : colorMap[buttonColor] || color_class;
        const data = JSON.parse(localStorage.getItem(storage_key));
        if ((!edo && !client_id && !client_domain || type === 'copyClientdata') && data) {
            client_domain = data.client_domain;
            client_id = data.client_id;
            edo = data.edo;
            project_id = data.project_id;
            let { client_brand, client_email, client_location, client_name, client_street, project_company, project_brand, project_type } = data;
        }
        if (type === 'copyPath') {
            if (!document.querySelector('#copyPath')) {
                copy = settings.copy_work_button ? `${settings.copy_drive.trim().toUpperCase()}:\\EDO\\${edo}\\${client_id}\\work\\` : `${settings.copy_drive.trim().toUpperCase()}:\\${edo}\\${client_id}`;
                const button = createButton('copyPath', settings.copy_icon ? `btn ${color_class} glyphicon glyphicon-folder-open` : `btn ${color_class}`, settings.copy_icon ? '' : copy);
                button.title = copy;
                setBtnProperties(button);
            }
        }
        if (type === 'copyClientdata') {
            if (!document.querySelector('#copyClientdata')) {
                copy = data.client_email;
                const button = createButton('copyClientdata', settings.copy_icon ? `btn ${color_class} glyphicon glyphicon-send` : `btn ${color_class}`, settings.copy_icon ? '' : data.client_email);
                button.title = copy;
                setBtnProperties(button);
                // Bei Aktualisierungs-/Korrektur-Projekten ist der Button immer der
                // Aktu-/Korrektur-Absender: department wird dann fest auf
                // "Team Aktualisierung Berlin" gesetzt – egal, welche Abteilung in den
                // Userdaten gewählt ist. Der Projekttyp selbst steckt in data.project_type.
                const projectTypeLc = String(data.project_type || '').toLowerCase();
                const isAktuProject = projectTypeLc.includes('aktu') || projectTypeLc.includes('korrektur');
                const isKorrekturProject = projectTypeLc.includes('korrektur');
                const baseExtended = {
                    ...data,
                    department: isAktuProject ? 'Team Aktualisierung Berlin' : (settings.department || ''),
                    action_type: 'external',
                    is_aktu: isAktuProject,
                    is_korrektur: isKorrekturProject,
                    user_email: (settings.user_email || '') + '@' + 'wwwe' + '.de'
                };
                button.addEventListener('click', function () {
                    // Domains ZUM KLICKZEITPUNKT aus der (ggf. spaeter gerenderten) Tabelle lesen.
                    var _domRows = (function(){
                        var res = { live: '', demo: '' };
                        var t = document.querySelector('table.domains-table');
                        if (!t) return res;
                        var trs = Array.prototype.slice.call(t.querySelectorAll('tr'));
                        trs.forEach(function(tr){
                            var anchors = Array.prototype.slice.call(tr.querySelectorAll('a'));
                            anchors.forEach(function(a){
                                var txt = (a.textContent || '').trim();
                                var href = a.getAttribute('href') || '';
                                if (/securewebdemo/i.test(txt) || /securewebdemo/i.test(href)) {
                                    if (!res.demo) res.demo = txt;
                                } else if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(txt) && a.classList.contains('text-primary')) {
                                    if (!res.live) res.live = txt;
                                }
                            });
                        });
                        return res;
                    })();
                    var extendedData = Object.assign({}, baseExtended, { demo_link: _domRows.demo || '', live_domain: _domRows.live || '' });
                    window.open('https://tickets.wwwe.systems/#ticket/create/id/87679#cb=' + encodeURIComponent(JSON.stringify(extendedData)), '_blank');
                });
            }
        }
        function setBtnProperties(button) {
            if (!settings.button_position) {
                Object.assign(button.style, {
                    borderTopRightRadius: '0', borderBottomRightRadius: '0'
                });
            }
            if (customColor) {
                button.setAttribute('style', `background-color: ${settings.button_color.toLowerCase().trim()} !important;`);
            }
            button.addEventListener('click', () => copyToClipboard(copy));
            if (button.id === 'copyPath') { // Linksklick auf den Pfad-Button: zusätzlich Ordner scannen und in VS Code öffnen (falls aktiviert)
                button.addEventListener('click', () => vscScanAndOpen(copy, edo));
                button.addEventListener('contextmenu', (event) => { // Rechtsklick: Öffnen-Menü (nur wenn Feature aktiv, sonst normales Browser-Kontextmenü)
                    if (!settings.vsc_open) return;
                    event.preventDefault();
                    event.stopPropagation();
                    showVscCtxMenu(event, copy, edo);
                });
            }
            document.querySelector('.copyBtnContainer').appendChild(button);
        }
    };

    const copyToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification(text);
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `label label-${type}`;
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed', right: '20px', zIndex: '999', opacity: '0', transition: '0.5s ease'
        });
        document.body.appendChild(notification);
        const user_bar = document.querySelector('user-bar');
        const casbar_height = user_bar?.shadowRoot?.querySelector('.casbar-wrapper')?.clientHeight || 0;
        const copyPath_height = document.querySelector('#copyPath')?.clientHeight || 34; // Buttons existieren evtl. noch nicht (Domains-Panel noch zu) → Standard-Buttonhöhe
        const bottomValue = settings.button_position ? `calc((${settings.button_position_space} * 2) + (${casbar_height} * 1px) + (${copyPath_height} * 1px))` : `calc(${casbar_height} * 1px)`;
        const bottomPosition = notifications.length * 18;
        notification.style.bottom = `calc(${bottomPosition}px + ${bottomValue})`;
        notification.style.opacity = 1;
        notifications.push(notification);
        setTimeout(() => {
            notification.style.opacity = 0;
            notification.addEventListener('transitionend', () => {
                notification.remove();
                notifications = notifications.filter(n => n !== notification);
                notifications.forEach((n, index) => n.style.bottom = `calc(${index * 18}px + ${bottomValue})`);
            });
        }, 5000);
    };

    // ── VSC-Ordner-Öffner ────────────────────────────────────────────
    // Linksklick auf den Pfad-Button fragt den lokalen ipsi-vsc-helper
    // (läuft auf 127.0.0.1:48620), listet die Ordner im kopierten Pfad und
    // öffnet sie als neues Fenster in Visual Studio Code.
    const VSC_HELPER_URL = 'http://127.0.0.1:48620';

    const vscFetch = (route, options = {}, timeout = 30000, hint = 'Einen Moment – Laufwerk wird geweckt…') => { // fetch mit Timeout; der Weckdienst für getrennte Netzlaufwerke darf sich Zeit nehmen
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        const wakeHint = setTimeout(() => showNotification(hint, 'info'), 1500); // dezenter Hinweis, falls es länger dauert
        return fetch(`${VSC_HELPER_URL}${route}`, { ...options, signal: controller.signal })
            .finally(() => { clearTimeout(timer); clearTimeout(wakeHint); });
    };

    const vscWakeHint = (p) => `Einen Moment – Laufwerk ${String(p).charAt(0).toUpperCase()}: wird geweckt…`; // der Buchstabe stammt immer aus dem Pfad selbst (= copy_drive)

    const vscJoinPath = (base, name) => `${base.replace(/[\\/]+$/, '')}\\${name}`;

    const vscScanAndOpen = (folderPath, edo) => { // Hauptablauf beim Linksklick auf den Pfad-Button
        if (!settings.vsc_open) return; // Feature ist per Settings-Schalter deaktivierbar (Standard: aus)
        closeVscChooser(true);
        vscFetch(`/scan?path=${encodeURIComponent(folderPath)}`, {}, undefined, vscWakeHint(folderPath))
            .then(response => response.json())
            .then(res => {
                if (res.status === 'not_found') return showNotification(`Pfad nicht gefunden: ${folderPath}${res.reason ? ` – ${res.reason}` : ''}`, 'danger');
                if (res.status !== 'ok') return showNotification(`VSC-Helper: ${res.message || 'Unbekannter Fehler'}`, 'danger');
                const folders = res.folders || [];
                if (folders.length === 0) return showNotification('Keine Ordner im Pfad gefunden', 'warning');
                if (folders.length === 1) return vscOpenInCode(vscJoinPath(res.path, folders[0])); // genau ein Ordner → direkt öffnen
                showVscChooser(res.path, folders, edo); // mehrere Ordner → Auswahl anzeigen
            })
            .catch(err => showNotification(err && err.name === 'AbortError' ? 'VSC-Helper: Zeitüberschreitung' : 'VSC-Helper nicht erreichbar (läuft er?)', 'danger'));
    };

    const vscOpenInCode = (folderPath) => { // öffnet den Ordner als neues VS-Code-Fenster (über den Helfer)
        vscFetch('/open', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: folderPath }, undefined, vscWakeHint(folderPath))
            .then(response => response.json())
            .then(res => {
                if (res.status === 'ok') showNotification(`VS Code öffnet: ${res.name || folderPath}`);
                else showNotification(`VSC-Helper: ${res.message || 'Ordner konnte nicht geöffnet werden'}`, 'danger');
            })
            .catch(() => showNotification('VSC-Helper nicht erreichbar', 'danger'));
    };

    const vscOpenInExplorer = (folderPath) => { // öffnet den Pfad als Ordner im Windows-Explorer (über den Helfer)
        vscFetch('/open-explorer', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: folderPath }, undefined, vscWakeHint(folderPath))
            .then(response => response.json())
            .then(res => {
                if (res.status === 'ok') showNotification(`Explorer öffnet: ${res.name || folderPath}`);
                else showNotification(`VSC-Helper: ${res.message || 'Ordner konnte nicht geöffnet werden'}`, 'danger');
            })
            .catch(err => showNotification(err && err.name === 'AbortError' ? 'VSC-Helper: Zeitüberschreitung' : 'VSC-Helper nicht erreichbar', 'danger'));
    };

    const showVscChooser = (basePath, folders, edo) => { // Auswahl-Popup, wenn der Pfad mehrere Ordner enthält
        closeVscChooser(true); // evtl. offene Auswahl sofort ersetzen
        const popup = document.createElement('div');
        popup.className = 'cb_vsc_popup';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'cb_vsc_close glyphicon glyphicon-remove';
        closeBtn.title = 'Auswahl schließen';
        closeBtn.addEventListener('click', () => closeVscChooser());

        const title = document.createElement('span');
        title.className = 'cb_vsc_title';

        // Pfad-Zeile – das EDO-Segment wird (wenn erkennbar) als Dropdown gerendert
        let currentBase = basePath.replace(/[\\/]+$/, '');
        const segments = currentBase.split('\\');
        const edoIndex = edo ? segments.findIndex(segment => segment.toLowerCase() === String(edo).toLowerCase()) : -1;

        const pathEl = document.createElement('span');
        pathEl.className = 'cb_vsc_path';
        pathEl.title = `${currentBase}\\`;

        const list = document.createElement('div');
        list.className = 'cb_vsc_list';

        let scanToken = 0; // bei schnellem Hin- und Herwechseln zählt nur das letzte Ergebnis

        const renderMessage = (text, type) => {
            const message = document.createElement('span');
            message.className = `cb_vsc_msg${type ? ` ${type}` : ''}`;
            message.textContent = text;
            list.appendChild(message);
        };

        const renderList = (folderNames) => {
            list.innerHTML = '';
            title.textContent = `${folderNames.length} Ordner gefunden`;
            if (!folderNames.length) return renderMessage('Keine Ordner im Pfad gefunden', 'warn');
            folderNames.forEach(name => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'cb_vsc_item';
                item.innerHTML = '<span class="glyphicon glyphicon-folder-open"></span> ';
                item.appendChild(document.createTextNode(name));
                item.title = `"${name}" als neues Projekt in VS Code öffnen`;
                item.addEventListener('click', () => {
                    closeVscChooser();
                    vscOpenInCode(vscJoinPath(currentBase, name));
                });
                list.appendChild(item);
            });
        };

        const rescan = () => { // Projekt-Ordner im (neu) gewählten EDO suchen
            const token = ++scanToken;
            title.textContent = 'Suche Ordner…';
            list.innerHTML = '';
            vscFetch(`/scan?path=${encodeURIComponent(`${currentBase}\\`)}`, {}, undefined, vscWakeHint(currentBase))
                .then(response => response.json())
                .then(res => {
                    if (token !== scanToken) return; // inzwischen wurde erneut gewechselt
                    if (res.status === 'not_found') {
                        title.textContent = 'Pfad nicht gefunden';
                        return renderMessage(res.reason || 'Der Pfad existiert in diesem EDO nicht', 'error');
                    }
                    if (res.status !== 'ok') {
                        title.textContent = 'Fehler';
                        return renderMessage(res.message || 'Unbekannter Fehler', 'error');
                    }
                    renderList(res.folders || []);
                })
                .catch(err => {
                    if (token !== scanToken) return;
                    title.textContent = 'Fehler';
                    renderMessage(err && err.name === 'AbortError' ? 'VSC-Helper: Zeitüberschreitung' : 'VSC-Helper nicht erreichbar', 'error');
                });
        };

        if (edoIndex > 0) {
            const prefix = document.createElement('span');
            prefix.className = 'cb_vsc_path_part';
            prefix.textContent = `${segments.slice(0, edoIndex).join('\\')}\\`;

            const edoSelect = document.createElement('select');
            edoSelect.className = 'cb_vsc_edo_select';
            edoSelect.title = 'EDO wechseln – die Projekt-Ordner werden dort neu gesucht';
            const currentOption = document.createElement('option');
            currentOption.value = segments[edoIndex];
            currentOption.textContent = segments[edoIndex];
            edoSelect.appendChild(currentOption);

            const rest = segments.slice(edoIndex + 1).join('\\');
            const suffix = document.createElement('span');
            suffix.className = 'cb_vsc_path_part';
            suffix.textContent = rest ? `\\${rest}\\` : '\\';

            pathEl.append(prefix, edoSelect, suffix);

            // Die anderen EDO-Ordner (Nachbarordner des aktuellen EDO) über den Helfer nachladen
            const parentPath = `${segments.slice(0, edoIndex).join('\\')}\\`;
            vscFetch(`/scan?path=${encodeURIComponent(parentPath)}`, {}, undefined, vscWakeHint(parentPath))
                .then(response => response.json())
                .then(res => {
                    if (res.status !== 'ok' || !Array.isArray(res.folders) || !res.folders.length) return;
                    const current = edoSelect.value;
                    const names = res.folders.slice();
                    if (!names.some(name => name.toLowerCase() === current.toLowerCase())) names.unshift(current);
                    edoSelect.innerHTML = '';
                    names.forEach(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        option.selected = name.toLowerCase() === current.toLowerCase();
                        edoSelect.appendChild(option);
                    });
                })
                .catch(() => {}); // dann bleibt eben nur das aktuelle EDO im Dropdown

            edoSelect.addEventListener('change', () => {
                segments[edoIndex] = edoSelect.value;
                currentBase = segments.join('\\');
                pathEl.title = `${currentBase}\\`;
                rescan();
            });
        } else { // EDO im Pfad nicht erkennbar → Pfad wie bisher als reiner Text
            pathEl.classList.add('cb_vsc_path_plain');
            pathEl.textContent = `${currentBase}\\`;
        }

        renderList(folders);
        popup.append(closeBtn, title, pathEl, list);

        // Position: direkt über den Copy-Buttons (gleiche Rechnung wie bei den Notifications)
        const user_bar = document.querySelector('user-bar');
        const casbar_height = user_bar.shadowRoot.querySelector('.casbar-wrapper').clientHeight;
        const copyPath_height = document.querySelector('#copyPath')?.clientHeight || 34;
        if (settings.button_position) {
            popup.style.right = settings.button_position_space;
            popup.style.bottom = `calc((${settings.button_position_space} * 2) + (${casbar_height} * 1px) + (${copyPath_height} * 1px))`;
        } else {
            popup.style.right = '10px';
            popup.style.bottom = `calc(25vh + ${copyPath_height}px + 10px)`;
        }

        document.body.appendChild(popup);
        requestAnimationFrame(() => requestAnimationFrame(() => popup.classList.add('open'))); // doppeltes rAF für eine saubere Einblende-Animation
        setTimeout(() => {
            document.addEventListener('mousedown', vscChooserOutsideClick);
            document.addEventListener('keydown', vscChooserEscClose);
        }, 0);
    };

    const closeVscChooser = (instant = false) => {
        document.removeEventListener('mousedown', vscChooserOutsideClick);
        document.removeEventListener('keydown', vscChooserEscClose);
        const popup = document.querySelector('.cb_vsc_popup');
        if (!popup) return;
        if (instant) return popup.remove();
        popup.classList.remove('open');
        setTimeout(() => popup.remove(), 300);
    };
    const vscChooserOutsideClick = (event) => {
        const popup = document.querySelector('.cb_vsc_popup');
        if (popup && !popup.contains(event.target) && event.target.id !== 'copyPath') closeVscChooser();
    };
    const vscChooserEscClose = (event) => {
        if (event.key === 'Escape') closeVscChooser();
    };

    // ── Rechtsklick-Menü am Pfad-Button ("Mit VSC öffnen" / "Im Explorer öffnen") ──
    const showVscCtxMenu = (event, folderPath, edo) => {
        closeVscCtxMenu(true); // evtl. offenes Menü sofort ersetzen
        closeVscChooser(true); // eine offene Ordner-Auswahl ebenfalls schließen
        const menu = document.createElement('div');
        menu.className = 'cb_ctx_menu';

        const makeItem = (iconClass, label, action) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'cb_vsc_item';
            item.innerHTML = `<span class="glyphicon ${iconClass}"></span> `;
            item.appendChild(document.createTextNode(label));
            item.addEventListener('click', () => {
                closeVscCtxMenu();
                action();
            });
            return item;
        };
        menu.appendChild(makeItem('glyphicon-new-window', 'Mit VSC öffnen', () => vscScanAndOpen(folderPath, edo)));
        menu.appendChild(makeItem('glyphicon-folder-open', 'Im Explorer öffnen', () => vscOpenInExplorer(folderPath)));

        // Menü öffnet nach oben-links vom Mauszeiger (Buttons sitzen unten rechts)
        menu.style.right = `${Math.max(6, window.innerWidth - event.clientX)}px`;
        menu.style.bottom = `${Math.max(6, window.innerHeight - event.clientY)}px`;

        document.body.appendChild(menu);
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
        setTimeout(() => {
            document.addEventListener('mousedown', vscCtxOutsideClick);
            document.addEventListener('keydown', vscCtxEscClose);
        }, 0);
    };
    const closeVscCtxMenu = (instant = false) => {
        document.removeEventListener('mousedown', vscCtxOutsideClick);
        document.removeEventListener('keydown', vscCtxEscClose);
        const menu = document.querySelector('.cb_ctx_menu');
        if (!menu) return;
        if (instant) return menu.remove();
        menu.classList.remove('open');
        setTimeout(() => menu.remove(), 300);
    };
    const vscCtxOutsideClick = (event) => {
        const menu = document.querySelector('.cb_ctx_menu');
        if (menu && !menu.contains(event.target)) closeVscCtxMenu();
    };
    const vscCtxEscClose = (event) => {
        if (event.key === 'Escape') closeVscCtxMenu();
    };

    const createSettings = () => {
        const style = document.createElement('style');
        let cb_background = '#f2f5ff',
            cb_background_dark = '#363636',
            cb_font_active = '#1b1b1b',
            cb_marking_clr = '#d5d5d5',
            text_shadow = '255,255,255';
        const bouncy_transition = 'cubic-bezier(0.25, 1, 0.5, 1.15)',
              bouncy_switch_transition = 'cubic-bezier(0.25, 1, 0.5, 1.55)';
        const settingStyles = () => {
        style.textContent = `
            :root {
                --cb_background: ${cb_background};
                --cb_background_dark: ${cb_background_dark};
                --cb_font: #757575;
                --cb_font_active: ${cb_font_active};
                --cb_marking_clr: ${cb_marking_clr};
                --cb_clr_settings: #1b1b1b;
                --cb_active: #15db81;
                --cb_active_dark: #14cc76;
                --cb_deactivated: #ea4858;
                --cb_deactivated_dark: #c13c47;
                --cb_switch_width: 32px;
                --cb_switch_height: 20px;
                --cb_color_red: #ea4858;
                --cb_color_yellow: #e8d247;
                --cb_color_blue: #476fe8;
                --cb_color_cyan: #47d2e8;
                --cb_color_green: #15db81;
                --cb_color_gray: #f2f5ff;
            }
            #copyPath, #copyClientdata, #removeButton {
                position: unset;
                transition: width 0.35s ${bouncy_transition};
            }
            .cb_btn {
                position: initial;
            }
            .cb_btn, .setting_title, .box, .popup_btn, .color_picker label {
                cursor: pointer;
            }
            .table .btn.cb_formix_check_btn {
                margin-right: .5rem;
            }
            .cb_container {
                order: 999;
            }
            .cb_container .cb_settings {
                position: absolute;
                right: 0;
                bottom: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                width: fit-content;
                padding: 35px 50px;
                background-color: var(--cb_background);
                border-radius: 15px;
                text-shadow: 0 1px 0 rgb(${text_shadow});
                outline: 0 !important;
                box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, .25) inset, 0 1px 1px 0 rgba(255, 255, 255, .25) inset !important;
                transform: scale(0);
                transform-origin: bottom right;
                transition: bottom 0.35s ${bouncy_transition},
                            transform 0.2s ease-in-out,
                            background-color 0.25s ease-in-out;
            }
            .cb_container .cb_settings:has(.popup_content.open) {
                bottom: 60px;
                transition: bottom 0.35s ${bouncy_transition};
            }
            .cb_container .cb_settings .cb_darkmode_btn {
                position: absolute;
                top: 15px;
                right: 15px;
                stroke: var(--cb_font);
                cursor: pointer;
            }
            .cb_container .cb_settings .cb_darkmode_btn svg {
                pointer-events: none;
            }
            .cb_container .cb_settings [class*="_deleter_btn"] {
                position: absolute;
                top: 15px;
                color: var(--cb_font);
                cursor: pointer;
                font-size: 11px;
            }
            .cb_container .cb_settings .cb_ls_deleter_btn {
                right: calc(5px + (15px * 2));
            }
            .cb_container .cb_settings .cb_user_deleter_btn {
                right: calc((5px * 2) + (15px * 3));
            }
            .cb_container .cb_settings .cb_sup_deleter_btn {
                right: calc((5px * 3) + (15px * 4));
            }
            .cb_container .cb_settings .cb_git_updater_deleter_btn {
                right: calc((5px * 4) + (15px * 5));
            }
            .cb_container .cb_settings .settings_title {
                font-size: 14px;
                font-family: sans-serif;
                font-weight: bolder;
                letter-spacing: 12px;
                text-transform: uppercase;
                color: var(--cb_font);
                margin-right: -12px;
                margin-bottom: 8px;
                user-select: none;
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            .cb_container .cb_settings .cb_version {
                font-size: 13px;
                font-family: sans-serif;
                font-weight: bolder;
                position: absolute;
                bottom: 12px;
                right: 15px;
                color: var(--cb_font);
                opacity: 0.65;
                user-select: none;
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            .cb_container .cb_settings .cb_setting {
                display: flex;
                max-width: fit-content;
                color: var(--cb_font);
                font-family: 'Actor', monospace, sans-serif;
                font-weight: bolder;
                transition: color 0.25s ease-in-out;
                user-select: none;
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            .cb_container .cb_settings .cb_setting .setting_title {
                display: inline-block;
                min-width: 185px;
                font-size: 18px;
            }
            .cb_container .cb_settings .cb_setting input:not([type="text"]) {
                display: none;
            }
            .cb_container .cb_settings .cb_setting label.cb_switch, .cb_container .cb_settings .cb_setting label.cb_checkbox, .cb_container .cb_settings .cb_setting label.cb_switch {
                display: flex;
                margin-bottom: unset;
            }
            .cb_container .cb_settings .cb_setting label.cb_switch .box, .cb_container .cb_settings .cb_setting label.cb_checkbox .box {
                position: relative;
                display: inline-block;
                transition: all 0.25s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting label.cb_switch .box {
                width: var(--cb_switch_width);
                height: var(--cb_switch_height);
                border-radius: var(--cb_switch_height);
                background: var(--cb_deactivated);
                transition: background-color 0.25s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting label.cb_switch .box::after {
                position: absolute;
                content: '';
                top: 50%;
                left: 4px;
                width: calc(20px - 8px);
                height: calc(20px - 8px);
                border-radius: calc(20px - 8px);
                background: var(--cb_background);
                transform: translate(0, -50%);
                transition: all 0.25s ease-in-out,
                            left 0.35s ${bouncy_switch_transition};
            }
            .cb_container .cb_settings .cb_setting:hover label.cb_switch .box {
                background: var(--cb_deactivated_dark);
            }
            .cb_container .cb_settings .cb_setting label.cb_checkbox .box {
                position: relative;
                display: inline-block;
                width: calc(var(--cb_switch_width) / 2);
                height: calc(var(--cb_switch_width) / 2);
                border-radius: calc(var(--cb_switch_height) / 5);
                background: var(--cb_font_active);
            }
            .cb_container .cb_settings .cb_setting label.cb_checkbox .box::before, .cb_container .cb_settings .cb_setting label.cb_checkbox .box::after {
                position: absolute;
                content: '';
                width: 0;
                /* Adjust cross width */
                height: calc(var(--cb_switch_height) / 8);
                /* Adjust cross thickness */
                background: var(--cb_background);
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                /* Center horizontally and vertically */
                transition: width 0.15s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting label.cb_checkbox .box::before {
                transform: translate(-50%, -50%) rotate(45deg);
            }
            .cb_container .cb_settings .cb_setting label.cb_checkbox .box::after {
                transform: translate(-50%, -50%) rotate(-45deg);
            }
            .cb_container .cb_settings .cb_setting:has(.active) {
                color: var(--cb_font_active);
            }
            .cb_container .cb_settings .cb_setting:has(.active) label.cb_switch .box {
                background: var(--cb_active);
            }
            .cb_container .cb_settings .cb_setting:has(.active) label.cb_switch .box::after {
                left: calc(100% - (20px - 8px) - 4px);
            }
            .cb_container .cb_settings .cb_setting:has(.active):hover label.cb_switch .box {
                background: var(--cb_active_dark);
            }
            .cb_container .cb_settings .cb_setting:has(.active) label.cb_checkbox .box::before, .cb_container .cb_settings .cb_setting:has(.active) label.cb_checkbox .box::after {
                width: calc(var(--cb_switch_height) / 1.90);
                border-radius: calc(var(--cb_switch_height) / 3);
            }
            .cb_container .cb_settings .cb_setting label.cb_switch input.box[type="text"],
            .cb_container .cb_settings .cb_setting label.cb_switch select.box,
            .cb_container .cb_settings .cb_setting label.cb_switch:hover select.box {
                background: var(--cb_marking_clr);
                border-radius: calc(var(--cb_switch_height) / 3);
                padding-inline: 5px;
                text-align: center;
            }
            .cb_container .cb_settings .cb_setting.deactivated {
                color: var(--cb_font) !important;
                pointer-events: none !important;
            }
            .cb_container .cb_settings .cb_setting.deactivated label {
                background: var(--cb_font) !important;
            }
            .cb_container .cb_settings .cb_setting.deactivated label::after {
                background: var(--cb_font) !important;
            }
            .cb_container .cb_settings .cb_setting.popup_settings {
                position: relative;
            }
            .cb_container .cb_settings .cb_setting .always_active {
                color: var(--cb_font_active);
            }
            .cb_container .cb_settings .cb_setting .popup_container {
                display: inline-block;
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn {
                display: inline-block;
                width: var(--cb_switch_width);
                height: var(--cb_switch_height);
                border-radius: calc(var(--cb_switch_height) / 3);
                background: var(--cb_font_active);
                transition: background-color 0.25s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.red {
                background: var(--cb_color_red);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.yellow {
                background: var(--cb_color_yellow);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.blue {
                background: var(--cb_color_blue);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.cyan {
                background: var(--cb_color_cyan);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.green {
                background: var(--cb_color_green);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_btn.gray {
                background: var(--cb_color_gray);
                border: solid 3px var(--cb_font);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content {
                display: flex;
                position: absolute;
                gap: 10px;
                padding: 10px 12px;
                background: var(--cb_clr_settings);
                border-radius: 30px;
                border: solid 5px var(--cb_background);
                transform: scaleX(0.000001);
                transform-origin: center center;
                top: 30px;
                left: -5px;
                transition: transform 0.2s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input {
                position: relative;
                display: inline-block;
                width: calc(var(--cb_switch_width) - 9px);
                height: calc(var(--cb_switch_width) - 9px);
                margin-bottom: 0;
                border-radius: calc(var(--cb_switch_height));
                background: transparent;
                transform: scale(0.000001);
                transform-origin: calc(50% + 5px) center;
                transition: all 0.25s ease;
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input::after {
                position: absolute;
                content: '';
                width: calc((var(--cb_switch_width) + 10px) / 2);
                height: calc((var(--cb_switch_width) + 10px) / 2);
                border-radius: calc(var(--cb_switch_height));
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                /* Center horizontally and vertically */
                transition: all 0.3s ${bouncy_switch_transition}, bottom 0.35s ${bouncy_transition};
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.red::after {
                background: var(--cb_color_red);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.yellow::after {
                background: var(--cb_color_yellow);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.blue::after {
                background: var(--cb_color_blue);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.cyan::after {
                background: var(--cb_color_cyan);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.green::after {
                background: var(--cb_color_green);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.gray::after {
                background: var(--cb_color_gray);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.gray::after {
                background: var(--cb_color_gray);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input:hover::after {
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.active {
                background: var(--cb_active);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.active::after {
                border: solid 4px var(--cb_clr_settings);
                width: calc(var(--cb_switch_width) / 2.2);
                height: calc(var(--cb_switch_width) / 2.2);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content.open {
                transform: scaleX(1);
                transition: transform 0.35s ${bouncy_transition};
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content.open label.cb_input {
                transform: scale(1);
                transition: all 0.25s ${bouncy_switch_transition};
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content.open label.cb_input:not(.active):hover {
                transform: scale(1.2);
            }
            .cb_container.open .cb_settings {
                transform: scale(1);
                transition: bottom 0.35s ${bouncy_transition},
                            transform 0.35s ${bouncy_transition},
                            background-color 0.25s ease-in-out;
            }
            .cb_container .cb_side_container {
                position: absolute;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 35px;
                width: 225px;
                bottom: 0;
                left: calc(-225px - 10px);
                background: var(--cb_background);
                border-radius: 15px;
                text-shadow: 0 1px 0 rgb(${text_shadow});
                box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, .25) inset, 0 1px 1px 0 rgba(255, 255, 255, .25) inset !important;
                transform: scale(0.000001);
                transform-origin: bottom right;
                transition: transform 0.2s ease-in-out,
                            background-color 0.25s ease-in-out;
            }
            .cb_container .cb_side_container .cb_side_close_btn {
                position: absolute;
                padding: 15px;
                top: 0;
                right: 0;
                font-size: 10px;
                color: var(--cb_font);
                cursor: pointer;
            }
            .cb_container [id*="_delete_btn"], .cb_container [id*="_save_btn"], .cb_container [id*="_send_btn"], .cb_container [id*="_sync_btn"] {
                width: calc(100% - (15px* 2));
                height: 35px;
                margin: 15px;
                background: var(--cb_deactivated);
                border: 0;
                padding: 0;
                cursor: pointer;
                border-radius: 8px;
                color: var(--cb_background);
                transition: background-color 0.25s ease-in-out;
            }
            .cb_container [id*="_delete_btn"] {
                background: var(--cb_deactivated);
            }
            .cb_container [id*="_delete_btn"]:hover {
                background: var(--cb_deactivated_dark);
            }
            .cb_container [id*="_save_btn"], .cb_container [id*="_send_btn"] {
                background: var(--cb_active);
            }
            .cb_container [id*="_save_btn"]:hover, .cb_container [id*="_send_btn"]:hover {
                background: var(--cb_active_dark);
            }
            .cb_container [id*="_sync_btn"] {
                background: var(--cb_deactivated);
            }
            .cb_container [id*="_sync_btn"]:hover {
                background: var(--cb_deactivated_dark);
            }
            .cb_container .cb_user_btns {
                display: flex;
                align-items: center;
                width: 100%;
            }
            .cb_container .cb_user_btns #cb_user_save_btn {
                flex: 1 1 auto;
                width: auto;
                margin: 15px 0 15px 15px;
            }
            .cb_container .cb_user_btns #cb_user_sync_btn {
                flex: 0 0 45px;
                width: 45px;
                margin: 15px 15px 15px 8px;
            }
            .cb_container #cb_user_sync_btn .cb_user_spin {
                display: inline-block;
                animation: cb_user_rot 0.9s linear infinite;
            }
            @keyframes cb_user_rot {
                to { transform: rotate(360deg); }
            }
            .cb_container .cb_side_container .cb_user_content {
                max-height: calc(100vh - 210px);
                overflow-y: auto;
            }
            .cb_container .cb_side_container .cb_side_content {
                width: 160px;
                padding-block: 10px;
            }
            .cb_container .cb_side_container .cb_side_content label {
                color: var(--cb_font_active);
            }
            .cb_container .cb_side_container .cb_side_content label {
                margin-top: 10px;
            }
            .cb_container .cb_side_container .cb_side_content select,
            .cb_container .cb_side_container .cb_side_content input,
            .cb_container .cb_side_container .cb_side_content textarea {
                width: 100%;
                background: var(--cb_marking_clr);
                color: var(--cb_font_active);
                padding: 9px 6px;
                border-radius: calc(var(--cb_switch_height) / 3);
            }
            .cb_container .cb_side_container .cb_ls_content {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-height: 0;
                overflow: auto;
                transition: max-height 0.35s ${bouncy_transition};
                transition-delay: 150ms;
            }
            .cb_container .cb_side_container .cb_ls_content::-webkit-scrollbar {
                width: 13px;
            }
            .cb_container .cb_side_container .cb_ls_content::-webkit-scrollbar-track {
                background: var(--cb_background);
                border: 3px solid transparent;
            }
            .cb_container .cb_side_container .cb_ls_content::-webkit-scrollbar-thumb {
                background: var(--cb_font);
                border: 4px solid transparent;
                border-radius: 100px;
                background-clip: content-box;
            }
            .cb_container .cb_side_container .cb_ls_content::-webkit-scrollbar-button {
                height: 0;
                width: 0;
            }
            .cb_container .cb_side_container .cb_ls_content label {
                padding-block: 10px;
                margin-block: unset;
                color: var(--cb_font_active);
                border-bottom: 1px solid var(--cb_background);
                text-align: center;
                cursor: pointer;
                user-select: none;
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            .cb_container .cb_side_container .cb_ls_content label:has(input:checked) {
                background: var(--cb_marking_clr);
                color: var(--cb_font);
            }
            .cb_container .cb_side_container .cb_ls_content label input {
                display: none;
            }
            .cb_container .cb_side_container.open {
                transform: scale(1);
                transition: transform 0.35s ${bouncy_transition},
                            background-color 0.25s ease-in-out;
            }
            .cb_container .cb_side_container.open .cb_ls_content {
                max-height: calc(50vh - 40px);
            }
            .cb_container .cb_side_container .cb_ls_sort {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 6px 0 8px;
            }
            .cb_container .cb_side_container .cb_ls_sort #cb_ls_sort_select {
                max-width: fit-content;
            }
            .cb_container .cb_side_container .cb_ls_sort label {
                color: var(--cb_font_active);
                font-size: 11px;
                white-space: nowrap;
                margin: 0;
            }
            .cb_container .cb_side_container .cb_ls_sort select {
                flex: 1 1 auto;
                min-width: 0;
                background: var(--cb_marking_clr);
                color: var(--cb_font_active);
                border: 0;
                padding: 6px;
                border-radius: calc(var(--cb_switch_height) / 3);
                cursor: pointer;
            }
            .cb_info-sign {
                top: 0;
                font-size: 12px;
                color: var(--cb_font);
            }
            /* ── VSC-Ordner-Auswahl (Popup vom Pfad-Button) ── */
            .cb_vsc_popup {
                position: fixed;
                display: flex;
                flex-direction: column;
                min-width: 230px;
                max-width: 340px;
                padding: 12px 14px;
                background: var(--cb_background);
                color: var(--cb_font_active);
                border-radius: 15px;
                text-shadow: 0 1px 0 rgb(${text_shadow});
                box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, .25) inset, 0 1px 1px 0 rgba(255, 255, 255, .25) inset, 0 4px 18px rgba(0, 0, 0, .25);
                z-index: 1001;
                transform: scale(0.000001);
                transform-origin: bottom right;
                transition: transform 0.35s ${bouncy_transition},
                            background-color 0.25s ease-in-out;
            }
            .cb_vsc_popup.open {
                transform: scale(1);
            }
            .cb_vsc_popup .cb_vsc_close {
                position: absolute;
                top: 0;
                right: 0;
                padding: 12px;
                font-size: 10px;
                color: var(--cb_font);
                cursor: pointer;
            }
            .cb_vsc_popup .cb_vsc_title {
                font-weight: bold;
                padding-right: 20px;
            }
            .cb_vsc_popup .cb_vsc_path {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 3px;
                color: var(--cb_font);
                font-size: 11px;
                margin: 2px 0 8px;
            }
            .cb_vsc_popup .cb_vsc_path.cb_vsc_path_plain {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                direction: rtl;
                text-align: left;
            }
            .cb_vsc_popup .cb_vsc_path .cb_vsc_path_part {
                white-space: nowrap;
            }
            .cb_vsc_popup .cb_vsc_edo_select {
                background: var(--cb_marking_clr);
                color: var(--cb_font_active);
                border: 0;
                padding: 2px 4px;
                border-radius: 5px;
                font-size: 11px;
                cursor: pointer;
            }
            .cb_vsc_popup .cb_vsc_msg {
                color: var(--cb_font);
                font-size: 12px;
                padding: 4px 2px;
            }
            .cb_vsc_popup .cb_vsc_msg.error {
                color: #d9534f;
            }
            .cb_vsc_popup .cb_vsc_msg.warn {
                color: #f0ad4e;
            }
            /* ── Rechtsklick-Menü am Pfad-Button ── */
            .cb_ctx_menu {
                position: fixed;
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 175px;
                padding: 8px;
                background: var(--cb_background);
                color: var(--cb_font_active);
                border-radius: 12px;
                text-shadow: 0 1px 0 rgb(${text_shadow});
                box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, .25) inset, 0 1px 1px 0 rgba(255, 255, 255, .25) inset, 0 4px 18px rgba(0, 0, 0, .25);
                z-index: 1002;
                transform: scale(0.000001);
                transform-origin: bottom right;
                transition: transform 0.3s ${bouncy_transition},
                            background-color 0.25s ease-in-out;
            }
            .cb_ctx_menu.open {
                transform: scale(1);
            }
            .cb_vsc_popup .cb_vsc_list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: 40vh;
                overflow: auto;
            }
            .cb_vsc_popup .cb_vsc_list::-webkit-scrollbar {
                width: 13px;
            }
            .cb_vsc_popup .cb_vsc_list::-webkit-scrollbar-track {
                background: var(--cb_background);
                border: 3px solid transparent;
            }
            .cb_vsc_popup .cb_vsc_list::-webkit-scrollbar-thumb {
                background: var(--cb_font);
                border: 4px solid transparent;
                border-radius: 100px;
                background-clip: content-box;
            }
            .cb_vsc_popup .cb_vsc_list::-webkit-scrollbar-button {
                height: 0;
                width: 0;
            }
            .cb_vsc_popup .cb_vsc_item, .cb_ctx_menu .cb_vsc_item {
                display: block;
                width: 100%;
                border: 0;
                text-align: left;
                background: var(--cb_marking_clr);
                color: var(--cb_font_active);
                padding: 8px 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
            }
            .cb_vsc_popup .cb_vsc_item:hover, .cb_ctx_menu .cb_vsc_item:hover {
                background: var(--cb_active);
                color: #fff;
            }
            .cb_vsc_popup .cb_vsc_item .glyphicon, .cb_ctx_menu .cb_vsc_item .glyphicon {
                font-size: 11px;
                margin-right: 6px;
                opacity: .8;
                top: 1px;
            }
        `;
        }
        settingStyles();

        document.head.appendChild(style);
        const cbContainer = document.createElement('div');
        cbContainer.classList.add('cb_container');

        let dark_mode_icon = sun_svg;
        let darkmode_title = 'DARK-MODE';
        const darkModeChecker = (darkmode_btn) => {
            if (settings.darkmode) { // darkmode-styles
                dark_mode_icon = sun_svg;
                cb_background = '#1b1b1b';
                cb_background_dark = '#919191';
                cb_font_active = '#eaedf7';
                cb_marking_clr = '#2e2e2e';
                text_shadow = '0,0,0';
            } else { // lightmode-styles
                dark_mode_icon = moon_svg;
                cb_background = '#f2f5ff';
                cb_background_dark = '#363636';
                cb_font_active = '#1b1b1b';
                cb_marking_clr = '#d5d5d5';
                text_shadow = '255,255,255';
            }
            settingStyles();
            if (darkmode_btn) {
                const dark_mode_attribute = darkmode_btn.getAttribute('darkmode');
                if (dark_mode_attribute) {
                    darkmode_btn.setAttribute('darkmode', settings.darkmode);
                    if (settings.darkmode) {
                        darkmode_title = '🔆';
                    } else {
                        darkmode_title = '🌙';
                    }
                    darkmode_btn.setAttribute('title', darkmode_title);
                }
            }
            darkmode_btn.innerHTML = dark_mode_icon;
            // Orga-Darkmode-Klasse auf body synchronisieren
            // document.body.classList.toggle('cb_orga_darkmode', !!settings.darkmode);
        }

        cbContainer.innerHTML = `
            <div class="cb_settings">
                <div class="cb_ls_container cb_side_container">
                    <span class="cb_side_close_btn glyphicon glyphicon-remove" title="Übersicht schließen"></span>
                    <span class="settings_title">Projekte</span>
                    <div class="cb_ls_sort">
                        <label for="cb_ls_sort_select">Sortieren</label>
                        <select id="cb_ls_sort_select" title="Projekte hiernach sortieren – dieser Wert wird im Label vor dem Projektlink angezeigt">
                            <option value="project_id">Projekt-ID</option>
                            <option value="client_id">Kunden-ID</option>
                        </select>
                    </div>
                    <div class="cb_ls_content cb_side_content">
                    </div>
                    <button id="cb_ls_delete_btn" class="glyphicon glyphicon-trash" title="Markierte Projekte aus dem lokalen Speicher entfernen"></button>
                </div>

                <div class="cb_user_container cb_side_container">
                    <span class="cb_side_close_btn glyphicon glyphicon-remove" title="Übersicht schließen"></span>
                    <span class="settings_title">User</span>
                    <div class="cb_user_content cb_side_content">
                      <div class="cb_userdata_container">
                        <label for="cb_user_firstname">Vorname</label>
                        <input type="text" id="cb_user_firstname" placeholder="Dein Vorname" />

                        <label for="cb_user_lastname">Nachname</label>
                        <input type="text" id="cb_user_lastname" placeholder="Dein Nachname" />

                        <label for="cb_user_email">E-Mail <span style="opacity:.6;font-size:.85em">(nur vor @)</span></label>
                        <input type="text" id="cb_user_email" placeholder="z.B. max.mustermann" title="Entspricht dem IPSI-Login" />

                        <label for="cb_user_role">Rolle</label>
                        <input type="text" id="cb_user_role" placeholder="z.B. Web Designer" title="Rolle aus der IPSI-Kopfzeile" />

                        <label for="cb_user_ipsi_id">Mitarbeiter-ID</label>
                        <input type="text" id="cb_user_ipsi_id" placeholder="z.B. 173816" title="Mitarbeiter-ID aus IPSI" />
                      </div>

                      <div class="cb_department_container">
                        <label for="main_dept_select">Abteilung</label>
                        <select id="main_dept_select">
                          <option value="" disabled selected>-- Abteilung wählen --</option>
                          <option value="Team Aktualisierung Berlin">Team Aktualisierung Berlin</option>
                          <option value="Webdepartment Berlin">Webdepartment Berlin</option>
                        </select>

                        <div id="cb_user_webdepartmentberlin_container" style="display: none;">
                          <label for="sub_dept_select_webdepartmentberlin">Team</label>
                          <select id="sub_dept_select_webdepartmentberlin">
                            <option value="" disabled selected>-- Team wählen --</option>
                            <option value="Team Daniel Regiment">Team Daniel Regiment</option>
                            <option value="Team Dennis Schübel">Team Dennis Schübel</option>
                            <option value="Team Manuela Glockmann">Team Manuela Glockmann</option>
                            <option value="Team Piotr Mostowy">Team Piotr Mostowy</option>
                            <option value="Team Sabrina Reichenbach">Team Sabrina Reichenbach</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="cb_user_btns">
                        <button id="cb_user_save_btn" class="glyphicon glyphicon-floppy-disk" title="Änderungen speichern"></button>
                        <button id="cb_user_sync_btn" title="Daten erneut aus IPSI holen und in die Felder schreiben"><span class="glyphicon glyphicon-refresh"></span></button>
                    </div>
                </div>

                <div class="cb_sup_container cb_side_container">
                    <span class="cb_side_close_btn glyphicon glyphicon-remove" title="Übersicht schließen"></span>
                    <span class="settings_title">Support</span>
                    <div class="cb_sup_content cb_side_content">
                      <form id="cb_copybtn_support_form" style="display: none;">
                        <label for="cb_psi_link">ipsi pls (Projekt-Link)</label>
                        <input type="text" id="cb_psi_link" name="project_link" placeholder="https://..." />

                        <label for="cb_support_type">Typ</label>
                        <select id="cb_support_type" name="type" required>
                          <option value="" disabled selected>-- Typ wählen --</option>
                          <option value="vorschlag">Verbesserungsvorschlag</option>
                          <option value="idee">Idee</option>
                          <option value="bug">Bug Found</option>
                          <option value="help">Help me pls :(</option>
                          <option value="sonstiges">Sonstiges...</option>
                        </select>

                        <label for="cb_support_message">Nachricht</label>
                        <textarea id="cb_support_message" name="message" rows="5" required placeholder="Deine Anliegen hier bitti..."></textarea>
                      </form>
                    </div>
                    <button id="cb_sup_send_btn" class="glyphicon glyphicon-send" title="Supportticket abschicken"></button>
                </div>

                <span class="cb_darkmode_btn" darkmode="true" title="🌙">${dark_mode_icon}</span>
                <span class="cb_ls_deleter_btn glyphicon glyphicon-edit" title="Lokalen Speicher verwalten"><span></span></span>
                <span class="cb_user_deleter_btn glyphicon glyphicon-user" title="Userdaten verwalten"><span></span></span>
                <span class="cb_sup_deleter_btn glyphicon glyphicon-comment" title="Support schreiben"><span></span></span>
                <a class="cb_git_updater_deleter_btn glyphicon glyphicon-refresh" title="Jetzt Ipsi-Buttons updaten" href="https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js" target="_blank"></a>

                <span class="settings_title">Settings</span>
                <span class="cb_version">v${SCRIPT_VERSION}</span>

                <div class="cb_setting">
                    <input type="checkbox" id="copy_work_button" name="work-pfad"/>
                    <label class="cb_switch" for="copy_work_button">
                        <span class="setting_title">Pfad Erweitern <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Pfad vom Copy-Button führt bis zum work-Ordner."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="copy_icon" name="copy-icon"/>
                    <label class="cb_switch" for="copy_icon">
                        <span class="setting_title">Icons (kein Text) <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Copy-Icon als Button-Inhalt, anstatt Text."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="delete_button" name="delete-button"/>
                    <label class="cb_switch" for="delete_button">
                        <span class="setting_title">Delete-Button <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Ein Delete-Button, der beim klicken die Projekt-Daten des aktuellen Projektes, aus den lokalen Daten, löscht.&#013;Nützlich, um die lokalen Daten sauber zu halten, aber keine notwendigkeit."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="vsc_open" name="vsc-open"/>
                    <label class="cb_switch" for="vsc_open">
                        <span class="setting_title">VSC-Ordner-Öffner <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Linksklick auf den Pfad-Button listet die Ordner im Pfad und öffnet sie direkt in Visual Studio Code (als neues Fenster).&#013;Bei mehreren Ordnern erscheint eine Auswahl, bei genau einem Ordner öffnet er sich sofort.&#013;Rechtsklick öffnet ein Menü: Mit VSC öffnen / Im Explorer öffnen.&#013;Benötigt den lokalen ipsi-vsc-helper (127.0.0.1:48620)."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="sandbox_check" name="sandbox-check"/>
                    <label class="cb_switch" for="sandbox_check">
                        <span class="setting_title">Sandbox Check <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Öffnet beim Laden der Projektseite nacheinander alle Formix-Einträge, prüft ob die Sandbox aktiviert ist und schließt das Popup direkt wieder (es wird nichts gespeichert).&#013;Das Ergebnis wird in der Status-Spalte markiert: checked (grün) / unchecked (rot).&#013;Der Formix-Schnellbutton aktualisiert die Markierung immer – unabhängig von diesem Schalter."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="ps_labels" name="ps-labels"/>
                    <label class="cb_switch" for="ps_labels">
                        <span class="setting_title">PS-Labels <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Rechnet die PS-Angaben in der Meilensteine-Übersicht in Std./Min. um und zeigt sie als Label hinter der PS-Angabe an (inkl. Vergleich mit der Arbeitszeit).&#013;Deaktiviert werden die Labels wieder von der Seite entfernt."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="auto_collect" name="auto-collect"/>
                    <label class="cb_switch" for="auto_collect">
                        <span class="setting_title">Auto-Daten <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Liest die Projektdaten (KD-Nr., DFS-Speicherort, Kundendaten usw.) automatisch beim Laden der Projektseite aus.&#013;Der DFS-Speicherort kommt direkt über die DFS-API – das Domains-Panel wird dafür nicht mehr gebraucht.&#013;Nur falls die API nicht antwortet, wird das Panel kurz unsichtbar geöffnet und danach wieder zugeklappt."></span></span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <label class="cb_switch" for="cb_default_email_client">
                        <span class="setting_title always_active">E-Mail Client <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Gib an, ob das veschicken von E-Mail über die Outlook-App oder den Browser laufen soll."></span></span>
                        <select id="cb_default_email_client" class="box" name="cb_default_email_client">
                          <option value="browser">Browser</option>
                          <option value="app">Applikation</option>
                        </select>
                    </label>
                </div>

                <div class="cb_setting">
                    <label class="cb_switch" for="drive_field">
                        <span class="setting_title always_active">Laufwerk <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Gib an, in welchem Laufwerk sich deine EDO befindet."></span></span>
                        <input type="text" id="drive_field" class="box" name="drive_field-button" placeholder="${settings.copy_drive.trim().toUpperCase()}"/>
                    </label>
                </div>

                <div class="cb_setting color_settings popup_settings">
                    <span class="popup_title setting_title always_active">Button-Farbe <span class="glyphicon glyphicon-info-sign cb_info-sign" title="Passe die Farbe, des Copy-Buttons, an."></span></span>
                    <div class="popup_container">
                        <span class="color_btn popup_btn"></span>
                        <div class="color_picker popup_content">
                            <input type="radio" id="red" name="color" value="red"/>
                            <label class="cb_input red" for="red">
                                <span class="box"></span>
                            </label>
                            <input type="radio" id="yellow" name="color" value="yellow"/>
                            <label class="cb_input yellow" for="yellow">
                                <span class="box"></span>
                            </label>
                            <input type="radio" id="blue" name="color" value="blue"/>
                            <label class="cb_input blue" for="blue">
                                <span class="box"></span>
                            </label>
                            <input type="radio" id="cyan" name="color" value="cyan"/>
                            <label class="cb_input cyan" for="cyan">
                                <span class="box"></span>
                            </label>
                            <input type="radio" id="green" name="color" value="green"/>
                            <label class="cb_input green" for="green">
                                <span class="box"></span>
                            </label>
                            <input type="radio" id="gray" name="color" value="gray"/>
                            <label class="cb_input gray" for="gray">
                                <span class="box"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cb_btn btn btn-default glyphicon glyphicon-cog"></div>
        `;

        document.querySelector('.copyBtnContainer').appendChild(cbContainer);

        const cb_darkmode_btn = document.querySelector('.cb_darkmode_btn');
        darkModeChecker(cb_darkmode_btn);
        cb_darkmode_btn.addEventListener('click', function() {
            let darkmode_value = false;
            if (settings.darkmode) {
                darkmode_value = false;
            } else {
                darkmode_value = true;
            }
            updateSettings({ darkmode: darkmode_value });
            darkModeChecker(cb_darkmode_btn);
        });
        const cb_default_email_client = document.querySelector('#cb_default_email_client');
        cb_default_email_client.addEventListener('click', function() {
            console.log(cb_default_email_client.value);
            updateSettings({ default_email_client: cb_default_email_client.value });
        });
        const drive_field = document.querySelector('#drive_field');
        drive_field.addEventListener('change', function() {
            const edo_drive_object = { // ( ͡° ͜ʖ ͡°)
                cringe: 'hvL1339luv0',
                goofy: 'oUI_tVU77cw',
                quak: 'q38Y5FLK63k',
                ayaya: 'D0q0QeQbw9U',
                meow: 'PMH54eetPSo',
                takeonme: 'cVvI8GdTfh4',
                huh: 'FfZLtpKamFc',
            }
            const edo_drive = drive_field.value.trim().toLowerCase();
            if (edo_drive_object.hasOwnProperty(edo_drive)) {
                window.open(`https://www.youtube.com/watch?v=${edo_drive_object[edo_drive]}`, '_blank');
            }
            drive_field.setAttribute('placeholder', edo_drive);
            updateSettings({ copy_drive: edo_drive });
        });

        function loadLocalStorageItems() { // Funktion für den localStorage-Manager
            const container = document.querySelector('.cb_ls_content');
            container.innerHTML = ''; // leere Container (nur für den Fall, dass die Liste neu geladen wird... sehe Funktion "deleteSelectedItems()")

            const sortField = (document.querySelector('#cb_ls_sort_select')?.value) || settings.ls_sort || 'project_id'; // aktuelles Sortierkriterium ('project_id' oder 'client_id')

            const items = []; // erst alle Projekte (nur numerische Keys) einsammeln, dann sortiert ausgeben
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                const keyInfo = lsKeyInfo(key); // Projekte (numerischer Key) UND Verträge ("contract_<KD-Nr.>") einsammeln
                if (keyInfo) {
                    let value_obj = null;
                    try { value_obj = JSON.parse(localStorage.getItem(key)); } catch (e) { value_obj = null; }
                    if (value_obj && typeof value_obj === 'object') {

                        // Ältere Versionen (alle unter 0.82) nutzen "url_id" als Key für Projekt-ID, anstatt "project_id". Das wird hier angepasst ("url_id" → "project_id).
                        if ('url_id' in value_obj) value_obj.project_id = value_obj.url_id;

                        items.push({ key, value_obj, keyInfo });
                    }
                }
            }

            // Nach dem gewählten Kriterium sortieren. Für 'project_id' nutzen wir den Key (= Projekt-ID), sonst das jeweilige Feld (z.B. client_id).
        const sortValueOf = (item) => sortField === 'project_id' ? item.keyInfo.id : (item.value_obj[sortField] ?? '');
            items.sort((a, b) => {
                const av = String(sortValueOf(a)).trim();
                const bv = String(sortValueOf(b)).trim();
                if (!av && !bv) return 0;
                if (!av) return 1;  // leere Werte ans Ende
                if (!bv) return -1;
                return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }); // numerisch-bewusst (2 vor 10)
            });

        items.forEach(({ key, value_obj, keyInfo }) => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-key', key); // "Key" als value für data attribute "data-key" setzten

                const objChecker = {
                    client_id: `KD-ID: ${value_obj.client_id}`,
                    client_domain: `KD-DOMAIN: ${value_obj.client_domain}`,
                    client_brand: `KD-BRAND: ${value_obj.client_brand}`,
                    client_name: `KD-NAME: ${value_obj.client_name}`,
                    client_street: `KD-STRAßE: ${value_obj.client_street}`,
                    client_location: `KD-ORT: ${value_obj.client_location}`,
                    client_email: `KD-EMAIL: ${value_obj.client_email}`,
                    project_id: `PROJ-ID: ${value_obj.project_id}`,
                    project_brand: `PROJ-BRAND: ${value_obj.project_brand}`,
                    project_type: `PROJ-TYP: ${value_obj.project_type}`
                };

                let project_btnTitle = Object.entries(objChecker) // title-Content konstruieren und nur elemente einsetzten, wenn vorhandene (bzw. wenn nicht "undefined")
                .filter(([key]) => value_obj[key] !== undefined && String(value_obj[key]).trim() !== '') // leere Werte (z.B. Projekt-Typ auf der Vertrags-Seite) nicht anzeigen
                    .map(([_, formattedValue]) => formattedValue + '&#013')
                    .join('');

                // Führender Wert im Label: bei 'project_id' die Projekt-ID (= Key), sonst der gewählte Wert (z.B. Kunden-ID). Fehlt der Wert, zeigen wir "–".
                const rawLeadValue = sortField === 'project_id' ? keyInfo.id : value_obj[sortField];
                const leadValue = (rawLeadValue !== undefined && String(rawLeadValue).trim() !== '') ? rawLeadValue : '–';

                label.innerHTML = `${leadValue} | <a href="${keyInfo.link}" title="${keyInfo.title}" target="_blank">${keyInfo.label}</a> <span class="glyphicon glyphicon-info-sign cb_info-sign" title="${project_btnTitle}"></span>`;

                label.appendChild(checkbox);
                // label.appendChild(document.createTextNode(`${key}`));
                container.appendChild(label);
            });
        }
        function dragSelectItems() { // Funktion um labels beim dragen zu checken
            const container = document.querySelector('.cb_ls_content');
            let isMouseDown = false, applyChecked = null; // Merkt sich, ob wir aktivieren oder deaktivieren

            container.addEventListener('mousedown', e => { // Wenn Maustaste gedrückt wird (nur bei Linksklick)
                if (e.button !== 0) return;
                const cb = e.target.closest('label')?.querySelector('input[type="checkbox"]');
                if (cb) {
                    isMouseDown = true;
                    setTimeout(function(){
                        if (isMouseDown) {
                            applyChecked = !cb.checked; // Zustand merken: sollen wir aktivieren oder deaktivieren?
                            cb.checked = applyChecked; // Erste Checkbox entsprechend setzen
                            e.preventDefault(); // Kein Text markieren
                        }
                    }, 100);
                }
            });

            document.addEventListener('mouseup', () => { // Wenn Maus losgelassen wird → Ende des Auswahlmodus
                isMouseDown = false;
                applyChecked = null;
            });

            container.addEventListener('mouseover', e => { // Wenn mit gedrückter Taste über andere Labels gehovt wird
                if (!isMouseDown) return;
                const cb = e.target.closest('label')?.querySelector('input[type="checkbox"]');
                cb ? cb.checked = applyChecked : null;
            });
        }
        function deleteSelectedItems() { // Funktion um die ausgewählten Items (Projekte) aus dem localStorage zu löschen
            const checkboxes = document.querySelectorAll('.cb_ls_content input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                const key = checkbox.getAttribute('data-key');
                localStorage.removeItem(key); // Item aus localStorage entfernen
            });
            loadLocalStorageItems(); // Projekt-Liste neu ausgeben (weil Projekte gelöscht wurden)
        }
        const cb_ls_sort_select = document.querySelector('#cb_ls_sort_select'); // Sortier-Dropdown der Projekt-Auflistung
        if (cb_ls_sort_select) {
            cb_ls_sort_select.value = settings.ls_sort || 'project_id'; // gespeichertes Sortierkriterium übernehmen
            cb_ls_sort_select.addEventListener('change', function() {
                settings.ls_sort = this.value; // Auswahl merken...
                localStorage.setItem('settings', JSON.stringify(settings)); // ...und im lokalen Speicher speichern
                loadLocalStorageItems(); // Liste neu sortieren und mit dem gewählten Wert im Label ausgeben
            });
        }
        loadLocalStorageItems();
        dragSelectItems();
        document.querySelector('#cb_ls_delete_btn').addEventListener('click', deleteSelectedItems); // Delete-Button


        // Öffnen und schließen von Settings, popUp usw...
        //////////////////////////////////////////////////
        const cb_btn = document.querySelector('.cb_btn'),
              cb_container = document.querySelector('.cb_container'),
              cb_ls_deleter_btn = document.querySelector('.cb_ls_deleter_btn'),
              cb_ls_close_btn = document.querySelector('.cb_ls_container .cb_side_close_btn'),
              cb_ls_container = document.querySelector('.cb_ls_container'),
              cb_user_deleter_btn = document.querySelector('.cb_user_deleter_btn'),
              cb_user_close_btn = document.querySelector('.cb_user_container .cb_side_close_btn'),
              cb_user_container = document.querySelector('.cb_user_container'),
              cb_sup_deleter_btn = document.querySelector('.cb_sup_deleter_btn'),
              cb_sup_close_btn = document.querySelector('.cb_sup_container .cb_side_close_btn'),
              cb_sup_container = document.querySelector('.cb_sup_container'),
              popups = document.querySelectorAll('.popup_settings'),
              popup_content = document.querySelectorAll('.popup_content');
        cb_btn.addEventListener('click', function() {
            if (cb_ls_container.classList.contains('open')) {
                cb_ls_container.classList.remove('open');
                setTimeout(function (){
                    cb_container.classList.toggle('open');
                }, 225);
            } else if (cb_user_container.classList.contains('open')) {
                cb_user_container.classList.remove('open');
                setTimeout(function (){
                    cb_container.classList.toggle('open');
                }, 225);
            } else if (cb_sup_container.classList.contains('open')) {
                cb_sup_container.classList.remove('open');
                setTimeout(function (){
                    cb_container.classList.toggle('open');
                }, 225);
            } else if (Array.from(popup_content).some(popup => popup.classList.contains('open'))) {
                popup_content.forEach(popup => popup.classList.remove('open'));
                setTimeout(function (){
                    cb_container.classList.toggle('open');
                }, 225);
            } else {
                cb_container.classList.toggle('open');
            }
        });
        cb_ls_deleter_btn.addEventListener('click', function() {
            cb_ls_container.classList.toggle('open');
            cb_user_container.classList.remove('open');
            cb_sup_container.classList.remove('open');
        });
        cb_ls_close_btn.addEventListener('click', function() {
            cb_ls_container.classList.toggle('open');
            cb_user_container.classList.remove('open');
            cb_sup_container.classList.remove('open');
        });
        cb_user_deleter_btn.addEventListener('click', function() {
            cb_user_container.classList.toggle('open');
            cb_ls_container.classList.remove('open');
            cb_sup_container.classList.remove('open');
        });
        cb_user_close_btn.addEventListener('click', function() {
            cb_user_container.classList.toggle('open');
            cb_ls_container.classList.remove('open');
            cb_sup_container.classList.remove('open');
        });
        cb_sup_deleter_btn.addEventListener('click', function() {
            cb_sup_container.classList.toggle('open');
            cb_ls_container.classList.remove('open');
            cb_user_container.classList.remove('open');
        });
        cb_sup_close_btn.addEventListener('click', function() {
            cb_sup_container.classList.toggle('open');
            cb_ls_container.classList.remove('open');
            cb_user_container.classList.remove('open');
        });
        document.addEventListener('click', function(event) {
            const isClickInsideBtn = cb_btn.contains(event.target),
                  isClickInsideContainer = cb_container.contains(event.target),
                  isClickInsideItems = cb_ls_container.contains(event.target);
            if (!isClickInsideContainer && cb_container.classList.contains('open')) {
                if (cb_ls_container.classList.contains('open') || cb_user_container.classList.contains('open') || cb_sup_container.classList.contains('open') || Array.from(popup_content).some(popup => popup.classList.contains('open'))) {
                    setTimeout(function (){
                        cb_container.classList.remove('open');
                    }, 225);
                } else {
                    cb_container.classList.remove('open');
                }
                popup_content.forEach(popup => popup.classList.remove('open'));
                cb_ls_container.classList.remove('open');
                cb_user_container.classList.remove('open');
                cb_sup_container.classList.remove('open');
            }
        });
        popup_content.forEach(popup => {
            document.addEventListener('click', function(event) {
                const isClickInsidePopup = popup.contains(event.target),
                      isClickInsideContainer = cb_container.contains(event.target);
                if (!isClickInsidePopup && isClickInsideContainer) {
                    popup.classList.remove('open');
                }
            });
        });
        popups.forEach(popup => {
            const popup_title = popup.querySelector('.popup_title'),
                  popup_btn = popup.querySelector('.popup_btn'),
                  popup_content = popup.querySelector('.popup_content');
            function clickPopupBtn(button) {
                button.addEventListener('click', function(event) {
                    event.stopPropagation();
                    popup_content.classList.toggle('open');
                });
            }
            clickPopupBtn(popup_title);
            clickPopupBtn(popup_btn);
        });
        //////////////////////////////////////////////////

        if (!localStorage.getItem('settings')) {
            localStorage.setItem('settings', JSON.stringify(settings));
        } else {
            const storedSettings = JSON.parse(localStorage.getItem('settings'));
            settings = { ...settings, ...storedSettings };
        }

        window.addEventListener('storage', (event) => {
            if (event.key === 'settings') {
                const updatedSettings = JSON.parse(localStorage.getItem('settings'));
                if (updatedSettings) {
                    settings = { ...settings, ...updatedSettings };
                    updateCopyButton();
                }
            }
        });

        function updateSettings(newSettings) {
            settings = { ...settings, ...newSettings };

            localStorage.setItem('settings', JSON.stringify(settings));

            updateCopyButton();
            refreshPsLabels(); // PS-Labels sofort ein-/ausblenden
        }

        function updateCopyButton() {
            const copyPath = document.querySelector('#copyPath');
            if (copyPath) {
                copyPath.remove();
            }
            const copyClientdata = document.querySelector('#copyClientdata');
            if (copyClientdata) {
                copyClientdata.remove();
            }

            const storedData = JSON.parse(localStorage.getItem(storage_key));
            if (storedData) {
                if (edoList.includes(storedData.edo)) createCopyButton(false, false, false, 'copyPath'); // ohne DFS-Speicherort keinen Pfad-Button
                createCopyButton(false, false, false, 'copyClientdata');
                injectMilestoneIcons();
            }

            const removeButton = document.querySelector('#removeButton');
            if (settings.delete_button) {
                if (!removeButton) {
                    createRemoveButton();
                }
            } else {
                if (removeButton) {
                    removeButton.remove();
                }
            }
        }

        document.querySelector('#delete_button').addEventListener('change', function() {
            updateSettings({ delete_button: this.checked });
        });
        document.querySelector('#copy_icon').addEventListener('change', function() {
            updateSettings({ copy_icon: this.checked });
        });

        // Abteilung Dropdown Logik
        (function setupDepartmentDropdown() {
            const mainSelect = document.getElementById("main_dept_select"),
                  subSelectContainer = document.getElementById("cb_user_webdepartmentberlin_container"),
                  subSelect = document.getElementById("sub_dept_select_webdepartmentberlin"),
                  saveBtn = document.getElementById("cb_user_save_btn");

            // Sichtbarkeit des Subdropdowns steuern
            mainSelect.addEventListener("change", function () {
                if (mainSelect.value === "Webdepartment Berlin") {
                    subSelectContainer.style.display = "block";
                } else {
                    subSelectContainer.style.display = "none";
                    subSelect.value = "";
                }
            });

            // Speichern der Auswahl
            saveBtn.addEventListener("click", function () {
                let department = "";
                if (mainSelect.value === "Webdepartment Berlin" && subSelect.value) {
                    department = "Webdepartment Berlin/" + subSelect.value;
                } else if (mainSelect.value && mainSelect.value !== "Webdepartment Berlin") {
                    department = mainSelect.value;
                }

                const firstname = document.getElementById("cb_user_firstname").value.trim();
                const lastname = document.getElementById("cb_user_lastname").value.trim();
                const user = [firstname, lastname].filter(Boolean).join(', ');

                const emailInput = document.getElementById("cb_user_email");
                const user_email = emailInput.value.replace(/@.*/g, '').trim(); // nur Teil vor @
                const user_role = document.getElementById("cb_user_role").value.trim();
                const user_ipsi_id = document.getElementById("cb_user_ipsi_id").value.trim();

                if (department) settings.department = department;
                settings.user = user;             // leer lassen = wieder der Wert aus IPSI
                settings.user_email = user_email; // auch leeren Wert speichern (löschen möglich)
                settings.user_role = user_role;
                settings.user_ipsi_id = user_ipsi_id;

                localStorage.setItem('settings', JSON.stringify(settings));
                cbApplyIpsiUser(); // leer gelassene Felder wieder mit den IPSI-Werten belegen

                updateCopyButton(); // Buttons direkt aktualisieren, damit sie auf'm neuen Stand sind

                showNotification('Änderungen gespeichert');

                // Popup schließen
                document.querySelector('.cb_user_container')?.classList.remove('open');
                setTimeout(function (){
                    cb_container.classList.toggle('open');
                }, 225);
            });

            // Vorbelegung laden – aus IPSI stammende Werte bleiben Platzhalter
            refreshUserButtons = updateCopyButton; // damit die Buttons nach dem IPSI-Abruf neu gebaut werden
            if (settings.department && !ipsiDefault.department) {
                cbSelectDepartment(settings.department);
            }
            if (settings.user && !ipsiDefault.user) {
                const [first = "", last = ""] = settings.user.split(',').map(s => s.trim());
                document.getElementById("cb_user_firstname").value = first;
                document.getElementById("cb_user_lastname").value = last;
            }
            if (settings.user_role && !ipsiDefault.user_role) {
                document.getElementById("cb_user_role").value = settings.user_role;
            }
            if (settings.user_ipsi_id && !ipsiDefault.user_ipsi_id) {
                document.getElementById("cb_user_ipsi_id").value = settings.user_ipsi_id;
            }

            // E-Mail-Vorbelegung und @-Filter
            const emailInput = document.getElementById("cb_user_email");
            if (settings.user_email && !ipsiDefault.user_email) {
                emailInput.value = settings.user_email;
            }
            emailInput.addEventListener('input', function () {
                // @ und alles danach sofort entfernen
                this.value = this.value.replace(/@.*/g, '');
            });
            emailInput.addEventListener('keydown', function (e) {
                if (e.key === '@') e.preventDefault();
            });

            // Sync: Daten erneut aus IPSI holen und sichtbar in die Felder schreiben
            const syncBtn = document.getElementById("cb_user_sync_btn");
            if (syncBtn) syncBtn.addEventListener("click", function () {
                const icon = syncBtn.querySelector('.glyphicon');
                if (icon) icon.classList.add('cb_user_spin');
                cbFetchIpsiUser().then(function () {
                    if (icon) icon.classList.remove('cb_user_spin');
                    if (!ipsiUser.user && !ipsiUser.user_email) {
                        showNotification('Keine Daten aus IPSI erhalten');
                        return;
                    }
                    cbFillPanelFromIpsi();
                    showNotification('Aus IPSI übernommen – noch speichern');
                });
            });

            cbApplyIpsiUser(); // Platzhalter, Abteilung und Team aus IPSI setzen

        })();

        (function setupSupportForms() {
            const supContent = document.querySelector('.cb_sup_content');

            const supportSelector = document.createElement('select');
            supportSelector.innerHTML = `
                <option value="" disabled selected>-- Support wählen --</option>
                <option value="copybtn">Copy-Button Support ʕ·͡ᴥ·ʔ</option>
                <option value="viscomp">Viscomp Support (bg)</option>
            `;
            supContent.prepend(supportSelector);

            const copyForm = document.getElementById('cb_copybtn_support_form');
            const viscompSelect = document.createElement('select');
            viscompSelect.style.display = 'none';
            viscompSelect.style.marginTop = '10px';
            viscompSelect.innerHTML = `
                <option value="" disabled selected>-- Template wählen --</option>
                <option value="mdomain">Remove m.domain</option>
                <option value="ohsnap">Oh snap! DFS deployment failed</option>
                <option value="backup">Backup</option>
            `;

            const forms = {
                mdomain: createForm('cb_bg_mdomain_form', [
                    { label: 'm.domain', type: 'text', id: 'cb_mdomain', placeholder: 'Hier die m.domain', required: true }
                ]),
                ohsnap: createForm('cb_bg_ohsnap_form', [
                    { label: 'DFS-Domain', type: 'text', id: 'cb_dfsdomain', placeholder: 'Hier die DFS-Domain', required: true }
                ]),
                backup: createForm('cb_bg_backup_form', [
                    { label: 'Backup-Domain', type: 'text', id: 'cb_backup_domain', placeholder: 'Hier die Backup-Domain', required: true },
                    { label: 'Website-Typ', type: 'select', id: 'cb_backup_type', options: ['DFS', 'DEMO', 'LIVE'], required: true },
                    { label: 'Backup-Zeitpunkt', type: 'datetime-local', id: 'cb_backup_datetime', required: true }
                ])
            };

            supContent.appendChild(viscompSelect);
            Object.values(forms).forEach(f => { f.style.display = 'none'; supContent.appendChild(f); });

            supportSelector.addEventListener('change', () => {
                const isViscomp = supportSelector.value === 'viscomp';
                viscompSelect.style.display = isViscomp ? 'block' : 'none';
                copyForm.style.display = supportSelector.value === 'copybtn' ? 'block' : 'none';
                Object.values(forms).forEach(f => f.style.display = 'none');
            });

            viscompSelect.addEventListener('change', () => {
                Object.entries(forms).forEach(([key, form]) => {
                    form.style.display = viscompSelect.value === key ? 'block' : 'none';
                });
            });

            document.getElementById("cb_sup_send_btn").addEventListener("click", () => {
                const mail_recipients = {
                    cb_support: 'k.korkmaz@wwwe.de',
                    bg_support: 'support@viscomp.bg'
                };

                const window_settings = {
                    height: '640',
                    width: '575',
                    scrollbars: 'yes',
                    status: 'yes',
                    location: 'yes',
                    target: '_blank'
                };

                const projectData = JSON.parse(localStorage.getItem(storage_key));
                const name = settings.user || 'anonym';

                if (supportSelector.value === 'viscomp') {
                    const template = viscompSelect.value;
                    const activeForm = forms[template];

                    if (!template || !activeForm) return showNotification('Bitte ein Support-Template auswählen.', 'danger');

                    const inputs = activeForm.querySelectorAll('input, select');
                    for (const input of inputs) {
                        if (input.hasAttribute('required') && !input.value.trim()) {
                            input.focus();
                            return showNotification(`Bitte Feld "${input.previousSibling.textContent}" ausfüllen.`, 'danger');
                        }
                    }

                    let subject = '', body = '', to = mail_recipients.bg_support;

                    switch (template) {
                        case 'mdomain': {
                            const domain = document.getElementById('cb_mdomain').value.trim();
                            subject = `${projectData.client_id} | ${projectData.client_domain} | Remove m.domain`;
                            body = `Hey,\n\ncould you guys please delete/remove the m.domain.\n\nDomain: ${domain}\nCustomer NR.: ${projectData.client_id}\n\nwith best regards\n${name}`;
                            break;
                        }
                        case 'ohsnap': {
                            const dfs = document.getElementById('cb_dfsdomain').value.trim();
                            subject = `${projectData.client_id} | ${projectData.client_domain} | Oh snap! DFS deployment failed`;
                            body = `Hey,\n\nCould you please reset my DFS? I have an \"Oh snap! DFS deployment failed\"-error. Just Resetting the project would be fine.\n\nDFS: ${dfs}\nCustomer NR.: ${projectData.client_id}\n\nwith best regards\n${name}`;
                            break;
                        }
                        case 'backup': {
                            const domain = document.getElementById('cb_backup_domain').value.trim();
                            const type = document.getElementById('cb_backup_type').value;
                            const datetime = document.getElementById('cb_backup_datetime').value;
                            const [date, time] = datetime.split('T');

                            const timeFormatted = (() => {
                                const [h, m] = time.split(':').map(Number);
                                const suffix = h >= 12 ? 'pm' : 'am';
                                const hour12 = ((h + 11) % 12 + 1);
                                return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
                            })();

                            subject = `${projectData.client_id} | ${projectData.client_domain} | Backup`;
                            body = `Hello guys,\n\ncould you please load a backup of the ${type} website, restoring it to the state as of ${date}, at ${timeFormatted} (CET / GMT+1)?\n\nBackup Domain: ${domain}\nCustomer NR.: ${projectData.client_id}\n\nwith best regards\n${name}`;
                            break;
                        }
                    }

                    const outlook_url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                    if (settings.default_email_client == 'browser') {
                        window.open(outlook_url, window_settings.target, `location=${window_settings.location},height=${window_settings.height},width=${window_settings.width},scrollbars=${window_settings.scrollbars},status=${window_settings.status}`);
                    } else {
                        window.location.href = mailto;
                    }

                    document.querySelector('.cb_sup_container')?.classList.remove('open');
                }
            });

            function createForm(id, fields) {
                const form = document.createElement('form');
                form.id = id;
                fields.forEach(field => {
                    const label = document.createElement('label');
                    label.textContent = field.label;
                    form.appendChild(label);

                    let input;
                    if (field.type === 'select') {
                        input = document.createElement('select');
                        if (field.required) input.required = true;
                        const placeholder = document.createElement('option');
                        placeholder.disabled = true;
                        placeholder.selected = true;
                        placeholder.textContent = '-- Auswahl --';
                        input.appendChild(placeholder);
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            input.appendChild(option);
                        });
                    } else {
                        input = document.createElement('input');
                        input.type = field.type;
                        input.placeholder = field.placeholder;
                        if (field.required) input.required = true;
                    }
                    input.id = field.id;
                    form.appendChild(input);
                });
                return form;
            }
        })();

        // Support-Formular-Submit-Handler
        document.getElementById("cb_sup_send_btn").addEventListener("click", function () {
          const form = document.getElementById("cb_copybtn_support_form");

          if (!form.reportValidity()) {
            return;
          }

          const data = {
            project_link: form.project_link.value.trim() && `Projekt-Link: ${form.project_link.value.trim()}\n\n`,
            type: form.type.value,
            message: form.message.value.trim(),
            name: settings.user ? settings.user : 'anonym',
            department: settings.department && `Abteilung: ${settings.department}\n\n`,
          };

          const window_settings = {
              height: '640',
              width: '575',
              scrollbars: 'yes',
              status: 'yes',
              location: 'yes',
              target: '_blank'
          }

          const mail_recipients = {
              cb_support: 'k.korkmaz@wwwe.de',
              bg_support: 'support@viscomp.bg'
          }

          const mailbody =
              data.project_link +
              data.department +
              `${data.message}`;

          const mailto = `mailto:${encodeURIComponent(mail_recipients.cb_support)}?subject=[Copy-Buttons: ${encodeURIComponent(data.type)}] ${encodeURIComponent(data.name)}&body=${encodeURIComponent(mailbody)}`;
          const outlook_url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(mail_recipients.cb_support)}&subject=[Copy-Buttons: ${encodeURIComponent(data.type)}] ${encodeURIComponent(data.name)}&body=${encodeURIComponent(mailbody)}`;

          if (settings.default_email_client == 'browser') {
              // Outlook über neuem Browser-Fenster öffnen
              window.open(outlook_url, window_settings.target, `location=${window_settings.location},height=${window_settings.height},width=${window_settings.width},scrollbars=${window_settings.scrollbars},status=${window_settings.status}`);
          } else if (settings.default_email_client == 'app') {
              // Outlook app öffnen
              window.location.href = mailto;
          } else {
              // DEFAULT/FALL-BACK: Outlook über neuem Browser-Fenster öffnen
              window.open(outlook_url, window_settings.target, `location=${window_settings.location},height=${window_settings.height},width=${window_settings.width},scrollbars=${window_settings.scrollbars},status=${window_settings.status}`);
          }

          // Schließe das Support-Popup nach Versand
          document.querySelector('.cb_sup_container')?.classList.remove('open');
        });

        document.querySelector('#copy_work_button').checked = settings.copy_work_button;
        document.querySelector('#copy_icon').checked = settings.copy_icon;
        document.querySelector('#delete_button').checked = settings.delete_button;
        document.querySelector('#vsc_open').checked = settings.vsc_open;
        document.querySelector('#sandbox_check').checked = settings.sandbox_check;
        document.querySelector('#ps_labels').checked = settings.ps_labels !== false;
        document.querySelector('#auto_collect').checked = settings.auto_collect !== false;

        const popupColor = document.querySelector('.color_btn.popup_btn');
        popupColor.className = 'color_btn popup_btn';
        popupColor.classList.add(settings.button_color);

        const selectedColorRadio = document.querySelector(`input[type="radio"][value="${settings.button_color}"]`);
        if (selectedColorRadio) {
            selectedColorRadio.checked = true;
        }

        function updateColorButton(color) {
            popupColor.className = 'color_btn popup_btn';
            popupColor.classList.add(color);

            updateSettings({ button_color: color });
        }

        const inputs = document.querySelectorAll('.cb_setting input');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                const cbSettingContainer = this.closest('.cb_setting');
                const label = document.querySelector(`label[for="${this.id}"]`);

                if (this.type === 'radio' && this.name === 'color') {
                    updateColorButton(this.value);
                }

                if (this.type === 'radio') {
                    const radios = document.querySelectorAll(`input[name="${this.name}"]`);
                    radios.forEach(radio => {
                        const radioContainer = radio.closest('.cb_setting');
                        const radioLabel = document.querySelector(`label[for="${radio.id}"]`);
                        if (radio.checked) {
                            radioContainer.classList.add('active');
                            if (radioLabel) radioLabel.classList.add('active');
                        } else {
                            radioContainer.classList.remove('active');
                            if (radioLabel) radioLabel.classList.remove('active');
                        }
                    });
                } else {
                    if (this.checked) {
                        cbSettingContainer.classList.add('active');
                        if (label) label.classList.add('active');
                    } else {
                        cbSettingContainer.classList.remove('active');
                        if (label) label.classList.remove('active');
                    }

                    updateSettings({
                        [this.id]: this.checked
                    });
                }
            });
        });

        inputs.forEach(input => {
            const cbSettingContainer = input.closest('.cb_setting');
            const label = document.querySelector(`label[for="${input.id}"]`);

            if (input.checked) {
                cbSettingContainer.classList.add('active');
                if (label) label.classList.add('active');
            }
        });
    };

    // ─── Formix Sandbox-Check ────────────────────────────────────────────────
    // Öffnet Formix-Einträge über den formixEdit-Button, liest die Sandbox-
    // Checkbox aus, schließt das Popup direkt wieder und markiert das Ergebnis
    // hinter dem Status-Text: "checked" (grün) bzw. "unchecked" (rot).
    const cbWaitFor = (conditionFn, timeoutMs = 10000, intervalMs = 100) => new Promise((resolve) => { // pollt, bis die Bedingung etwas Truthy liefert (oder Timeout → null)
        const started = Date.now();
        const timer = setInterval(() => {
            let result = null;
            try { result = conditionFn(); } catch (e) { /* Bedingung darf scheitern */ }
            if (result) { clearInterval(timer); resolve(result); }
            else if (Date.now() - started > timeoutMs) { clearInterval(timer); resolve(null); }
        }, intervalMs);
    });

    const waitForQuietDom = (element, quietMs = 1200, maxMs = 12000) => new Promise((resolve) => { // wartet, bis in einem Element eine Weile keine DOM-Änderungen mehr passieren (= fertig geladen)
        let finished = false;
        let timer = null;
        const done = () => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            observer.disconnect();
            resolve(true);
        };
        const observer = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(done, quietMs); });
        observer.observe(element, { childList: true, subtree: true });
        timer = setTimeout(done, quietMs);
        setTimeout(done, maxMs); // Sicherheitsnetz: nicht ewig warten
    });

    const getFormixStatusCell = (row) => { // Status-Zelle über die Spaltenüberschrift der Tabelle finden
        const table = row.closest('table');
        if (!table) return null;
        const headers = Array.from(table.querySelectorAll('thead th'));
        let index = headers.findIndex(th => th.textContent.trim().toLowerCase() === 'status');
        if (index === -1) index = headers.findIndex(th => th.textContent.toLowerCase().includes('status'));
        return index >= 0 ? (row.cells[index] || null) : null;
    };

    const formixSandboxResults = new Map(); // formixEdit-Href → Sandbox aktiv (true/false); übersteht das Neuladen der Tabelle

    const getFormixResultForLink = (href) => { // Ergebnis zum Edit-Link finden – notfalls über die Formix-ID (letztes URL-Segment), falls action und href unterschiedlich geschrieben sind
        if (formixSandboxResults.has(href)) return formixSandboxResults.get(href);
        const id = String(href || '').split('/').filter(Boolean).pop();
        if (!id) return undefined;
        for (const [key, value] of formixSandboxResults) {
            if (String(key).split('/').filter(Boolean).pop() === id) return value;
        }
        return undefined;
    };

    const applyFormixSandboxLabels = () => { // gemerkte Markierungen (wieder) einsetzen – idempotent, damit der MutationObserver nicht endlos feuert
        document.querySelectorAll('table#formixTable > tbody > tr').forEach(row => {
            const editLink = row.querySelector('a.btn.formixEdit');
            if (!editLink) return;
            const result = getFormixResultForLink(editLink.getAttribute('href'));
            if (result === undefined) return; // dieser Eintrag wurde (noch) nicht geprüft
            const cell = getFormixStatusCell(row);
            if (!cell) return;
            const existing = cell.querySelector('.cb_sandbox_label');
            if (existing && existing.classList.contains(result ? 'label-success' : 'label-danger')) return; // schon korrekt → nichts anfassen
            if (existing) existing.remove(); // Zustand hat sich geändert → Markierung ersetzen
            cell.insertAdjacentHTML('beforeend', result
                ? ' <span class="label label-success cb_sandbox_label">checked</span>'
                : ' <span class="label label-danger cb_sandbox_label">unchecked</span>');
        });
    };

    const recordFormixSandboxResult = (editHref, isChecked) => { // Ergebnis merken und sofort anzeigen
        if (!editHref) return;
        formixSandboxResults.set(editHref, !!isChecked);
        applyFormixSandboxLabels();
    };

    // Markierung nur bei erfolgreichem Speichern übernehmen:
    // Beim Klick auf "Speichern" (bzw. beim Absenden von #formix-form) wird der
    // Sandbox-Stand samt Formular-URL zwischengemerkt. Übernommen wird er erst,
    // wenn die Seite mit "Form saved" bestätigt hat – die Seite ersetzt dabei den
    // kompletten #formixBody durch die Erfolgsmeldung, das Formular ist danach weg.
    // Wird das Popup anderweitig geschlossen (X, Schliessen, ESC …), wird der
    // zwischengemerkte Stand verworfen: Nicht gespeicherte Änderungen landen nie
    // in der Markierung.
    let formixPendingSave = null; // { key, checked } – wartet auf die "Form saved"-Bestätigung

    const captureFormixPendingSave = () => { // Stand JETZT lesen, solange das Formular noch im DOM steht
        const form = document.querySelector('#formixModal #formix-form');
        const sandboxCb = form ? form.querySelector('[type="checkbox"][name="sandbox"]') : null;
        if (form && sandboxCb) formixPendingSave = { key: form.getAttribute('action'), checked: sandboxCb.checked };
    };
    document.addEventListener('click', (e) => { // Klick auf den Speichern-Button (auch der Schnellbutton klickt ihn programmatisch)
        if (e.target && e.target.closest && e.target.closest('#formixSave')) captureFormixPendingSave();
    }, true); // Capture-Phase: läuft garantiert vor den Handlern der Seite
    document.addEventListener('submit', (e) => { // deckt zusätzlich das Absenden per Enter-Taste ab
        if (e.target && e.target.id === 'formix-form') captureFormixPendingSave();
    }, true);

    const isFormixSavedAlertVisible = (modalEl) => {
        const alert = modalEl.querySelector('#formixBody .alert.alert-success');
        return !!(alert && alert.textContent.includes('Form saved'));
    };
    const commitFormixPendingSave = () => {
        if (!formixPendingSave) return;
        recordFormixSandboxResult(formixPendingSave.key, formixPendingSave.checked);
        formixPendingSave = null;
    };

    let formixModalWatched = null; // das aktuell beobachtete Modal-Element (wird neu verkabelt, falls die Seite es austauscht)
    let formixLiveState = null; // { key, checked } - laufend aktualisierter Stand des aktuell geoeffneten Formix
        const captureFormixLiveState = () => { // aktuellen Sandbox-Stand + Formular-URL merken, solange das Formular im DOM ist
            const form = document.querySelector('#formix-form');
            if (!form) return;
            const key = form.getAttribute('action');
            if (!key) return;
            const sandboxCb = form.querySelector('[type="checkbox"][name="sandbox"]');
            if (!sandboxCb) return;
            formixLiveState = { key: key, checked: sandboxCb.checked };
        };
        const attachFormixModalWatcher = () => {
            const modalEl = document.querySelector('#formixModal');
            if (!modalEl || modalEl === formixModalWatched) return;
            formixModalWatched = modalEl;


            new MutationObserver(() => { // Inhalt aendert sich (Formular geladen/getippt): 'Form saved' pruefen UND Live-Stand nachfuehren
                if (formixPendingSave && isFormixSavedAlertVisible(modalEl)) commitFormixPendingSave();
                captureFormixLiveState();
            }).observe(modalEl, { childList: true, subtree: true });


            // Aenderungen an der Sandbox-Checkbox direkt mitnehmen (Klick/Change im Formular).
            modalEl.addEventListener('change', (e) => {
                if (e.target && e.target.matches && e.target.matches('[type="checkbox"][name="sandbox"]')) captureFormixLiveState();
            }, true);
            modalEl.addEventListener('click', () => { captureFormixLiveState(); }, true);


            let wasOpen = modalEl.classList.contains('in');
            if (wasOpen) captureFormixLiveState();
            new MutationObserver(() => {
                const isOpen = modalEl.classList.contains('in');
                if (!wasOpen && isOpen) { // gerade geoeffnet -> Startstand erfassen
                    captureFormixLiveState();
                }
                if (wasOpen && !isOpen) { // Popup wurde gerade geschlossen (X, ausserhalb-Klick, Schliessen, Speichern ...)
                    if (formixPendingSave && isFormixSavedAlertVisible(modalEl)) commitFormixPendingSave(); // gespeicherter Stand hat Vorrang
                    formixPendingSave = null;
                    // Label IMMER anhand des zuletzt gesehenen Sandbox-Stands aktualisieren - egal wie geschlossen wurde.
                    if (formixLiveState && formixLiveState.key) recordFormixSandboxResult(formixLiveState.key, formixLiveState.checked);
                    formixLiveState = null;
                }
                wasOpen = isOpen;
            }).observe(modalEl, { attributes: true, attributeFilter: ['class'] });
        };

    let formixSandboxCheckRunning = false;
    const runFormixSandboxCheck = async () => { // prueft alle Formix parallel per fetch (kein Modal-Oeffnen/-Schliessen noetig) -> deutlich schneller
        if (formixSandboxCheckRunning) return;
        const targets = Array.from(document.querySelectorAll('table#formixTable > tbody > tr a.btn.formixEdit, table#formixTable > tbody > tr a.formixEdit'))
            .map(link => link.getAttribute('href'))
            .filter(Boolean);
        // Duplikate entfernen (falls die Tabelle einen Link mehrfach rendert)
        const uniqueTargets = Array.from(new Set(targets));
        if (!uniqueTargets.length) return;

        formixSandboxCheckRunning = true;
        let checkedCount = 0;
        try {
            showNotification(`Sandbox-Check laeuft (${uniqueTargets.length} Formix)…`, 'info');

            // Das Bearbeitungsformular jedes Formix direkt laden und die Sandbox-Checkbox auslesen.
            // Kleine Helper-Funktion mit einem Retry, damit ein einzelner Aussetzer nicht gleich fehlschlaegt.
            const readSandbox = async (href) => {
                for (let attempt = 0; attempt < 2; attempt++) {
                    try {
                        const resp = await fetch(href, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                        if (!resp.ok) throw new Error('HTTP ' + resp.status);
                        const html = await resp.text();
                        const doc = new DOMParser().parseFromString(html, 'text/html');
                        const cb = doc.querySelector('[type="checkbox"][name="sandbox"]');
                        if (cb) return cb.checked;
                    } catch (e) { /* naechster Versuch */ }
                }
                return null; // konnte nicht gelesen werden
            };

            // Alle parallel anstossen -> die langsamen Ladezeiten laufen gleichzeitig statt nacheinander.
            const results = await Promise.all(uniqueTargets.map(async (href) => ({ href: href, checked: await readSandbox(href) })));

            // Fehlgeschlagene Eintraege sammeln fuer optionalen Modal-Fallback.
            const failed = [];
            results.forEach((r) => {
                if (r.checked === null) { failed.push(r.href); return; }
                recordFormixSandboxResult(r.href, r.checked);
                checkedCount++;
            });

            // Fallback: einzelne, die per fetch nicht klappten, klassisch ueber das Modal auslesen.
            if (failed.length) {
                const modalEl = document.querySelector('#formixModal');
                if (modalEl) {
                    for (const href of failed) {
                        const editLink = await cbWaitFor(() => document.querySelector(`table#formixTable a.formixEdit[href="${href}"]`), 8000, 200);
                        if (!editLink) continue;
                        const modalBody = modalEl.querySelector('#formixBody');
                        if (modalBody) modalBody.innerHTML = '';
                        editLink.click();
                        const sandboxCb = await cbWaitFor(() => modalEl.classList.contains('in')
                            ? modalEl.querySelector('[type="checkbox"][name="sandbox"]')
                            : null, 10000);
                        if (sandboxCb) { recordFormixSandboxResult(href, sandboxCb.checked); checkedCount++; }
                        modalEl.querySelector('button.close')?.click();
                        await cbWaitFor(() => modalEl.classList.contains('in') ? null : true, 4000);
                    }
                }
            }

            applyFormixSandboxLabels();
            showNotification(`Sandbox-Check: ${checkedCount}/${uniqueTargets.length} Formix geprueft`, checkedCount === uniqueTargets.length ? 'success' : 'warning');
        } finally {
            formixSandboxCheckRunning = false;
        }
    };
    // ─────────────────────────────────────────────────────────────────────────

    // formixTable: Sandbox-Schnellbutton
    function injectFormixButtons() {
        const rows = document.querySelectorAll('table#formixTable > tbody > tr');
        rows.forEach(row => {
            const firstTd = row.querySelector('td:first-child');
            if (!firstTd || firstTd.querySelector('.cb_formix_check_btn')) return; // bereits vorhanden

            const btn = document.createElement('a');
            btn.className = 'btn btn-info glyphicon glyphicon-check cb_formix_check_btn';
            btn.title = 'Sandbox aktivieren & E-Mail eintragen';

            btn.addEventListener('click', async function (e) {
                e.preventDefault();
                e.stopPropagation();

                const editLink = row.querySelector('a.btn.formixEdit') || row.querySelector('a.formixEdit');
                if (!editLink) return;
                const href = editLink.getAttribute('href');
                if (!href) return;

                // Doppelklicks/Mehrfachausloesung waehrend des Speicherns verhindern
                if (btn.dataset.cbBusy === '1') return;
                btn.dataset.cbBusy = '1';
                const _origPointer = btn.style.pointerEvents;
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.6';

                try {
                    // 1) Aktuelles Formular direkt laden (kein Modal noetig)
                    const getResp = await fetch(href, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                    if (!getResp.ok) throw new Error('GET ' + getResp.status);
                    const getHtml = await getResp.text();
                    const getDoc = new DOMParser().parseFromString(getHtml, 'text/html');
                    const form = getDoc.querySelector('#formix-form') || getDoc.querySelector('form');
                    if (!form) throw new Error('Formular nicht gefunden');

                    const sandboxCb = form.querySelector('[type="checkbox"][name="sandbox"]');
                    const sandboxEmail = form.querySelector('[type="text"][name="sandbox_email"]');
                    if (!sandboxCb && !sandboxEmail) throw new Error('Sandbox-Felder nicht gefunden');

                    // 2) Wie bisher: Sandbox umschalten + feste Sandbox-E-Mail setzen
                    let newChecked = null;
                    if (sandboxCb) { newChecked = !sandboxCb.checked; sandboxCb.checked = newChecked; }
                    if (sandboxEmail) { sandboxEmail.value = 'formix@wwwe.de'; }

                    // 3) Formular exakt wie der Browser serialisieren und per POST speichern
                    const postResp = await fetch(form.getAttribute('action') || href, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-Requested-With': 'XMLHttpRequest' },
                        body: new FormData(form)
                    });
                    const postText = await postResp.text();
                    const saved = postResp.ok && /Form saved/i.test(postText);

                    if (saved) {
                        // 4) Label sofort passend zum neuen Stand setzen (ohne Tabellen-Reload)
                        if (newChecked !== null) recordFormixSandboxResult(href, newChecked);
                        showNotification(newChecked ? '\u2714 Sandbox aktiviert & E-Mail eingetragen' : '\u2718 Sandbox deaktiviert', newChecked ? 'success' : 'info');
                    } else {
                        showNotification('Speichern fehlgeschlagen (HTTP ' + postResp.status + ')', 'danger');
                    }
                } catch (err) {
                    showNotification('Fehler beim Sandbox-Setzen: ' + (err && err.message ? err.message : err), 'danger');
                } finally {
                    btn.dataset.cbBusy = '';
                    btn.style.pointerEvents = _origPointer;
                    btn.style.opacity = '';
                }
            });

            firstTd.prepend(btn);
        });
    }

    // Auto-Check beim Laden der Seite (Settings-Schalter "Sandbox Check"):
    // Der formixContainer wird von der Seite erst mit Verzögerung in den anfangs
    // leeren panel-body geladen – und das kann beliebig lange dauern. Deshalb
    // keine feste Wartezeit mehr, sondern ereignisgesteuert: sobald die Formix-
    // Tabelle auftaucht (egal wann) und der Container zur Ruhe gekommen ist,
    // startet der Durchlauf genau einmal.
    let formixAutoCheckStarted = false;
    const maybeStartFormixAutoCheck = () => {
        if (formixAutoCheckStarted || !settings.sandbox_check) return;
        if (!document.querySelector('table#formixTable > tbody > tr a.btn.formixEdit')) return; // Tabelle ist noch nicht geladen
        formixAutoCheckStarted = true;
        const container = document.querySelector('#formixContainer')
            || document.querySelector('table#formixTable')?.closest('.panel')
            || document.querySelector('table#formixTable')?.parentElement
            || document.body;
        waitForQuietDom(container, 1200, 15000).then(() => runFormixSandboxCheck()); // erst loslegen, wenn der formixContainer fertig geladen/gerendert ist
    };

    // Initial + dynamisch (falls Tabelle per AJAX nachgeladen wird)
    injectFormixButtons();
    maybeStartFormixAutoCheck();
    attachFormixModalWatcher();
    const formixObserver = new MutationObserver(() => { injectFormixButtons(); applyFormixSandboxLabels(); maybeStartFormixAutoCheck(); attachFormixModalWatcher(); }); // Buttons, gemerkte Markierungen, Auto-Check-Start und Popup-Beobachter nach jedem Neu-Rendern prüfen
    const formixTableParent = document.querySelector('table#formixTable')?.parentElement || document.body;
    formixObserver.observe(formixTableParent, { childList: true, subtree: true });
    // ─────────────────────────────────────────────────────────────────────────

    // ─── Meilensteine: PS → Zeit-Labels & Vergleich mit der Arbeitszeit ──────
    // Rechnet die PS-Angaben (1 PS = 60 Min.) in der Meilensteine-Übersicht in
    // "Std./Min." um und vergleicht sie pro Segment mit der "Aktuelle Arbeitszeit"-
    // Übersicht. Die Markierung landet als Label direkt hinter der PS-Angabe,
    // der Tooltip zeigt die Plus-/Minuszeit. Hinter der Gesamtearbeitszeit steht
    // zusätzlich die gesamte Projektzeit samt Differenz.
    (function setupPsLabels() {
        const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();

        const normUser = (t) => norm(t).toLowerCase().replace(/,/g, ' ').split(/\s+/).filter(Boolean).sort().join(' '); // "Burmeister, Nico" und " Nico Burmeister" → derselbe Schlüssel (Komma und Reihenfolge egal, auch bei mehrteiligen Namen)

        const SPECIAL_PS_DEFAULTS = { // Vorgaben: bekannte Special-Tasks mit fester Standard-PS (per Klick weiterhin anpassbar); Schlüssel = "Gruppe Name" in Kleinschreibung
            'yourrate: implementierung': 1,
            'umsetzung: jobmanager einbinden': 0.5,
            'scp: redaktionsplan erstellen': 1,
            'sonderaufgabe: javascript / merkzettel': 1,
            'sonderaufgabe: php / collect/merkzettel': 2,
        };

        const findPanelByTitle = (title) => Array.from(document.querySelectorAll('.panel'))
            .find(panel => norm(panel.querySelector('.panel-title')?.textContent) === title) || null;

        const parseGermanTime = (text) => { // "4 Std. 40 Min." / "0 Min." / "1 Std." → Minuten (null, wenn keine Zeitangabe enthalten)
            const h = /(\d+)\s*Std\./.exec(text);
            const m = /(\d+)\s*Min\./.exec(text);
            if (!h && !m) return null;
            return (h ? +h[1] : 0) * 60 + (m ? +m[1] : 0);
        };

        const parsePs = (text) => { // "1.00 PS" / "1,5 PS" → Minuten (null, wenn kein PS-Wert enthalten)
            const match = /(\d+(?:[.,]\d+)?)\s*PS\b/.exec(text);
            return match ? Math.round(parseFloat(match[1].replace(',', '.')) * 60) : null;
        };

        const fmtTime = (minutes) => { // Minuten → "2 Std. 0 Min." bzw. "40 Min." (gleicher Stil wie die Seite)
            const h = Math.floor(minutes / 60), m = minutes % 60;
            return h > 0 ? `${h} Std. ${m} Min.` : `${m} Min.`;
        };

        const fmtDiff = (diff) => { // Differenz in Minuten → "+1 Std." / "-3 Std. 40 Min." / "±0 Min."
            if (diff === 0) return '±0 Min.';
            const abs = Math.abs(diff), h = Math.floor(abs / 60), m = abs % 60;
            const parts = [];
            if (h > 0) parts.push(`${h} Std.`);
            if (m > 0 || h === 0) parts.push(`${m} Min.`);
            return (diff > 0 ? '+' : '-') + parts.join(' ');
        };

        const psLabelClass = (psMin, workMin, isOffen) => { // Farbregeln für das Label
            if (isOffen || workMin === 0) return 'label-default'; // Status "Offen" oder noch gar nicht dran gearbeitet
            const over = workMin - psMin; // so viel länger wurde gearbeitet, als Zeit da war
            if (over > 120) return 'label-danger';   // mehr als 2 Std. drüber
            if (over > 0) return 'label-warning';    // drüber (bis 2 Std.)
            if (over === 0) return 'label-primary';  // exakt im Rahmen
            return 'label-success';                  // weniger gebraucht als vorgesehen
        };

        const upsertLabel = (host, cls, text, title, opts = {}) => { // Label einsetzen/aktualisieren – idempotent (Observer-sicher)
            const isTotal = !!opts.isTotal;
            const span = host.querySelector(isTotal ? '.cb_ps_total_label' : '.cb_ps_label:not(.cb_ps_total_label)');
            const className = `label ${cls} cb_ps_label${isTotal ? ' cb_ps_total_label' : ''}${opts.extraClass ? ` ${opts.extraClass}` : ''}`;
            const dataKey = opts.dataKey || '';
            if (span && span.className === className && span.getAttribute('data-cb-text') === text && span.getAttribute('title') === title
                && (span.getAttribute('data-cb-special-key') || '') === dataKey) return; // unverändert → nichts anfassen
            let el = span;
            if (!el) {
                host.appendChild(document.createTextNode(' '));
                el = document.createElement('span');
                host.appendChild(el);
            }
            el.className = className;
            el.setAttribute('data-cb-text', text); // Vergleichsbasis (textContent enthält ggf. noch das Stift-Symbol)
            el.textContent = text;
            el.setAttribute('title', title);
            if (dataKey) {
                el.setAttribute('data-cb-special-key', dataKey);
                el.style.cursor = 'pointer';
                const icon = document.createElement('span'); // Stift-Symbol: zeigt an, dass das Label klickbar ist
                icon.className = 'glyphicon glyphicon-pencil';
                Object.assign(icon.style, { fontSize: '9px', top: '1px', marginLeft: '4px' });
                el.appendChild(icon);
            } else {
                el.removeAttribute('data-cb-special-key');
                el.style.cursor = '';
            }
        };

        const cellPs = (cell) => { // PS-Wert einer Zelle lesen – eigene Einfügungen werden vorher entfernt
            if (!cell) return null;
            const clone = cell.cloneNode(true);
            clone.querySelectorAll('.cb_ps_label, .cb_special_ps_value').forEach(el => el.remove());
            return parsePs(clone.textContent);
        };

        // ── Special-Tasks: PS werden per Klick festgelegt und mit den Projekt-Infos
        //    im lokalen Speicher abgelegt (Schlüssel: Gruppe Name + Benutzer + Assistent) ──
        const getStoredProject = () => { try { return JSON.parse(localStorage.getItem(storage_key) || '{}'); } catch (e) { return {}; } };
        const getSpecialPsMap = () => getStoredProject().special_ps || {};
        const saveSpecialPs = (key, ps) => { // ps = Zahl in PS oder null zum Entfernen
            const stored = getStoredProject();
            const map = stored.special_ps || {};
            if (ps === null) delete map[key];
            else map[key] = ps;
            stored.special_ps = map;
            localStorage.setItem(storage_key, JSON.stringify(stored));
        };

        const upsertSpecialValue = (host, psFloat, key) => { // gespeicherte PS als "2.00 PS" in die Betrag-Zelle schreiben (klickbar zum Ändern)
            let el = host.querySelector('.cb_special_ps_value');
            const text = `${psFloat.toFixed(2)} PS`;
            if (el && el.textContent === text && el.getAttribute('data-cb-special-key') === key) return;
            if (!el) {
                el = document.createElement('span');
                el.className = 'cb_special_ps_value';
                el.style.cursor = 'pointer';
                el.title = 'Klicken, um die Special-PS zu ändern';
                host.prepend(el);
            }
            el.textContent = text;
            el.setAttribute('data-cb-special-key', key);
        };
        const removeSpecialValue = (host) => host.querySelector('.cb_special_ps_value')?.remove();

        const collectWorkTimes = () => { // "Aktuelle Arbeitszeit" auslesen: Benutzer+Segment → Minuten (getrennt je Benutzer) sowie Segment → Minuten (Summe, als Fallback) + Gesamt
            const body = findPanelByTitle('Aktuelle Arbeitszeit')?.querySelector('.panel-body');
            if (!body) return null;
            const perSegment = new Map();
            const perUserSegment = new Map();
            let currentUser = ''; // die <strong><u>…</u></strong>-Zeile leitet jeweils den Block eines Benutzers ein
            body.querySelectorAll('strong').forEach(strong => {
                if (strong.closest('mark')) return; // Gesamtzeile überspringen
                const userEl = strong.querySelector('u');
                if (userEl) { currentUser = normUser(userEl.textContent); return; } // ab hier gehören die Zeilen diesem Benutzer
                let node = strong.nextSibling, text = ''; // Text bis zum nächsten <br> einsammeln – dort steht " | 4 Std. 40 Min. ~ 100%"
                while (node && node.nodeName !== 'BR' && node.nodeName !== 'STRONG' && node.nodeName !== 'P') {
                    text += node.textContent || '';
                    node = node.nextSibling;
                }
                const minutes = parseGermanTime(text);
                if (minutes === null) return;
                const name = norm(strong.textContent);
                perSegment.set(name, (perSegment.get(name) || 0) + minutes); // Summe über alle Benutzer (Fallback, falls in der Zeile kein Benutzer erkennbar ist)
                if (currentUser) {
                    const key = `${currentUser}||${name}`;
                    perUserSegment.set(key, (perUserSegment.get(key) || 0) + minutes);
                }
            });
            const totalStrong = Array.from(body.querySelectorAll('mark strong')).find(s => norm(s.textContent).includes('Gesamtearbeitszeit'));
            const totalP = totalStrong ? totalStrong.closest('p') : null;
            let total = null;
            if (totalP) {
                const clone = totalP.cloneNode(true); // unser eigenes Label vor dem Parsen entfernen, sonst lesen wir unsere Zahlen mit
                clone.querySelectorAll('.cb_ps_label').forEach(el => el.remove());
                total = parseGermanTime(clone.textContent);
            }
            return { perSegment, perUserSegment, total, totalP };
        };

        const removePsLabels = () => { // alle erzeugten Labels/PS-Werte wieder von der Seite nehmen
            document.querySelectorAll('.cb_ps_label, .cb_special_ps_value').forEach(el => el.remove());
        };

        const applyPsLabels = () => {
            if (settings.ps_labels === false) return removePsLabels(); // Labels per Setting deaktiviert
            const table = findPanelByTitle('Meilensteine')?.querySelector('table');
            if (!table) return;
            const work = collectWorkTimes();
            if (!work) return; // Arbeitszeit-Übersicht (noch) nicht geladen → beim nächsten Rendern erneut versuchen

            const headers = Array.from(table.querySelectorAll('thead th')).map(th => norm(th.textContent).toLowerCase());
            const idxName = headers.findIndex(h => h.includes('gruppe'));
            const idxStatus = headers.indexOf('status');
            const idxUser = headers.indexOf('benutzer');
            const psIdxs = [headers.indexOf('%'), headers.findIndex(h => h.includes('betrag'))].filter(i => i >= 0); // PS steht mal unter "%", mal unter "Betrag"
            const idxAssist = headers.findIndex(h => h.includes('assistent'));
            const idxBetrag = headers.findIndex(h => h.includes('betrag'));
            const idxPercent = headers.indexOf('%');
            if (idxName < 0 || !psIdxs.length) return;

            // Wohin gehören generierte Labels/PS-Werte? Stehen die vorhandenen PS der Tabelle
            // im %-Feld, folgen die generierten dorthin – ansonsten standardmäßig ins Betrag-Feld.
            let genHostIdx = idxBetrag >= 0 ? idxBetrag : idxPercent;
            if (idxPercent >= 0) {
                for (const row of table.querySelectorAll('tbody > tr')) {
                    if (cellPs(row.cells[idxPercent]) !== null) { genHostIdx = idxPercent; break; }
                }
            }

            const specialMap = getSpecialPsMap();
            let totalPsMin = 0;         // gesamte Projektzeit (inkl. gesetzter Special-PS) – für die Anzeige
            let specialPsMin = 0;       // Special-Anteil daran (darf kein Plus erzeugen)
            let specialExcludedMin = 0; // Arbeitszeit auf Special-Tasks, die neutral bleibt (bis zur PS-Grenze bzw. komplett)
            let anyRow = false;
            table.querySelectorAll('tbody > tr').forEach(row => {
                const cells = row.cells;
                if (!cells || !cells.length) return;
                const name = norm(cells[idxName]?.textContent);
                if (!name) return;

                // Benutzer der Zeile ermitteln (können auch mehrere sein) – so bleiben gleiche Tasks verschiedener Benutzer sauber getrennt
                let userKeys = idxUser >= 0
                    ? Array.from(cells[idxUser]?.querySelectorAll('a.userInfo') || []).map(a => normUser(a.textContent)).filter(Boolean)
                    : [];
                if (!userKeys.length && idxUser >= 0) {
                    const cellUser = normUser(cells[idxUser]?.textContent);
                    if (cellUser) userKeys = [cellUser];
                }
                const workMin = userKeys.length
                    ? userKeys.reduce((sum, user) => sum + (work.perUserSegment.get(`${user}||${name}`) ?? 0), 0) // nur die Zeit DIESER Benutzer an DIESEM Segment
                    : (work.perSegment.get(name) ?? 0); // kein Benutzer erkennbar → wie bisher Summe über alle
                const isOffen = norm(cells[idxStatus]?.textContent).toLowerCase() === 'offen';
                const isSpecial = idxAssist >= 0 && norm(cells[idxAssist]?.textContent).toLowerCase() === 'special';

                let psCell = null, psMin = null;
                for (const i of psIdxs) { // erste Zelle mit PS-Wert gewinnt
                    const value = cellPs(cells[i]);
                    if (value !== null) { psCell = cells[i]; psMin = value; break; }
                }
                anyRow = true;

                if (!isSpecial) {
                    const effPs = psMin ?? 0; // keine PS angegeben = keine Zeit dafür vorgesehen (0 Std. 0 Min.)
                    const host = psCell || cells[genHostIdx] || cells[psIdxs[0]]; // ohne PS-Angabe folgt das Label der Spalten-Konvention der Tabelle
                    if (!host) return;
                    totalPsMin += effPs;
                    upsertLabel(host, psLabelClass(effPs, workMin, isOffen), fmtTime(effPs), fmtDiff(effPs - workMin));
                    return;
                }

                // ── Special-Task: immer neutral (kein Plus); nur das Überziehen gesetzter PS zählt als Minus ──
                const key = `${name.toLowerCase()}||${userKeys.join('+')}||special`; // kanonischer Schlüssel: Gruppe Name + Benutzer + Assistent
                const storedFloat = typeof specialMap[key] === 'number' ? specialMap[key] : null;
                const defaultFloat = SPECIAL_PS_DEFAULTS[name.toLowerCase()] ?? null; // Vorgabe für bekannte Special-Tasks
                const effFloat = storedFloat ?? defaultFloat; // eigene Angabe schlägt die Vorgabe
                const ps = psMin ?? (effFloat !== null ? Math.round(effFloat * 60) : null); // PS von der Seite haben Vorrang
                const host = psCell || cells[genHostIdx] || cells[psIdxs[0]];
                if (!host) return;

                const editing = !!host.querySelector('.cb_special_ps_input'); // Eingabefeld gerade offen? → weiter mitrechnen, aber die Anzeige in Ruhe lassen

                if (ps === null) { // keine PS festgelegt → komplett neutral; per Klick lassen sich PS setzen
                    specialExcludedMin += workMin;
                    if (!editing) {
                        removeSpecialValue(host);
                        upsertLabel(host, 'label-default', 'Special', 'Special-Task – zählt nicht als Plus/Minus. Klicken, um PS festzulegen.', { extraClass: 'cb_ps_special', dataKey: key });
                    }
                    return;
                }

                totalPsMin += ps;
                specialPsMin += ps;
                specialExcludedMin += Math.min(workMin, ps); // Zeit bis zur PS-Grenze bleibt neutral, nur das Überziehen zählt
                if (editing) return; // Anzeige erst nach dem Schließen des Eingabefelds aktualisieren
                if (psMin === null) upsertSpecialValue(host, effFloat, key); // PS-Wert (eigene Angabe bzw. Vorgabe) in der Zelle anzeigen
                else removeSpecialValue(host);
                const effWork = workMin === 0 ? 0 : Math.max(workMin, ps); // unterhalb der Grenze wie "exakt im Rahmen" behandeln (kein Plus)
                const tooltip = `${fmtDiff(Math.min(0, ps - workMin))} | Special: kein Plus möglich${psMin === null ? ' – Klick zum Ändern der PS' : ''}`;
                upsertLabel(host, psLabelClass(ps, effWork, isOffen), fmtTime(ps), tooltip, { extraClass: 'cb_ps_special', dataKey: psMin === null ? key : '' });
            });

            if (anyRow && work.totalP && work.total !== null) { // hinter der Gesamtearbeitszeit: gesamte Projektzeit + Differenz (Special-Anteile neutralisiert)
                const countedWork = Math.max(0, work.total - specialExcludedMin);
                const countedPs = totalPsMin - specialPsMin;
                const diff = countedPs - countedWork;
                upsertLabel(work.totalP, psLabelClass(countedPs, countedWork, false), `${fmtTime(totalPsMin)} (${fmtDiff(diff)})`, fmtDiff(diff), { isTotal: true });
            }
        };

        const startSpecialPsEdit = (target) => { // Special-Markierung in ein Inline-Eingabefeld verwandeln
            const key = target.getAttribute('data-cb-special-key');
            const host = target.closest('td') || target.parentElement;
            if (!key || !host || host.querySelector('.cb_special_ps_input')) return;
            const defaultPs = SPECIAL_PS_DEFAULTS[String(key).split('||')[0]] ?? null; // Vorgabe dieser Task (falls vorhanden)
            const current = getSpecialPsMap()[key] ?? defaultPs;

            host.querySelectorAll('.cb_ps_label, .cb_special_ps_value').forEach(el => { el.style.display = 'none'; }); // Anzeige ausblenden, solange getippt wird

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'cb_special_ps_input';
            input.placeholder = 'PS (z.B. 1.5)';
            input.value = current != null ? String(current) : '';
            input.title = 'PS für diese Special-Task – Enter: speichern, Esc: abbrechen, leer: entfernen';
            Object.assign(input.style, { width: '85px', padding: '1px 5px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '3px' });

            const close = () => {
                if (input.dataset.done) return;
                input.dataset.done = '1';
                input.remove();
                host.querySelectorAll('.cb_ps_label, .cb_special_ps_value').forEach(el => { el.style.display = ''; });
                applyPsLabels(); // Anzeige mit dem aktuellen Stand neu aufbauen
            };
            const commitValue = () => { // true = übernommen/entfernt, false = Eingabe ungültig
                const trimmed = input.value.trim().replace(',', '.');
                if (trimmed === '' || parseFloat(trimmed) === 0) {
                    saveSpecialPs(key, null);
                    showNotification(defaultPs !== null ? `Special-PS auf Vorgabe zurückgesetzt (${defaultPs} PS)` : 'Special-PS entfernt');
                    return true;
                }
                const value = parseFloat(trimmed);
                if (!isFinite(value) || value < 0) {
                    showNotification('Ungültige PS-Angabe', 'danger');
                    return false;
                }
                saveSpecialPs(key, value);
                showNotification(`Special-PS gespeichert: ${value} PS`);
                return true;
            };

            input.addEventListener('keydown', (ev) => {
                ev.stopPropagation();
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    if (commitValue()) close();
                    else input.select(); // ungültig → Eingabe zum Korrigieren behalten
                } else if (ev.key === 'Escape') {
                    ev.preventDefault();
                    close(); // abbrechen ohne zu speichern
                }
            });
            input.addEventListener('blur', () => {
                if (input.dataset.done) return;
                commitValue(); // beim Verlassen übernehmen (ungültige Eingabe wird verworfen)
                close();
            });
            input.addEventListener('click', (ev) => ev.stopPropagation());

            host.appendChild(input);
            input.focus();
            input.select();
        };

        document.addEventListener('click', (e) => { // Linksklick auf eine Special-Markierung: Inline-Eingabefeld für die PS öffnen
            const target = e.target && e.target.closest ? e.target.closest('[data-cb-special-key]') : null;
            if (!target) return;
            e.preventDefault();
            e.stopPropagation();
            startSpecialPsEdit(target);
        });

        refreshPsLabels = applyPsLabels; // damit das Setting "PS-Labels" sofort greift
        applyPsLabels();
        const psObserver = new MutationObserver(() => applyPsLabels()); // beide Panels laden verzögert und werden von der Seite neu gerendert (Status ändern, Zeit buchen, sortieren …)
        psObserver.observe(document.body, { childList: true, subtree: true });
    })();
    // ─────────────────────────────────────────────────────────────────────────

    // ─── Orga-Button & Modal ──────────────────────────────────────────────────
    (function setupOrgaFeature() {
        const ORGA_MODAL_ID = 'manage-project-note-orga';
        const ORGA_BTN_ID = 'manage-project-note-orga-trigger';
        const ORGA_EDIT_BTN_ID = 'manage-project-note-orga-edit';

        // ── Status & Icons (Icons sind über das Zahnrad im Orga-Modal einstellbar) ──
        const ORGA_ICON_DEFAULTS = { open: '📁', progress: '⚙️', done: '✅', canceled: '❌', delayed: '🕒' };
        const ORGA_STATUS_LABELS = { open: 'offen', progress: 'i.B.', done: 'done', canceled: 'abgebrochen', delayed: 'verzögert' };
        const ORGA_STATUS_KEYS = ['open', 'progress', 'done', 'canceled', 'delayed'];

        const getOrgaIcons = () => ({ ...ORGA_ICON_DEFAULTS, ...(settings.orga_icons || {}) }); // fehlende Keys → Standard-Icon

        const getOrgaLineMode = () => (settings.orga_line_mode === 'br2' ? 'br2' : 'br'); // 'br' = ein <br> (Standard), 'br2' = zwei <br> (größerer Abstand)

        const orgaStatusText = (key) => { // "✅ done" bzw. nur "done", wenn kein Icon hinterlegt ist
            const icon = String(getOrgaIcons()[key] ?? '').trim();
            const label = ORGA_STATUS_LABELS[key] || '';
            return icon ? `${icon} ${label}` : label;
        };

        const statusFromText = (str) => { // Status aus dem Notiz-Text lesen – unabhängig vom (eigenen) Icon
            const clean = String(str || '').replace(/\s+/g, ' ').trim();
            if (!clean) return 'open';
            const icons = getOrgaIcons();
            for (const key of ORGA_STATUS_KEYS) { // zuerst über die eingestellten Icons
                const icon = String(icons[key] ?? '').trim();
                if (icon && clean.startsWith(icon)) return key;
            }
            for (const key of ORGA_STATUS_KEYS) { // dann über die Standard-Icons (ältere Notizen)
                if (clean.startsWith(ORGA_ICON_DEFAULTS[key])) return key;
            }
            const word = clean.replace(/^[^\p{L}\d]+/u, '').toLowerCase(); // führende Emojis/Symbole abschneiden
            if (word.startsWith('verzögert') || word.startsWith('verzoegert')) return 'delayed';
            if (word.startsWith('done') || word.startsWith('erledigt') || word.startsWith('fertig')) return 'done';
            if (word.startsWith('i.b') || word.startsWith('in bearbeitung')) return 'progress';
            if (word.startsWith('abgebrochen')) return 'canceled';
            return 'open';
        };

        const escapeHtml = (str) => String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        const DEFAULT_ROWS = [
            { label: 'Layout',     dates: [''], status: 'open', delay: '' },
            { label: 'Erstellung', dates: [''], status: 'open', delay: '' },
            { label: 'Befüllung',  dates: [''], status: 'open', delay: '' },
            { label: 'FS',         dates: [''], status: 'open', delay: '' },
        ];

        const ZT_ROWS = [
            { label: 'ZT-Änderungen', dates: [''], status: 'open', delay: '' },
            { label: 'OS',            dates: [''], status: 'open', delay: '' },
            { label: 'FS',            dates: [''], status: 'open', delay: '' },
        ];

        // ── CSS ────────────────────────────────────────────────────────────
        const orgaStyle = document.createElement('style');
        orgaStyle.textContent = `
            body:has(#${ORGA_MODAL_ID}) { overflow-y: hidden; }
            *:has(>#${ORGA_BTN_ID}):not(:has(#${ORGA_BTN_ID} + #${ORGA_EDIT_BTN_ID})) > #${ORGA_BTN_ID},
            #${ORGA_EDIT_BTN_ID} {
                margin-right: 1.5em;
            }
            #${ORGA_MODAL_ID} .modal-dialog,
            #${ORGA_MODAL_ID} .modal-dialog .modal-content,
            #${ORGA_MODAL_ID} .modal-dialog .modal-content #orga-rows-container{
                width: fit-content;
            }
            #${ORGA_MODAL_ID} .orga-row {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 5px;
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 4px;
                padding: 5px 7px;
                transition: background-color .25s ease, border-color .25s ease;
            }
            #${ORGA_MODAL_ID} .orga-row:hover {
                background-color: #f0f0f0;
                border-color: rgba(0,0,0,0.2);
            }
            #${ORGA_MODAL_ID} .orga-row.dragging { opacity: 0.35; }
            #${ORGA_MODAL_ID} .orga-drag-handle {
                cursor: grab;
                color: #bbb;
                font-size: 15px;
                padding: 0 2px;
                user-select: none;
            }
            #${ORGA_MODAL_ID} .orga-label-input {
                display: inline-block;
                min-width: 95px;
                min-height: 24px;
                font-weight: 500;
                white-space: pre-wrap;
                word-break: break-word;
                border: 1px solid transparent;
                border-radius: 3px;
                padding: 2px 4px;
                background-color: transparent;
                cursor: text;
            }
            #${ORGA_MODAL_ID} .orga-label-input:empty::before {
                content: attr(data-placeholder);
                opacity: .45;
            }
            #${ORGA_MODAL_ID} .orga-label-input:focus,
            #${ORGA_MODAL_ID} .orga-label-input:hover {
                border-color: #337ab7;
                background-color: #fff;
                outline: none;
                cursor: text;
            }
            #${ORGA_MODAL_ID} .orga-date-display {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                color: #555;
                cursor: pointer;
                white-space: nowrap;
                border: 1px solid transparent;
                border-radius: 3px;
                padding: 2px 4px;
            }
            #${ORGA_MODAL_ID} .orga-date-display:hover { border-color: #ccc; background-color: #fff; }
            #${ORGA_MODAL_ID} .orga-date-display .orga-date-cal-icon {
                font-size: 11px;
                opacity: .55;
                pointer-events: none;
            }
            #${ORGA_MODAL_ID} .orga-date-input {
                width: 115px;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 4px;
                font-size: 12px;
            }
            #${ORGA_MODAL_ID} .orga-status-select {
                flex: 1;
                border: 1px solid transparent;
                border-radius: 3px;
                padding: 2px 3px;
                background-color: transparent;
                cursor: pointer;
            }
            #${ORGA_MODAL_ID} .orga-status-select:focus,
            #${ORGA_MODAL_ID} .orga-status-select:hover {
                border-color: #337ab7;
                background-color: #fff;
                outline: none;
            }
            #${ORGA_MODAL_ID} .orga-delay-input {
                field-sizing: content;
                min-width: 55px;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 4px;
                font-size: 12px;
                background-color: transparent;
            }
            #${ORGA_MODAL_ID} .orga-delay-input:hover {
                border-color: #337ab7;
                background-color: #fff;
                outline: none;
            }
            #${ORGA_MODAL_ID} .orga-sep {
                color: #aaa;
                font-weight: bold;
                flex-shrink: 0; }
            #${ORGA_MODAL_ID} .orga-btn-add,
            #${ORGA_MODAL_ID} .orga-btn-rem {
                flex-shrink: 0;
                border: none;
                padding: 1px 7px;
                cursor: pointer;
                font-size: 15px;
                line-height: 1.3;
            }
            #${ORGA_MODAL_ID} [class*="orga-"]:focus {
                border-color: #337ab7 !important;
                background-color: #fff;
                outline: none;
            }
            #${ORGA_MODAL_ID} .orga-drop-indicator {
                height: 3px;;
                background-color: #337ab7;
                border-radius: 2px;
                margin: 2px 0;
                pointer-events: none;
            }
            #${ORGA_MODAL_ID} .orga-dates-container {
                display: inline-flex;
                align-items: center;
                flex-wrap: nowrap;
                gap: 2px;
            }
            #${ORGA_MODAL_ID} .orga-date-slot {
                display: inline-flex;
                align-items: center;
                gap: 2px;
            }
            #${ORGA_MODAL_ID} .orga-date-add-btn,
            #${ORGA_MODAL_ID} .orga-date-rem-btn {
                display: none; /* shown by refreshRemBtns / always for add */
                justify-content: center;
                align-items: center;
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                cursor: pointer;
                font-size: 10px;
                line-height: 1;
                padding: 0;
                border-radius: 3px;
            }
            #${ORGA_MODAL_ID} .orga-date-add-btn {
                display: flex; /* always visible */
            }
            #${ORGA_MODAL_ID} .orga-date-display:hover .orga-date-add-btn,
            #${ORGA_MODAL_ID} .orga-date-display:hover .orga-date-rem-btn {
                display: flex;
            }
            #orga-note-picker .orga-picker-item {
                display: block;
                width: 100%;
                text-align: left;
                border: none;
                border-bottom: 1px solid #e5e5e5;
                border-radius: 0;
                padding: 10px 15px;
            }
            #orga-note-picker .orga-picker-item:hover { background: #f5f5f5; }
            #orga-note-picker .orga-picker-item:last-child { border-bottom: none; }
            .orga-backdrop {
                position: fixed; inset: 0;
                background-color: rgba(0,0,0,.5);
                z-index: 1040;
            }
            #${ORGA_MODAL_ID} {
                z-index: 1050;
            }
            /* ── Darkmode ── */
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-date-input {
                color-scheme: dark;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-date-display {
                color: #ccc;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-date-display:hover {
                border-color: #555;
                background-color: #2e2e2e;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-row:hover {
                background-color: #2e2e2e;
                border-color: rgba(255,255,255,0.15);
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-label-input,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-delay-input {
                color: #eaedf7;
                background-color: transparent;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-label-input:hover,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-label-input:focus,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-delay-input:hover {
                background-color: #2e2e2e;
                border-color: #555;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-status-select {
                color: #eaedf7;
                background-color: transparent;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-status-select:hover,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-status-select:focus {
                background-color: #2e2e2e;
                border-color: #555;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-content {
                background-color: #1b1b1b;
                color: #eaedf7;
                border-color: #444;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-header,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-footer {
                border-color: #444;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-title,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .close {
                color: #eaedf7;
            }
            /* ── Kopfzeile mit Zahnrad ── */
            #${ORGA_MODAL_ID} .modal-header {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #${ORGA_MODAL_ID} .modal-header .modal-title {
                order: 1;
                flex: 1;
            }
            #${ORGA_MODAL_ID} .modal-header .orga-settings-btn {
                order: 3;
                cursor: pointer;
                opacity: .55;
                font-size: 15px;
                transition: opacity .2s ease, transform .35s ease;
            }
            #${ORGA_MODAL_ID} .modal-header .orga-settings-btn:hover { opacity: 1; }
            #${ORGA_MODAL_ID} .modal-header .orga-settings-btn.open { opacity: 1; transform: rotate(90deg); }
            #${ORGA_MODAL_ID} .modal-header .close {
                order: 4;
                float: none;
                margin: 0;
            }
            /* ── Icon-Einstellungen ── */
            #${ORGA_MODAL_ID} .orga-icon-settings {
                display: none;
                margin-bottom: 12px;
                padding: 8px 10px;
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 4px;
                background-color: #fafafa;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings.open { display: block; }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-settings-title {
                font-weight: bold;
                margin-bottom: 6px;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-row label {
                min-width: 110px;
                margin-bottom: 0;
                font-weight: normal;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-input {
                width: 75px;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 4px;
                background-color: #fff;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-line-mode-select {
              height: 26px;
              border: 1px solid #ccc;
              border-radius: 3px;
              padding: 1px 4px;
              background-color: #fff;
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-settings-sub {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px solid rgba(0,0,0,0.08);
            }
            #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-hint {
                font-size: 11px;
                opacity: .6;
                margin: 6px 0;
            }
            /* ── Freie Textzeilen ── */
            #${ORGA_MODAL_ID} .orga-text-row .orga-text-input {
                flex: 1;
                min-width: 280px;
                min-height: 24px;
                border: 1px solid transparent;
                border-radius: 3px;
                padding: 2px 4px;
                background-color: transparent;
                cursor: text;
                white-space: pre-wrap;
                word-break: break-word;
            }
            #${ORGA_MODAL_ID} .orga-text-row .orga-text-input:focus,
            #${ORGA_MODAL_ID} .orga-text-row .orga-text-input:hover {
                border-color: #337ab7;
                background-color: #fff;
                outline: none;
            }
            #${ORGA_MODAL_ID} .orga-text-row .orga-text-input:empty::before {
                content: attr(data-placeholder);
                opacity: .45;
            }
            /* ── Formatier-Leiste in der Kopfzeile ── */
            #${ORGA_MODAL_ID} .modal-header .orga-format-btn {
                order: 2;
                width: 26px;
                height: 24px;
                padding: 0;
                border: 1px solid rgba(0,0,0,0.15);
                border-radius: 3px;
                background-color: transparent;
                color: inherit;
                opacity: .65;
                font-size: 13px;
                line-height: 1;
                cursor: pointer;
                transition: opacity .2s ease, background-color .2s ease;
            }
            #${ORGA_MODAL_ID} .modal-header .orga-format-btn:hover {
                opacity: 1;
                background-color: rgba(0,0,0,0.06);
            }
            #${ORGA_MODAL_ID} .modal-header .orga-format-btn.orga-btn-bold { font-weight: bold; }
            #${ORGA_MODAL_ID} .modal-header .orga-format-btn.orga-btn-italic { font-style: italic; font-family: serif; }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-header .orga-format-btn {
                border-color: #555;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .modal-header .orga-format-btn:hover {
                background-color: #2e2e2e;
            }
            #${ORGA_MODAL_ID} .orga-btn-text {
                flex-shrink: 0;
                border: none;
                padding: 1px 7px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1.5;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-icon-settings {
                background-color: #2e2e2e;
                border-color: #444;
            }
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-icon-settings .orga-icon-input,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-icon-settings .orga-line-mode-select,
            .cb_orga_darkmode #${ORGA_MODAL_ID} .orga-text-row .orga-text-input {
                color: #eaedf7;
                background-color: transparent;
                border-color: #555;
            }
        `;
        document.head.appendChild(orgaStyle);

        // ── Hilfsfunktionen ────────────────────────────────────────────────
        function formatDate(isoValue) {
            if (!isoValue) return new Date().toLocaleDateString("uk-Uk", { year: "numeric", month: "2-digit", day: "2-digit", });
            const [y, m, d] = isoValue.split('-');
            return `${d}.${m}.${y}`;
        }

        function isoFromDisplay(ddmmyyyy) {
            if (!ddmmyyyy || !/^\d{2}\.\d{2}\.\d{4}$/.test(ddmmyyyy.trim())) return '';
            const [d, m, y] = ddmmyyyy.trim().split('.');
            return `${y}-${m}-${d}`;
        }

        function buildRowText(row) { // liefert fertiges HTML für eine Orga-Zeile
            const labelEl = row.querySelector('.orga-label-input');
            const label = sanitizeInlineHtml(labelEl?.innerHTML || '') || 'CUSTOM'; // Formatierung der Bezeichnung bleibt erhalten
            const dates = [...row.querySelectorAll('.orga-dates-container .orga-date-input')]
                               .map(i => formatDate(i.value));
            const sel = row.querySelector('.orga-status-select');
            let status = orgaStatusText(sel.value); // Icon kommt aus den Settings (leer = kein Icon)
            if (sel.value === 'delayed') {
                const delay = escapeHtml((row.querySelector('.orga-delay-input')?.value || '').trim() || 'XY');
                status = `${status} durch ${delay}`.trim();
            }
            return [label, ...dates, status].join(' » ');
        }

        // ── Orga-Notizen parsen & finden ───────────────────────────────────
        function htmlToText(html) { // HTML-Schnipsel → reiner Text
            const div = document.createElement('div');
            div.innerHTML = html;
            return (div.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        }

        function cleanHtml(html) { // vom Browser normalisieren lassen (offene Tags reparieren)
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.innerHTML.trim();
        }

        function fillStatusSelect(select, selectedKey) { // Status-Optionen mit den aktuellen Icons aufbauen
            const current = selectedKey ?? select.value;
            select.innerHTML = '';
            ORGA_STATUS_KEYS.forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = key === 'delayed' ? `${orgaStatusText(key)} durch...` : orgaStatusText(key);
                if (key === current) opt.selected = true;
                select.appendChild(opt);
            });
        }

        function refreshStatusSelects(scope) { // nach einer Icon-Änderung alle Selects neu beschriften
            (scope || document).querySelectorAll('.orga-status-select').forEach(sel => fillStatusSelect(sel, sel.value));
        }

        function parseOrgaLine(line, lineHtml) { // "Label » 01.01.2026 » ✅ done" → Objekt (Label darf HTML enthalten)
            const parts = line.split(' » ').map(s => s.trim());
            if (parts.length < 2) return null;

            const label = parts[0];
            const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
            const dates = [];
            let statusStr = '';

            for (let i = 1; i < parts.length; i++) {
                if (dateRegex.test(parts[i])) {
                    dates.push(isoFromDisplay(parts[i]));
                } else {
                    statusStr = parts.slice(i).join(' » ');
                    break;
                }
            }
            if (!dates.length) dates.push('');

            const status = statusFromText(statusStr);
            let delay = '';
            if (status === 'delayed') {
                const m = statusStr.match(/durch\s+(.+)$/i);
                delay = m ? m[1].trim() : '';
            }

            const labelHtml = lineHtml ? sanitizeInlineHtml(String(lineHtml).split(' » ')[0]) : escapeHtml(label); // Formatierung der Bezeichnung mitnehmen
            return { type: 'orga', label, labelHtml, dates, status, delay };
        }

        // Kompletten Notiz-Inhalt lesen: Orga-Zeilen UND manuell ergänzte Textzeilen
        function parseNoteContent(html) {
            const rawLines = String(html)
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/(div|p|li|h[1-6]|tr)>/gi, '\n')
                .replace(/<(div|p|li|h[1-6]|tr)[^>]*>/gi, '')
                .split('\n');

            const items = [];
            rawLines.forEach(raw => {
                const lineHtml = cleanHtml(raw); // normalisiertes HTML der Zeile (Entities aufgelöst)
                const text = htmlToText(lineHtml);
                if (!text) return; // leere Zeilen überspringen
                if (text.includes(' » ')) {
                    const parsed = parseOrgaLine(text, lineHtml);
                    if (parsed) { items.push(parsed); return; }
                }
                items.push({ type: 'text', text, html: lineHtml }); // frei geschriebener Text
            });
            return items;
        }

        function findOrgaNotes() {
            const results = [];
            document.querySelectorAll('table[id^="datagrid_table_"]').forEach(table => {
                table.querySelectorAll('tbody tr').forEach(tr => {
                    const cells = tr.querySelectorAll('td');
                    if (cells.length < 5) return;
                    if (!cells[3].textContent.trim().includes('Organisation')) return;
                    const contentHtml = cells[4].innerHTML;
                    if (!contentHtml.includes(' » ')) return;

                    const editLink = cells[0].querySelector(
                        'a[id^="manage-note-dialog-project-"]:not([id$="-new"])'
                    );
                    if (!editLink) return;

                    const parsedLines = parseNoteContent(contentHtml); // Orga-Zeilen + freier Text
                    if (!parsedLines.some(item => item.type === 'orga')) return;

                    results.push({
                        noteId: editLink.id,
                        date:   cells[1]?.textContent.trim() || '',
                        user:   cells[2]?.textContent.trim() || '',
                        lines:  parsedLines,
                    });
                });
            });
            return results;
        }

        // ── Rich-Text-Felder (fett/kursiv über die Leiste in der Kopfzeile) ──
        let activeRichField = null; // zuletzt fokussiertes Textfeld – darauf wirkt die Formatier-Leiste

        function createRichField(className, html, placeholder, title) {
            const field = document.createElement('div');
            field.className = className;
            field.contentEditable = 'true';
            field.setAttribute('data-placeholder', placeholder);
            field.title = title;
            field.innerHTML = sanitizeInlineHtml(html || '');

            try { document.execCommand('styleWithCSS', false, false); } catch (_) {} // <b>/<i> statt style-Attributen

            field.addEventListener('keydown', e => { // eine Zeile pro Feld – kein Umbruch
                e.stopPropagation();
                if (e.key === 'Enter') e.preventDefault();
            });
            field.addEventListener('paste', e => { // immer als reinen Text einfügen
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData)?.getData('text/plain') || '';
                document.execCommand('insertText', false, text.replace(/\s+/g, ' '));
            });
            field.addEventListener('focus', () => { activeRichField = field; });

            const row = () => field.closest('.orga-row');
            field.addEventListener('mousedown', () => { const r = row(); if (r) r.draggable = false; }); // sonst blockt Drag&Drop das Markieren
            field.addEventListener('blur', () => { const r = row(); if (r) r.draggable = true; });

            return field;
        }

        function applyRichFormat(cmd) { // wird von der Formatier-Leiste aufgerufen
            if (!activeRichField || !activeRichField.isConnected) return;
            activeRichField.focus();
            document.execCommand(cmd, false, null);
        }

        // ── Drag-and-Drop ──────────────────────────────────────────────────
        let dragSrc = null;

        function getRowAfterY(rows, y) {
            return rows.find(row => {
                const rect = row.getBoundingClientRect();
                return y < rect.top + rect.height / 2;
            }) || null;
        }

        function setupContainerDrag(container) {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                // Alten Indikator entfernen
                container.querySelector('.orga-drop-indicator')?.remove();

                const rows = [...container.querySelectorAll('.orga-row:not(.dragging)')];
                const indicator = document.createElement('div');
                indicator.className = 'orga-drop-indicator';

                const afterRow = getRowAfterY(rows, e.clientY);
                if (afterRow) {
                    container.insertBefore(indicator, afterRow);
                } else {
                    container.appendChild(indicator);
                }
            });

            container.addEventListener('dragleave', e => {
                if (!container.contains(e.relatedTarget)) {
                    container.querySelector('.orga-drop-indicator')?.remove();
                }
            });

            container.addEventListener('drop', e => {
                e.preventDefault();
                const indicator = container.querySelector('.orga-drop-indicator');
                if (indicator && dragSrc) {
                    container.insertBefore(dragSrc, indicator);
                }
                indicator?.remove();
            });
        }

        function setupDrag(row) {
            row.setAttribute('draggable', 'true');
            row.addEventListener('dragstart', e => {
                dragSrc = row;
                row.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            row.addEventListener('dragend', () => {
                dragSrc = null;
                row.classList.remove('dragging');
                row.closest('#orga-rows-container')
                    ?.querySelector('.orga-drop-indicator')?.remove();
            });
        }

        // ── Zeile erstellen ────────────────────────────────────────────────
        function createRow(container, data = {}) {
            const row = document.createElement('div');
            row.className = 'orga-row';

            const label = data.label ?? 'CUSTOM';
            const labelHtml = data.labelHtml || escapeHtml(label); // Bezeichnung darf fett/kursiv enthalten
            // support both old `date: ''` and new `dates: []`
            const dates = data.dates ?? (data.date !== undefined ? [data.date] : ['']);
            const rawStatus = data.status ?? 'open';
            const status = ORGA_STATUS_KEYS.includes(rawStatus) ? rawStatus : statusFromText(rawStatus); // alte Werte mit Icon-Text abfangen
            const delay = data.delay ?? '';
            const isDelay = status === 'delayed';

            // ── Datum-Container mit ein oder mehreren Slots ────────────────
            const datesContainer = document.createElement('span');
            datesContainer.className = 'orga-dates-container';

            function refreshRemBtns() {
                const slots = datesContainer.querySelectorAll('.orga-date-slot');
                slots.forEach(s => {
                    const rb = s.querySelector('.orga-date-rem-btn');
                    if (rb) rb.style.display = slots.length > 1 ? 'inline-block' : 'none';
                });
            }

            function createDateSlot(isoDate, showLeadingSep) {
                const slot = document.createElement('span');
                slot.className = 'orga-date-slot';

                if (showLeadingSep) {
                    const slotSep = document.createElement('span');
                    slotSep.className = 'orga-sep orga-slot-sep';
                    slotSep.textContent = '»';
                    slot.appendChild(slotSep);
                }

                // ── display (flex container) ───────────────────────────────
                const display = document.createElement('span');
                display.className = 'orga-date-display';
                display.title = 'Datum auswählen';

                const dateTextNode = document.createElement('span');
                dateTextNode.className = 'orga-date-text';
                dateTextNode.textContent = formatDate(isoDate);

                const calIcon = document.createElement('i');
                calIcon.className = 'glyphicon glyphicon-calendar orga-date-cal-icon';

                // ── rem-Button (inside display) ────────────────────────────
                const remDateBtn = document.createElement('button');
                remDateBtn.className = 'orga-date-rem-btn btn btn-default';
                remDateBtn.textContent = '−';
                remDateBtn.title = 'Datum entfernen';
                remDateBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    const slots = [...datesContainer.querySelectorAll('.orga-date-slot')];
                    if (slots.length <= 1) return;
                    slot.remove();
                    const remaining = datesContainer.querySelectorAll('.orga-date-slot');
                    remaining.forEach((s, i) => {
                        const sep = s.querySelector('.orga-slot-sep');
                        if (i === 0 && sep) sep.remove();
                        else if (i > 0 && !sep) {
                            const newSep = document.createElement('span');
                            newSep.className = 'orga-sep orga-slot-sep';
                            newSep.textContent = '»';
                            s.prepend(newSep);
                        }
                    });
                    refreshRemBtns();
                });

                // ── add-Button (inside display) ────────────────────────────
                const addDateBtn = document.createElement('button');
                addDateBtn.className = 'orga-date-add-btn btn btn-default';
                addDateBtn.textContent = '+';
                addDateBtn.title = 'Weiteres Datum hinzufügen';
                addDateBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    slot.after(createDateSlot('', true));
                    refreshRemBtns();
                });

                display.append(calIcon, dateTextNode, remDateBtn, addDateBtn);

                // ── date input (hidden, swapped with display on click) ─────
                const input = document.createElement('input');
                input.type = 'date';
                input.className = 'orga-date-input';
                input.value = isoDate;
                input.style.display = 'none';

                function hideInput() {
                    input.style.display = 'none';
                    display.style.display = 'inline-flex';
                }

                display.addEventListener('click', () => {
                    display.style.display = 'none';
                    input.style.display = 'inline-block';
                    requestAnimationFrame(() => {
                        try { input.showPicker(); } catch (_) { input.click(); }
                    });
                    // Außerhalb-Klick-Listener: schließt Input wenn woanders hingeklickt wird
                    function onOutsideClick(e) {
                        if (!input.contains(e.target) && !display.contains(e.target)) {
                            hideInput();
                            document.removeEventListener('mousedown', onOutsideClick, true);
                        }
                    }
                    // Kurze Verzögerung damit der aktuelle Klick nicht direkt triggert
                    setTimeout(() => {
                        document.addEventListener('mousedown', onOutsideClick, true);
                    }, 0);
                });
                input.addEventListener('change', () => {
                    dateTextNode.textContent = formatDate(input.value);
                    hideInput();
                });

                slot.append(display, input);
                return slot;
            }

            dates.forEach((d, i) => datesContainer.appendChild(createDateSlot(d, i > 0)));

            refreshRemBtns(); // initial visibility

            // ── Status-Select ──────────────────────────────────────────────
            const statusSelect = document.createElement('select');
            statusSelect.className = 'orga-status-select';
            fillStatusSelect(statusSelect, status); // Optionen mit den aktuell eingestellten Icons

            // ── Delay-Input ────────────────────────────────────────────────
            const delayInput = document.createElement('input');
            delayInput.type = 'text';
            delayInput.className = 'orga-delay-input';
            delayInput.placeholder = 'XY';
            delayInput.value = delay;
            delayInput.style.display = isDelay ? 'inline-block' : 'none';

            statusSelect.addEventListener('change', () => {
                delayInput.style.display = statusSelect.value === 'delayed' ? 'inline-block' : 'none';
            });

            // ── Zeilen-Buttons ─────────────────────────────────────────────
            const addBtn = document.createElement('button');
            addBtn.className = 'orga-btn-add btn btn-success';
            addBtn.textContent = '+';
            addBtn.title = 'Zeile darunter einfügen';
            addBtn.addEventListener('click', () => row.after(createRow(container)));

            const remBtn = document.createElement('button');
            remBtn.className = 'orga-btn-rem btn btn-danger';
            remBtn.textContent = '−';
            remBtn.title = 'Zeile entfernen';
            remBtn.addEventListener('click', () => row.remove());

            // ── Zusammenbauen ──────────────────────────────────────────────
            const handle = document.createElement('span');
            handle.className = 'orga-drag-handle';
            handle.textContent = '⠿';
            handle.title = 'Verschieben';

            const labelInput = createRichField('orga-label-input', labelHtml, 'Bezeichnung', 'Bezeichnung bearbeiten (Strg+B = fett, Strg+I = kursiv)');

            const sep1 = document.createElement('span');
            sep1.className = 'orga-sep';
            sep1.textContent = '»';

            const sep2 = document.createElement('span');
            sep2.className = 'orga-sep';
            sep2.textContent = '»';

            const addTextBtn = document.createElement('button');
            addTextBtn.className = 'orga-btn-text btn btn-default';
            addTextBtn.textContent = 'T';
            addTextBtn.title = 'Freie Textzeile darunter einfügen';
            addTextBtn.addEventListener('click', () => row.after(createTextRow(container)));

            row.dataset.type = 'orga';
            row.append(handle, labelInput, sep1, datesContainer, sep2, statusSelect, delayInput, addBtn, addTextBtn, remBtn);
            setupDrag(row);
            return row;
        }

        // ── Freie Textzeile (manuell in der Notiz ergänzter Text) ──────────
        const INLINE_TAGS = { B: 'b', STRONG: 'strong', I: 'i', EM: 'em', U: 'u' }; // erlaubte Formatierungen

        function sanitizeInlineHtml(html) { // nur fett/kursiv/unterstrichen behalten, alles andere wird zu reinem Text
            const source = document.createElement('div');
            source.innerHTML = String(html || '');

            const walk = (node) => {
                const frag = document.createDocumentFragment();
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) { frag.appendChild(document.createTextNode(child.nodeValue)); return; }
                    if (child.nodeType !== Node.ELEMENT_NODE) return;
                    if (child.tagName === 'BR') { frag.appendChild(document.createTextNode(' ')); return; }
                    const style = child.getAttribute('style') || '';
                    let tag = INLINE_TAGS[child.tagName];
                    if (!tag && /font-weight:\s*(bold|[6-9]00)/i.test(style)) tag = 'strong'; // execCommand mit CSS-Styles abfangen
                    if (!tag && /font-style:\s*italic/i.test(style)) tag = 'em';
                    const inner = walk(child);
                    if (tag) {
                        const el = document.createElement(tag);
                        el.appendChild(inner);
                        frag.appendChild(el);
                    } else {
                        frag.appendChild(inner);
                    }
                });
                return frag;
            };

            const out = document.createElement('div');
            out.appendChild(walk(source));
            return out.innerHTML.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        }

        function createTextRow(container, data = {}) {
            const row = document.createElement('div');
            row.className = 'orga-row orga-text-row';
            row.dataset.type = 'text';

            const handle = document.createElement('span');
            handle.className = 'orga-drag-handle';
            handle.textContent = '⠿';
            handle.title = 'Verschieben';

            const editable = createRichField('orga-text-input', data.html || escapeHtml(data.text || ''), 'Freier Text …', 'Freie Textzeile bearbeiten (Strg+B = fett, Strg+I = kursiv)');
            handle.addEventListener('mousedown', () => { row.draggable = true; });

            const addBtn = document.createElement('button');
            addBtn.className = 'orga-btn-add btn btn-success';
            addBtn.textContent = '+';
            addBtn.title = 'Orga-Zeile darunter einfügen';
            addBtn.addEventListener('click', () => row.after(createRow(container)));

            const addTextBtn = document.createElement('button');
            addTextBtn.className = 'orga-btn-text btn btn-default';
            addTextBtn.textContent = 'T';
            addTextBtn.title = 'Freie Textzeile darunter einfügen';
            addTextBtn.addEventListener('click', () => row.after(createTextRow(container)));

            const remBtn = document.createElement('button');
            remBtn.className = 'orga-btn-rem btn btn-danger';
            remBtn.textContent = '−';
            remBtn.title = 'Zeile entfernen';
            remBtn.addEventListener('click', () => row.remove());

            row.append(handle, editable, addBtn, addTextBtn, remBtn);
            setupDrag(row);
            return row;
        }

        function createAnyRow(container, data = {}) { // Orga- oder Textzeile, je nach Typ
            return data.type === 'text' ? createTextRow(container, data) : createRow(container, data);
        }

        function buildTextRowHtml(row) { // Formatierungen (fett/kursiv) bleiben erhalten
            const editable = row.querySelector('.orga-text-input');
            if (!editable) return null;
            if (!(editable.textContent || '').trim()) return null; // leere Textzeilen werden verworfen
            return sanitizeInlineHtml(editable.innerHTML);
        }

        // ── Icon-Einstellungen der Projektnotiz (Zahnrad im Orga-Modal) ────
        function buildIconSettings(modal) {
            const panel = modal.querySelector('#orga-icon-settings');
            const gear = modal.querySelector('#orga-settings-btn');
            if (!panel || !gear) return;

            const icons = getOrgaIcons();
            const rowsHtml = ORGA_STATUS_KEYS.map(key => `
                <div class="orga-icon-row">
                    <label for="orga-icon-${key}">${ORGA_STATUS_LABELS[key]}</label>
                    <input type="text" class="orga-icon-input" id="orga-icon-${key}" data-key="${key}" value="${escapeHtml(icons[key] ?? '')}" placeholder="kein Icon" />
                </div>`).join('');

            panel.innerHTML = `
                <div class="orga-icon-settings-title">Icons der Projektnotiz</div>
                ${rowsHtml}
                <div class="orga-icon-hint">Leer lassen = kein Icon. Die Icons werden beim Speichern der Notiz verwendet.</div>
                <button type="button" class="btn btn-default btn-xs" id="orga-icon-reset">Standard-Icons</button>
                <div class="orga-icon-settings-title orga-settings-sub">Zeilenabstände der Notiz</div>
                <div class="orga-icon-row">
                  <label for="orga-line-mode">Zeilenabstand</label>
                  <select class="orga-line-mode-select" id="orga-line-mode">
                    <option value="br">&lt;br&gt; (Standard)</option>
                    <option value="br2">&lt;br&gt;&lt;br&gt; (doppelter Abstand)</option>
                  </select>
                </div>
                <div class="orga-icon-hint">Legt fest, wie die Zeilen beim Speichern in die Notiz geschrieben werden.</div>
            `;

            const saveIcons = () => { // Icons direkt in den Settings (localStorage) ablegen
                const next = {};
                panel.querySelectorAll('.orga-icon-input').forEach(input => {
                    next[input.dataset.key] = input.value.trim();
                });
                saveSettings({ orga_icons: next });
                refreshStatusSelects(modal); // Auswahl-Listen sofort neu beschriften
            };

            panel.querySelectorAll('.orga-icon-input').forEach(input => {
                input.addEventListener('input', saveIcons);
                input.addEventListener('change', saveIcons);
            });

            const lineModeSelect = panel.querySelector('#orga-line-mode'); // Art der Zeilentrennung
            lineModeSelect.value = getOrgaLineMode();
            lineModeSelect.addEventListener('change', () => { // sofort speichern
              saveSettings({ orga_line_mode: lineModeSelect.value === 'br2' ? 'br2' : 'br' });
            });

            panel.querySelector('#orga-icon-reset').addEventListener('click', () => { // zurück zu den Standard-Icons
                saveSettings({ orga_icons: { ...ORGA_ICON_DEFAULTS } });
                panel.querySelectorAll('.orga-icon-input').forEach(input => {
                    input.value = ORGA_ICON_DEFAULTS[input.dataset.key] ?? '';
                });
                refreshStatusSelects(modal);
            });

            gear.addEventListener('click', () => {
                panel.classList.toggle('open');
                gear.classList.toggle('open', panel.classList.contains('open'));
            });
        }

        // ── Generische Modal-Fabrik ────────────────────────────────────────
        function buildOrgaModal({ title, initialRows, onSave }) {
            if (document.getElementById(ORGA_MODAL_ID)) return;

            const backdrop = document.createElement('div');
            backdrop.className = 'orga-backdrop';
            document.body.appendChild(backdrop);

            const modal = document.createElement('div');
            modal.id = ORGA_MODAL_ID;
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.style.cssText = 'display:block; padding-right:17px;';
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">${title}</h4>
                            <button type="button" class="orga-format-btn orga-btn-bold" id="orga-bold-btn" title="Fett (Strg+B)">B</button>
                            <button type="button" class="orga-format-btn orga-btn-italic" id="orga-italic-btn" title="Kursiv (Strg+I)">I</button>
                            <span class="glyphicon glyphicon-cog orga-settings-btn" id="orga-settings-btn" title="Einstellungen der Projektnotiz (Icons)"></span>
                            <button type="button" class="close" id="orga-close-x">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="orga-icon-settings" id="orga-icon-settings"></div>
                            <div id="orga-rows-container"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="orga-save-btn">Speichern</button>
                            <button type="button" class="btn btn-default" id="orga-cancel-btn">Abbrechen</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('in'), 200);

            const rowsContainer = modal.querySelector('#orga-rows-container');
            initialRows.forEach(data => rowsContainer.appendChild(createAnyRow(rowsContainer, data)));
            setupContainerDrag(rowsContainer);

            buildIconSettings(modal); // Zahnrad-Panel mit den Icon-Einstellungen

            [['#orga-bold-btn', 'bold'], ['#orga-italic-btn', 'italic']].forEach(([sel, cmd]) => { // Formatier-Leiste
                const btn = modal.querySelector(sel);
                if (!btn) return;
                btn.addEventListener('mousedown', e => e.preventDefault()); // Auswahl im Textfeld behalten
                btn.addEventListener('click', () => applyRichFormat(cmd));
            });

            function closeModal() {
                modal.classList.remove('in');
                setTimeout(() => { modal.remove(); backdrop.remove(); }, 200);
            }

            modal.querySelector('#orga-close-x').addEventListener('click', closeModal);
            modal.querySelector('#orga-cancel-btn').addEventListener('click', closeModal);
            backdrop.addEventListener('click', closeModal);
            modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

            modal.querySelector('#orga-save-btn').addEventListener('click', () => {
                const lines = [...rowsContainer.querySelectorAll('.orga-row')]
                    .map(r => r.dataset.type === 'text' ? buildTextRowHtml(r) : buildRowText(r)) // beides liefert fertiges HTML
                    .filter(l => l !== null && l !== ''); // leere Zeilen fliegen raus
                closeModal();
                onSave(lines);
            });
        }

        // ── Hilfsfunktion: Text in iframe-Editor einfügen ─────────────────
        function insertIntoNoteEditor(noteModal, lines, verifyType) {
            const verifySelect = noteModal.querySelector('[name="verifyType"]');
            if (verifySelect) {
                verifySelect.value = verifyType;
                verifySelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            setTimeout(() => {
                const editorIframe = noteModal.querySelector('[id*="project-note-editor"]');
                if (!editorIframe) return;
                try {
                    const doc = editorIframe.contentDocument || editorIframe.contentWindow?.document;
                    if (!doc) return;
                    doc.body.focus();
                    doc.execCommand('selectAll', false, null);
                    const htmlLines = Array.isArray(lines) ? lines : String(lines).split('\n'); // Array (Orga- + Textzeilen) oder alter String
                    const html = getOrgaLineMode() === 'br2'
                      ? htmlLines.map(l => `${l}<br><br>`).join('') // zwei <br> je Zeile (größerer Abstand)
                      : htmlLines.map(l => `${l}<br>`).join(''); // Standard: Zeilen per <br> trennen
                    if (!doc.execCommand('insertHTML', false, html)) {
                        doc.body.innerHTML = html;
                        doc.body.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                } catch (err) {
                    console.warn('[Orga] Editor-Insert fehlgeschlagen:', err);
                }
            }, 450);
        }

        // ── Neue Orga-Notiz erstellen ──────────────────────────────────────
        function getProjectTypeFromPage() { // Projekttyp direkt aus dem Info-Panel lesen – funktioniert auch, bevor die Copy-Buttons-Daten erzeugt wurden (Domains-Panel noch zu)
            const typElement = Array.from(document.querySelectorAll(`#${INFO_PANEL_ID} .panel-body p b`))
                .find(el => ['typ', 'typ:'].includes((el.textContent || '').toLowerCase().trim()));
            if (!typElement) return '';
            return (typElement.parentElement.textContent || '').replace(/^\s*Typ\s*:?\s*/i, '').trim();
        }

        function openOrgaModal(newNoteBtn) {
            const storedData = JSON.parse(localStorage.getItem(storage_key) || '{}');
            const projectType = getProjectTypeFromPage() || (storedData.project_type || '').trim(); // zuerst live von der Seite, sonst aus den lokalen Daten
            const rows = projectType.toLowerCase() === 'medienberater zweittermin' ? ZT_ROWS : DEFAULT_ROWS;

            buildOrgaModal({
                title: 'Projektnotiz: Organisation',
                initialRows: rows,
                onSave: lines => {
                    newNoteBtn.click();
                    const noteModal = document.querySelector('#manage-project-note');
                    if (!noteModal) return;
                    const obs = new MutationObserver((_, o) => {
                        if (!noteModal.classList.contains('in')) return;
                        o.disconnect();
                        insertIntoNoteEditor(noteModal, lines, 'organisation');
                    });
                    obs.observe(noteModal, { attributes: true, attributeFilter: ['class'] });
                    setTimeout(() => obs.disconnect(), 10000);
                },
            });
        }

        // ── Bestehende Orga-Notiz bearbeiten ──────────────────────────────
        function openOrgaEditModal(noteData) {
            buildOrgaModal({
                title: 'Orga-Notiz bearbeiten',
                initialRows: noteData.lines,
                onSave: lines => {
                    const editBtn = document.getElementById(noteData.noteId);
                    if (!editBtn) return;
                    editBtn.click();
                    const noteModal = document.querySelector('#manage-project-note');
                    if (!noteModal) return;
                    const obs = new MutationObserver((_, o) => {
                        if (!noteModal.classList.contains('in')) return;
                        o.disconnect();
                        insertIntoNoteEditor(noteModal, lines, 'organisation');
                    });
                    obs.observe(noteModal, { attributes: true, attributeFilter: ['class'] });
                    setTimeout(() => obs.disconnect(), 10000);
                },
            });
        }

        // ── Notiz-Auswahl (bei mehreren Orga-Notizen) ─────────────────────
        function openOrgaNotePicker(notes) {
            const PICKER_ID = 'orga-note-picker';
            if (document.getElementById(PICKER_ID)) return;

            const backdrop = document.createElement('div');
            backdrop.className = 'orga-backdrop';
            document.body.appendChild(backdrop);

            const picker = document.createElement('div');
            picker.id = PICKER_ID;
            picker.className = 'modal fade';
            picker.tabIndex = -1;
            picker.style.cssText = 'display:block; padding-right:17px;';
            picker.innerHTML = `
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" id="orga-picker-close">×</button>
                            <h4 class="modal-title">Orga-Notiz wählen</h4>
                        </div>
                        <div class="modal-body" id="orga-picker-list" style="padding:0;"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(picker);
            setTimeout(() => picker.classList.add('in'), 200);

            function closePicker() {
                picker.classList.remove('in');
                setTimeout(() => { picker.remove(); backdrop.remove(); }, 200);
            }
            picker.querySelector('#orga-picker-close').addEventListener('click', closePicker);
            backdrop.addEventListener('click', closePicker);
            picker.addEventListener('click', e => { if (e.target === picker) closePicker(); });

            const list = picker.querySelector('#orga-picker-list');
            notes.forEach(note => {
                const btn = document.createElement('button');
                btn.className = 'orga-picker-item';
                btn.innerHTML = `<strong>${note.date}</strong> <span style="color:#888;font-size:12px;">${note.user}</span>`;
                btn.addEventListener('click', () => {
                    closePicker();
                    setTimeout(() => openOrgaEditModal(note), 300);
                });
                list.appendChild(btn);
            });
        }

        // ── Buttons in die Seite injizieren ───────────────────────────────
        function injectOrgaButton() {
            if (document.getElementById(ORGA_BTN_ID)) {
                // Edit-Button ggf. nachrüsten
                if (!document.getElementById(ORGA_EDIT_BTN_ID) && findOrgaNotes().length) {
                    const triggerBtn = document.getElementById(ORGA_BTN_ID);
                    appendEditBtn(triggerBtn);
                }
                return;
            }

            const newNoteBtn = document.querySelector('#manage-note-dialog-project-new');
            if (!newNoteBtn) return;

            const targetContainer = newNoteBtn.closest('.col-sm-6') || newNoteBtn.parentElement;
            if (!targetContainer) return;

            const orgaBtn = document.createElement('a');
            orgaBtn.id = ORGA_BTN_ID;
            orgaBtn.className = 'btn btn-default';
            orgaBtn.textContent = 'Orga';
            orgaBtn.href = '#';
            orgaBtn.addEventListener('click', e => {
                e.preventDefault();
                openOrgaModal(newNoteBtn);
            });
            const calIcon = document.createElement('i');
            calIcon.className = 'glyphicon glyphicon-plus';
            orgaBtn.prepend(calIcon);
            targetContainer.prepend(orgaBtn);

            // Edit-Button direkt danach hinzufügen, falls Orga-Notizen vorhanden
            if (findOrgaNotes().length) appendEditBtn(orgaBtn);
        }

        function appendEditBtn(afterEl) {
            if (document.getElementById(ORGA_EDIT_BTN_ID)) return;
            const editBtn = document.createElement('a');
            editBtn.id = ORGA_EDIT_BTN_ID;
            editBtn.className = 'btn btn-info glyphicon glyphicon-pencil';
            editBtn.href = '#';
            editBtn.title = 'Orga-Notiz bearbeiten';
            editBtn.style.marginLeft = '4px';
            editBtn.addEventListener('click', e => {
                e.preventDefault();
                const notes = findOrgaNotes();
                if (!notes.length) return;
                notes.length === 1 ? openOrgaEditModal(notes[0]) : openOrgaNotePicker(notes);
            });
            afterEl.after(editBtn);
        }

        // Sofort versuchen + bei DOM-Änderungen erneut prüfen
        injectOrgaButton();
        const orgaObserver = new MutationObserver(injectOrgaButton);
        orgaObserver.observe(document.body, { childList: true, subtree: true });
    })();
    // ─────────────────────────────────────────────────────────────────────────


    // ─────────────────────────────────────────────────────────────────────────
    // ─── Wochenstunden & Abwesenheiten ───────────────────────────────────────
    // Zeigt auf "/dailyresults" Soll/Ist/Rest-Stunden der aktuellen Woche,
    // einen Mini-Kalender und die Abwesenheiten aus absence.io.
    // Urlaub / Sonderurlaub / Krank / Schule ... zählen als voller Arbeitstag
    // (settings.absence_day_hours), "Office" / "Mobile Office" nicht (da wird
    // ja normal gestempelt). Auf app.absence.io läuft NUR cbAbsenceSync().

    // ── Helfer (function-declarations, damit sie überall im Script nutzbar sind) ──
    function cbWhPad(n) { // 7 -> '07'
        return (n < 10 ? '0' : '') + n;
    }

    function cbWhIso(date) { // Date -> 'YYYY-MM-DD'
        return date.getFullYear() + '-' + cbWhPad(date.getMonth() + 1) + '-' + cbWhPad(date.getDate());
    }

    function cbWhFromIso(iso) { // 'YYYY-MM-DD' -> Date (12 Uhr, damit Sommerzeit nichts verschiebt)
        const p = String(iso).slice(0, 10).split('-');
        return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 12, 0, 0);
    }

    function cbWhAddDays(date, days) {
        const copy = new Date(date.getTime());
        copy.setDate(copy.getDate() + days);
        return copy;
    }

    function cbWhWeekInfo(date) { // Montag, Sonntag und Kalenderwoche (ISO-8601)
        const base = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
        const monday = cbWhAddDays(base, -((base.getDay() + 6) % 7));
        const thursday = cbWhAddDays(monday, 3); // die Woche gehört zum Jahr des Donnerstags
        const firstThursday = new Date(thursday.getFullYear(), 0, 4, 12, 0, 0);
        const firstMonday = cbWhAddDays(firstThursday, -((firstThursday.getDay() + 6) % 7));
        const kw = Math.round((thursday - firstMonday) / 604800000) + 1;
        return {
            monday: monday,
            sunday: cbWhAddDays(monday, 6),
            kw: kw,
            year: thursday.getFullYear(),
            key: thursday.getFullYear() + '-KW' + cbWhPad(kw)
        };
    }

    function cbWhFmt(minutes) { // Minuten -> '8:00' / '-1:30'
        const abs = Math.abs(Math.round(minutes || 0));
        return (minutes < 0 ? '-' : '') + Math.floor(abs / 60) + ':' + cbWhPad(abs % 60);
    }

    function cbWhFmtDec(hours) { // 1.5 -> '1,5'
        return (Math.round(hours * 100) / 100).toString().replace('.', ',');
    }

    function cbWhGmSet(key, value) { // domainübergreifender Speicher (Tampermonkey), sonst localStorage
        try {
            if (typeof GM_setValue === 'function') { GM_setValue(key, value); return true; }
        } catch (e) {}
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
        return false;
    }

    function cbWhGmGet(key, fallback) {
        try {
            if (typeof GM_getValue === 'function') {
                const value = GM_getValue(key);
                if (value !== undefined && value !== null) return value;
            }
        } catch (e) {}
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return fallback;
    }

    function cbWhHasGm() { // ohne GM_* klappt der Datenaustausch IPSI <-> absence.io nicht
        try { return typeof GM_setValue === 'function' && typeof GM_getValue === 'function'; } catch (e) { return false; }
    }

    function cbWhToast(text, ok) { // kleine Einblendung oben rechts
        try {
            const box = document.createElement('div');
            box.className = 'cb_wh_toast';
            box.textContent = 'ʕ·͡ᴥ·ʔ ' + text;
            box.style.cssText = 'position:fixed;z-index:2147483647;top:18px;right:18px;max-width:340px;'
                + 'padding:10px 14px;border-radius:6px;font:13px/1.45 Arial,sans-serif;color:#fff;'
                + 'box-shadow:0 6px 18px rgba(0,0,0,.28);background:' + (ok === false ? '#c0392b' : '#27865a') + ';';
            document.body.appendChild(box);
            setTimeout(() => { box.style.transition = 'opacity .4s'; box.style.opacity = '0'; }, 3200);
            setTimeout(() => box.remove(), 3700);
        } catch (e) {}
    }


    // ── absence.io: Abwesenheiten des angemeldeten Nutzers holen und ablegen ──
    // Laeuft nur auf app.absence.io (dort ist der Login-Token als Cookie da).
    // Die Rohdaten landen per GM_setValue in "cb_absence_data", damit die
    // IPSI-Seite sie lesen kann. Gerechnet wird erst auf der IPSI-Seite.
    async function cbAbsenceSync(options) {
        const opt = options || {};
        const CACHE_KEY = 'cb_absence_data';
        const isSyncTab = (window.name === 'cb_absence_sync'); // vom Panel geöffneter Sync-Tab
        if (window.top !== window.self) return null; // nicht in iframes

        const cached = cbWhGmGet(CACHE_KEY, null);
        if (!isSyncTab && !opt.force && cached && cached.ts && (Date.now() - cached.ts) < 20 * 60 * 1000) {
            return cached; // frisch genug -> absence.io nicht unnötig belasten
        }

        const cookie = (name) => {
            const parts = ('; ' + document.cookie).split('; ' + name + '=');
            return parts.length === 2 ? decodeURIComponent(parts.pop().split(';')[0]) : '';
        };
        const token = cookie('absencetoken');
        if (!token) { // nicht (mehr) eingeloggt
            console.log('ʕ·͡ᴥ·ʔ absence.io: kein Login gefunden, kein Sync');
            if (isSyncTab) cbWhToast('absence.io: bitte einloggen, dann nochmal synchronisieren', false);
            return null;
        }
        const headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'x-vacationtoken': token,
            'x-csrf-token': cookie('__Host-csrf_token') || cookie('csrf_token'),
            'x-languagetoken': (localStorage.getItem('lang') || 'de').replace(/["']/g, '')
        };
        const api = async (path, body) => {
            const res = await fetch('https://app.absence.io/api/' + path, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(path + ' -> HTTP ' + res.status);
            return res.json();
        };

        try {
            let me = null; // eigene Mail steht im localStorage von absence.io
            try { me = JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) {}
            const userRes = await api('v2/users', { skip: 0, limit: 5, filter: me && me.email ? { email: me.email } : {} });
            const user = (userRes.data || [])[0];
            if (!user || !user._id) throw new Error('eigener Benutzer nicht gefunden');

            const today = new Date();
            // Genau der Zeitraum, den das Panel blättern kann (navLimits): 1. Januar des
            // laufenden Jahres bis 30. Juni des Folgejahres, mit etwas Luft an beiden Enden.
            // Vorher waren es today-180 bis today+240 Tage – damit fehlten Abwesenheiten aus
            // Januar bis Anfang März, sobald das Jahr weit genug fortgeschritten war,
            // obwohl man dorthin blättern kann.
            const from = cbWhIso(new Date(today.getFullYear(), 0, 1, 12, 0, 0));
            const to = cbWhIso(new Date(today.getFullYear() + 1, 6, 7, 12, 0, 0));

            const absRes = await api('v2/absences', {
                skip: 0,
                limit: 1000,
                filter: { assignedToId: user._id, start: { '$lte': to }, end: { '$gte': from } },
                sortBy: { startDateTime: 1, endDateTime: 1, _id: 1 },
                responseModel: 'Calendar',
                options: { includeDeletedReasons: true }
            });

            const days = {};
            (absRes.data || []).forEach(entry => {
                const reason = entry.reason || {};
                const startIso = String(entry.start || entry.startDateTime || '').slice(0, 10);
                if (!startIso) return;
                const start = cbWhFromIso(startIso);
                const endIso = String(entry.end || entry.endDateTime || '').slice(0, 10);
                let last = endIso ? cbWhAddDays(cbWhFromIso(endIso), -1) : new Date(start.getTime()); // "end" ist exklusiv
                if (last < start) last = new Date(start.getTime());

                let workdays = 0; // für halbe Tage / Zeiträume mit Wochenende
                for (let d = new Date(start.getTime()); d <= last; d = cbWhAddDays(d, 1)) {
                    if (d.getDay() !== 0 && d.getDay() !== 6) workdays++;
                }
                const count = typeof entry.daysCount === 'number' ? entry.daysCount : workdays;
                let ratio = workdays > 0 ? count / workdays : 1;
                if (!isFinite(ratio) || ratio <= 0) ratio = 1;
                if (ratio > 1) ratio = 1;

                let hours = null; // stundenweise Abwesenheiten
                if (entry.isHourly && entry.startDateTime && entry.endDateTime) {
                    const diff = (new Date(entry.endDateTime) - new Date(entry.startDateTime)) / 3600000;
                    if (isFinite(diff) && diff > 0) hours = Math.round(diff * 100) / 100;
                }

                for (let d = new Date(start.getTime()); d <= last; d = cbWhAddDays(d, 1)) {
                    const key = cbWhIso(d);
                    if (!days[key]) days[key] = [];
                    days[key].push({
                        reason: reason.name || 'Abwesenheit',
                        status: entry.status, // 2 = genehmigt, 0 = offene Anfrage
                        ratio: Math.round(ratio * 100) / 100,
                        hours: hours,
                        hourly: !!entry.isHourly,
                        color: (reason.color && reason.color.colorValue) || null
                    });
                }
            });

            const holidays = {}; // Feiertage des eigenen Standorts
            try {
                const ids = user.holidayIds || [];
                if (ids.length) {
                    const holRes = await api('v2/holidays', { skip: 0, limit: 500, filter: { _id: { '$in': ids } } });
                    (holRes.data || []).forEach(holiday => {
                        (holiday.dates || []).forEach(date => {
                            const key = String(date).slice(0, 10);
                            if (key >= from && key <= to) holidays[key] = holiday.name || 'Feiertag';
                        });
                    });
                }
            } catch (e) { console.log('ʕ·͡ᴥ·ʔ Feiertage konnten nicht geladen werden:', e); }

            const payload = {
                ts: Date.now(),
                from: from,
                to: to,
                user: { id: user._id, name: user.name || '', email: user.email || '' },
                days: days,
                holidays: holidays
            };
            cbWhGmSet(CACHE_KEY, payload);
            console.log('ʕ·͡ᴥ·ʔ absence.io synchronisiert:', Object.keys(days).length, 'Abwesenheitstage,', Object.keys(holidays).length, 'Feiertage');
            if (isSyncTab) {
                cbWhToast('Abwesenheiten synchronisiert (' + Object.keys(days).length + ' Tage) - Tab schließt sich', true);
                setTimeout(() => { try { window.close(); } catch (e) {} }, 1400);
            }
            return payload;
        } catch (err) {
            console.log('ʕ·͡ᴥ·ʔ Abwesenheits-Sync fehlgeschlagen:', err);
            if (isSyncTab) cbWhToast('Sync fehlgeschlagen: ' + (err && err.message ? err.message : err), false);
            return null;
        }
    }


    // ── /dailyresults: Panel mit Wochenstunden, Mini-Kalender & Korrekturen ──
    (function setupWeekHours() {
        if (!/\/dailyresults/.test(location.pathname) || window.top !== window.self) return;
        if (settings.week_panel === false) return;

        const PANEL_ID = 'cb_wh_panel';
        const TRACKED_KEY = 'cb_wh_tracked';    // { 'YYYY-MM-DD': Minuten } aus der Tabelle
        const MANUAL_KEY = 'cb_wh_manual';      // { '2026-KW32': [ { h: 1.5, note: '...' } ] }
        const TYPE_KEY = 'cb_wh_daytypes';      // { 'YYYY-MM-DD': 'urlaub' } manuelle Tages-Typen
        const ABSENCE_KEY = 'cb_absence_data';  // von cbAbsenceSync() gefuellt
        const CARRY_KEY = 'cb_wh_carry';        // { week: '2026-KW36', items: [ { from: '2026-KW35', h: 1.5 } ] }
        const PLAN_KEY = 'cb_wh_plan';          // { 'YYYY-MM-DD': Minuten } vorausgesehene (feste) Arbeitszeit
        const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const MAX_DAY_MIN = 600; // ArbZG: mehr als 10 Std. am Tag sind nicht zulässig

        const DAY_TYPES = [ // manuelle Tages-Typen (Klick auf einen Tag im Mini-Kalender)
            { id: 'auto', label: 'automatisch (absence.io)', short: '', color: '' },
            { id: 'urlaub', label: 'Urlaub', short: 'Urlaub', color: '#3ba55d' },
            { id: 'sonderurlaub', label: 'Sonderurlaub', short: 'Sonder', color: '#3f9c9c' },
            { id: 'krank', label: 'Krank', short: 'Krank', color: '#d9534f' },
            { id: 'schule', label: 'Schule / Weiterbildung', short: 'Schule', color: '#dda033' },
            { id: 'feiertag', label: 'Feiertag', short: 'Feiertag', color: '#8a7bd8' },
            { id: 'arbeit', label: 'normaler Arbeitstag (Abwesenheit ignorieren)', short: '', color: '#2A5298' }
        ];

        const numOr = (value, fallback) => {
            const n = parseFloat(String(value).replace(',', '.'));
            return isFinite(n) && n > 0 ? n : fallback;
        };
        const typeById = (id) => DAY_TYPES.filter(type => type.id === id)[0] || DAY_TYPES[0];
        const esc = (text) => String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        // settings werden erst kurz nach dem Seitenstart aus dem localStorage gemerged
        // -> deshalb bei jedem Rendern frisch lesen
        const cfg = () => ({
            weekHours: numOr(settings.week_hours, 39),
            dayHours: numOr(settings.absence_day_hours, 7.8),
            workReasons: settings.absence_work_reasons || ['Office', 'Mobile Office'],
            countHolidays: settings.absence_count_holidays !== false,
            includePending: settings.absence_include_pending !== false,
            mode: settings.absence_hours_mode || 'max',
            untilHours: numOr(settings.week_until_hours, 4) // Schwelle für die Feierabend-Uhrzeit
        });

        const lsGet = (key, fallback) => {
            try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
        };
        const lsSet = (key, value) => {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
        };

        // ── Tabelle auslesen und die Ist-Zeiten dauerhaft merken ──
        // (dadurch bleiben die Zeiten auch erhalten, wenn gefiltert oder
        //  auf eine andere Seite der Tabelle geblaettert wird)
        const readTable = () => {
            const rows = document.querySelectorAll('table[id^="datagrid_table_"] tbody tr');
            if (!rows.length) return false;
            const seen = {};
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 8) return;
                const date = (cells[2].textContent || '').trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
                if (!date) return;
                const iso = date[3] + '-' + date[2] + '-' + date[1];
                const time = (cells[7].textContent || '').trim().match(/^(-?\d{1,3}):(\d{2})$/);
                const minutes = time ? (parseInt(time[1], 10) * 60 + parseInt(time[2], 10)) : 0;
                seen[iso] = (seen[iso] || 0) + minutes; // mehrere Zeilen an einem Tag zusammenrechnen
            });
            if (!Object.keys(seen).length) return false;
            const store = lsGet(TRACKED_KEY, {});
            Object.keys(seen).forEach(iso => { store[iso] = seen[iso]; });
            const limit = cbWhIso(navLimits().start); // alles vor dem 1. Januar des laufenden Jahres aufräumen
            Object.keys(store).forEach(iso => { if (iso < limit) delete store[iso]; });
            lsSet(TRACKED_KEY, store);
            return true;
        };


        // ── Wochen-/Monats-Berechnung ──
        const NL = String.fromCharCode(10); // Zeilenumbruch für die Tooltips
        const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

        // Anzeige-Modi (Zahnrad im Panel-Kopf)
        const VIEW_OPTIONS = [
            { id: 'week', label: 'Wochen-Übersicht', short: 'Woche' },
            { id: 'month', label: 'Monats-Übersicht', short: 'Monat' }
        ];
        const SCOPE_OPTIONS = [
            { id: 'week', label: 'nur Woche', short: 'Woche' },
            { id: 'month', label: 'nur Monat', short: 'Monat' },
            { id: 'both', label: 'beide (Woche groß, Monat klein)', short: 'beide' }
        ];
        // ── Tastatur-Steuerung ──
        const KEY_ACTIONS = [
            { id: 'nav_prev', label: 'eine Woche / einen Monat zurück', def: 'ArrowLeft' },
            { id: 'nav_next', label: 'eine Woche / einen Monat vor', def: 'ArrowRight' },
            { id: 'nav_today', label: 'zurück zu heute', def: 't' },
            { id: 'view_toggle', label: 'zwischen Wochen- und Monats-Ansicht wechseln', def: 'm' },
            { id: 'cal_toggle', label: 'Mini-Kalender ein-/ausklappen', def: 'Enter' }
        ];
        let keyCapture = null; // id der Aktion, die gerade auf eine neue Taste wartet

        const keyMap = () => { // gespeicherte Belegung, fehlende Einträge kommen vom Default
            const saved = (settings.keys && typeof settings.keys === 'object') ? settings.keys : {};
            const map = {};
            KEY_ACTIONS.forEach(action => {
                map[action.id] = Object.prototype.hasOwnProperty.call(saved, action.id) ? saved[action.id] : action.def;
            });
            return map;
        };
        const sameKey = (a, b) => !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();

        const KEY_NAMES = { // Anzeige-Text für Tasten ohne eigenes Zeichen
            ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', ' ': 'Space',
            Escape: 'Esc', Tab: 'Tab', Backspace: '⌫', Delete: 'Del',
            Home: 'Home', End: 'End', PageUp: 'PgUp', PageDown: 'PgDn'
        };
        const keyLabel = (key) => {
            if (!key) return '–';
            if (KEY_NAMES[key]) return KEY_NAMES[key];
            return key.length === 1 ? key.toUpperCase() : key;
        };
        // Enter bekommt die typische ISO-Form (Umbruch-Taste) statt einer Beschriftung
        const ENTER_SVG = '<svg viewBox="0 0 22 18" width="22" height="18">'
            + '<path d="M5.5 1.5H20.5V16.5H1.5V8.5H5.5Z" fill="#fbfcfd" stroke="#c3c9d2" stroke-width="1.2" stroke-linejoin="round"/>'
            + '<path d="M15 5.6V10.3H9.3M11.7 7.9L9.1 10.3L11.7 12.7" fill="none" stroke="#555" stroke-width="1.2"'
            +     ' stroke-linecap="round" stroke-linejoin="round"/></svg>';

        const keyCapHtml = (id) => { // eine Taste als Keycap
            const action = KEY_ACTIONS.filter(entry => entry.id === id)[0];
            if (!action) return '';
            const key = keyMap()[id];
            return '<a class="cb_wh_key' + (key === 'Enter' ? ' cb_wh_keyenter' : '') + (key ? '' : ' cb_wh_keyoff') + '"'
                + ' data-key="' + id + '" title="' + esc(action.label + ' – klicken, dann neue Taste drücken') + '">'
                + (key === 'Enter' ? ENTER_SVG : esc(keyLabel(key))) + '</a>';
        };
        const repaintKeyCaps = () => { // Keycaps im offenen Popup neu beschriften
            const box = document.querySelector('.cb_wh_cfgbox');
            if (!box) return;
            const map = keyMap();
            box.querySelectorAll('a[data-key]').forEach(link => {
                const id = link.getAttribute('data-key');
                const key = map[id];
                const catching = keyCapture === id;
                link.classList.toggle('cb_wh_keycatch', catching);
                link.classList.toggle('cb_wh_keyenter', !catching && key === 'Enter');
                link.classList.toggle('cb_wh_keyoff', !catching && !key);
                link.innerHTML = catching ? '…' : (key === 'Enter' ? ENTER_SVG : esc(keyLabel(key)));
            });
        };

        // ── Mini-Kalender ein-/ausklappen ──
        const CALOPEN_KEY = 'cb_wh_calopen';
        const CAL_START_OPTIONS = [
            { id: 'closed', label: 'eingeklappt starten', short: 'ja' },
            { id: 'open', label: 'ausgeklappt starten', short: 'nein' }
        ];
        const CAL_MEMORY_OPTIONS = [
            { id: 'on', label: 'Umklappen merken', short: 'merken' },
            { id: 'off', label: 'Umklappen nicht merken', short: 'nicht' }
        ];
        // nur in der Monats-Ansicht sinnvoll: was der eingeklappte Kalender übrig laesst
        const CAL_FOLD_OPTIONS = [
            { id: 'week', label: 'eingeklappt nur die aktuelle Woche zeigen', short: 'Woche' },
            { id: 'none', label: 'eingeklappt gar keinen Kalender zeigen', short: 'nichts' }
        ];
        const calFoldWeek = () => settings.cal_collapsed_mode === 'week';
        const calRemember = () => settings.cal_remember !== 'off';
        // Achtung: die settings kommen erst kurz nach dem Seitenstart aus dem localStorage.
        // Deshalb wird die Vorgabe bei jedem Aufruf frisch gelesen und NICHT gecacht –
        // gecacht wird nur, was der Nutzer in dieser Sitzung selbst umgeschaltet hat.
        let calOpen = null; // null = noch nichts umgeschaltet
        const calIsOpen = () => {
            if (calOpen !== null) return calOpen;
            if (calRemember()) {
                const stored = lsGet(CALOPEN_KEY, null);
                if (stored !== null) return !!stored;
            }
            return settings.cal_collapsed !== 'closed';
        };
        const toggleCal = () => {
            calOpen = !calIsOpen();
            if (calRemember()) lsSet(CALOPEN_KEY, calOpen);
        };
        const resetCalOpen = (dropStored) => { // nach einer Einstellungs-Änderung neu bestimmen
            if (dropStored) { try { localStorage.removeItem(CALOPEN_KEY); } catch (e) {} }
            calOpen = null;
        };

        const viewMode = () => settings.week_view === 'month' ? 'month' : 'week';
        const scopeMode = () => (settings.week_hours_scope === 'month' || settings.week_hours_scope === 'both')
            ? settings.week_hours_scope : 'week';

        // ── Blättern durch Wochen / Monate ──
        // Erlaubter Zeitraum: 1. Januar des laufenden Jahres bis 30. Juni des Folgejahres
        const navLimits = () => {
            const now = new Date();
            return {
                start: new Date(now.getFullYear(), 0, 1, 12, 0, 0),
                end: new Date(now.getFullYear() + 1, 5, 30, 12, 0, 0)
            };
        };

        let navDate = null; // null = heute, sonst ein Tag aus der angezeigten Woche / dem angezeigten Monat
        const refDate = () => navDate || new Date();

        const clampNav = (date) => {
            const lim = navLimits();
            if (date < lim.start) return new Date(lim.start.getTime());
            if (date > lim.end) return new Date(lim.end.getTime());
            return date;
        };

        const stepDate = (step) => { // eine Woche bzw. einen Monat weiter
            const ref = refDate();
            if (viewMode() !== 'month') return cbWhAddDays(ref, step * 7);
            // Tag im Monat beibehalten, sonst landet "vor" nach "zurück" auf dem 1.
            // und die Wochen-Anzeige zeigt plötzlich eine andere Woche als vorher
            const target = new Date(ref.getFullYear(), ref.getMonth() + step, 1, 12, 0, 0);
            const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
            target.setDate(Math.min(ref.getDate(), lastDay));
            return target;
        };

        const canShift = (step) => { // liegt der Nachbar-Zeitraum noch im erlaubten Bereich?
            const lim = navLimits(), next = stepDate(step);
            if (viewMode() === 'month') {
                const firstOfNext = new Date(next.getFullYear(), next.getMonth(), 1, 12, 0, 0);
                return firstOfNext >= new Date(lim.start.getFullYear(), lim.start.getMonth(), 1, 12, 0, 0)
                    && firstOfNext <= new Date(lim.end.getFullYear(), lim.end.getMonth(), 1, 12, 0, 0);
            }
            const week = cbWhWeekInfo(next);
            return cbWhAddDays(week.monday, 6) >= lim.start && week.monday <= lim.end;
        };

        const shiftNav = (step) => {
            navDate = clampNav(stepDate(step));
            if (isCurrentPeriod()) navDate = null; // wieder im aktuellen Zeitraum -> zurück auf heute
        };

        const isCurrentPeriod = () => {
            if (!navDate) return true;
            const now = new Date();
            if (viewMode() === 'month') return navDate.getMonth() === now.getMonth() && navDate.getFullYear() === now.getFullYear();
            return cbWhIso(cbWhWeekInfo(navDate).monday) === cbWhIso(cbWhWeekInfo(now).monday);
        };

        const monthInfo = (date) => { // erster/letzter Tag, Arbeitstage und Label des Monats
            const first = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
            const dayCount = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            let workdays = 0;
            for (let i = 0; i < dayCount; i++) {
                const dow = cbWhAddDays(first, i).getDay();
                if (dow !== 0 && dow !== 6) workdays++;
            }
            return {
                first: first, last: cbWhAddDays(first, dayCount - 1), dayCount: dayCount,
                workdays: workdays, month: first.getMonth(), year: first.getFullYear(),
                label: MONTH_NAMES[first.getMonth()] + ' ' + first.getFullYear(),
                key: first.getFullYear() + '-' + cbWhPad(first.getMonth() + 1)
            };
        };

        const mondayOfWeekKey = (key) => { // '2026-KW32' -> Montag dieser Woche (ISO-8601)
            const parts = String(key || '').split('-KW');
            if (parts.length !== 2) return null;
            const year = parseInt(parts[0], 10), kw = parseInt(parts[1], 10);
            if (!isFinite(year) || !isFinite(kw)) return null;
            const firstThursday = new Date(year, 0, 4, 12, 0, 0);
            const firstMonday = cbWhAddDays(firstThursday, -((firstThursday.getDay() + 6) % 7));
            return cbWhAddDays(firstMonday, (kw - 1) * 7);
        };

        const stores = () => ({ // alle Speicher einmal einlesen und weiterreichen
            tracked: lsGet(TRACKED_KEY, {}),
            overrides: lsGet(TYPE_KEY, {}),
            manualAll: lsGet(MANUAL_KEY, {}),
            plans: lsGet(PLAN_KEY, {}),
            absence: cbWhGmGet(ABSENCE_KEY, null),
            todayIso: cbWhIso(new Date())
        });

        // ── Drag-Auswahl im Mini-Kalender (linke Maustaste halten und ziehen) ──
        let dragFrom = null;   // ISO des Tages, auf dem die Maustaste gedrueckt wurde
        let dragTo = null;     // ISO des Tages, auf dem die Maus zuletzt war
        let dragging = false;  // Maustaste ist gerade unten
        let dragMoved = false; // es wurde ueber mindestens einen weiteren Tag gezogen
        let dragBound = false; // document-Listener nur einmal haengen
        let dragSkipClick = false; // Klick nach einem Drag nicht als Einzelklick werten
        let dragAdd = false;   // Strg beim Start -> zur bestehenden Auswahl dazu
        let pickSet = [];      // fertige Auswahl (Drag-Bereich und/oder per Strg gesammelte Tage)

        // Waehrend des Umschaltens liegt eine Kopie des alten Kalenders im Panel (Geist).
        // Deren Zellen duerfen bei Auswahl und Events nicht mitzaehlen.
        const dayCells = (panel) => Array.prototype.slice.call(panel.querySelectorAll('.cb_wh_day'))
            .filter(cell => !cell.closest('.cb_wh_calghost'));

        const clearPick = () => { // Auswahl aufheben
            dragFrom = null;
            dragTo = null;
            pickSet = [];
            const panel = document.getElementById(PANEL_ID);
            if (!panel) return;
            panel.querySelectorAll('.cb_wh_day.cb_wh_pick').forEach(cell => cell.classList.remove('cb_wh_pick'));
            panel.querySelectorAll('.cb_wh_cal').forEach(cal => cal.classList.remove('cb_wh_drag'));
        };

        const togglePick = (iso) => { // einzelnen Tag zur Auswahl dazu / raus
            const at = pickSet.indexOf(iso);
            if (at < 0) pickSet.push(iso); else pickSet.splice(at, 1);
            pickSet.sort(); // ISO-Datum sortiert sich von allein chronologisch
        };

        const pickRange = () => { // ISO-Grenzen der Auswahl (egal in welche Richtung gezogen wurde)
            if (!dragFrom || !dragTo) return null;
            return dragFrom <= dragTo ? { lo: dragFrom, hi: dragTo } : { lo: dragTo, hi: dragFrom };
        };

        const pickedIsos = () => { // alle sichtbaren Tage innerhalb der Auswahl, in Kalender-Reihenfolge
            const panel = document.getElementById(PANEL_ID);
            const range = pickRange();
            if (!panel || !range) return [];
            return dayCells(panel)
                .map(cell => cell.getAttribute('data-iso'))
                .filter(iso => iso && iso >= range.lo && iso <= range.hi);
        };

        const paintPick = () => { // Auswahl im Kalender markieren (fertige + gerade gezogene)
            const panel = document.getElementById(PANEL_ID);
            const range = dragging ? pickRange() : null;
            if (!panel) return;
            dayCells(panel).forEach(cell => {
                const iso = cell.getAttribute('data-iso');
                const inDrag = range && iso >= range.lo && iso <= range.hi;
                if (inDrag || pickSet.indexOf(iso) > -1) cell.classList.add('cb_wh_pick');
                else cell.classList.remove('cb_wh_pick');
            });
        };

        // ── vorausgesehene (feste) Arbeitszeit pro Tag ──
        const planOf = (iso) => { // gesetzte Minuten oder 0
            const value = lsGet(PLAN_KEY, {})[iso];
            return typeof value === 'number' && value > 0 ? value : 0;
        };
        const setPlan = (isos, minutes) => { // fuer alle uebergebenen Tage setzen (0 entfernt sie)
            const store = lsGet(PLAN_KEY, {});
            isos.forEach(iso => {
                if (!minutes || minutes <= 0) delete store[iso];
                else store[iso] = Math.round(minutes);
            });
            const limit = cbWhIso(navLimits().start);
            Object.keys(store).forEach(key => { if (key < limit) delete store[key]; });
            lsSet(PLAN_KEY, store);
        };
        const clockIn = (minutes) => { // jetzt + Minuten -> 'HH:MM'
            const time = new Date(Date.now() + Math.round(minutes) * 60000);
            return cbWhPad(time.getHours()) + ':' + cbWhPad(time.getMinutes());
        };

        // Feierabend-Hinweis: die offenen Minuten aendern sich nicht, nur die Uhrzeit
        // laeuft weiter -> Text merken und die Uhrzeit per Timer nachziehen
        let untilState = null; // { prefix: '', suffix: ' Uhr', min: 185, title: '...' }
        const untilText = (state) => (state.prefix || '') + clockIn(state.min) + (state.suffix || '');
        const paintUntil = () => {
            const panel = document.getElementById(PANEL_ID);
            const box = panel ? panel.querySelector('.cb_wh_rest b small') : null;
            if (!box || !untilState) return;
            box.textContent = untilText(untilState);
        };

        // Eingabezeile fuer die feste Arbeitszeit (im Tages- und im Mehrtage-Menü)
        const planRowHtml = (minutes, count) => '<b>Feste Arbeitszeit' + (count > 1 ? ' · ' + count + ' Tage' : '') + '</b>'
            + '<div class="cb_wh_planrow">'
            +     '<input type="text" class="form-control cb_wh_plan" value="' + esc(minutes ? cbWhFmt(minutes) : '') + '" placeholder="z.B. 8:00">'
            +     '<em>Std. pro Tag</em>'
            +     '<button type="button" class="btn btn-default cb_wh_planok" title="übernehmen">OK</button>'
            + '</div>'
            + (minutes ? '<a class="cb_wh_planoff"><i style="background:transparent"></i>feste Arbeitszeit entfernen</a>' : '');

        const bindPlanRow = (menu, isos, done) => {
            const input = menu.querySelector('.cb_wh_plan');
            if (!input) return;
            const apply = () => {
                const hours = parseHours(input.value);
                if (input.value.trim() && (hours === null || hours <= 0)) {
                    cbWhToast('Bitte eine Arbeitszeit angeben, z.B. 8 oder 7:48', false);
                    return;
                }
                setPlan(isos, hours ? hours * 60 : 0);
                done();
            };
            menu.querySelector('.cb_wh_planok').addEventListener('click', apply);
            input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); apply(); } });
            const off = menu.querySelector('.cb_wh_planoff');
            if (off) off.addEventListener('click', () => { setPlan(isos, 0); done(); });
        };

        const closeMenus = () => { // Tages-Menü und Einstellungs-Popup schließen
            document.querySelectorAll('.cb_wh_menu').forEach(old => old.remove());
            document.querySelectorAll('#' + PANEL_ID + ' .cb_wh_cfg').forEach(cog => cog.classList.remove('cb_wh_open'));
            keyCapture = null; // Popup zu -> keine Tasten-Aufnahme mehr offen
            clearPick();
        };

        // Anteil eines Tages als kurzer Vorsatz für die Beschriftung
        const shareLabel = (share) => {
            if (share >= 0.97) return '';
            if (Math.abs(share - 0.5) < 0.06) return '½ ';
            if (Math.abs(share - 0.25) < 0.06) return '¼ ';
            if (Math.abs(share - 0.75) < 0.06) return '¾ ';
            return Math.round(share * 100) + '% ';
        };

        // ── ein einzelner Tag: gestempelte Zeit + angerechnete Abwesenheiten ──
        const calcDay = (date, c, st) => {
            const dow = date.getDay();
            const iso = cbWhIso(date);
            const isWeekend = (dow === 0 || dow === 6);
            const dayMin = Math.round(c.dayHours * 60);
            const day = {
                iso: iso, date: date, label: DAY_LABELS[(dow + 6) % 7], dayNum: date.getDate(),
                isWeekend: isWeekend, isToday: iso === st.todayIso, isFuture: iso > st.todayIso,
                trackedMin: typeof st.tracked[iso] === 'number' ? st.tracked[iso] : null,
                override: st.overrides[iso] || '', creditMin: 0, chips: [], notes: [],
                planMin: (st.plans && typeof st.plans[iso] === 'number' && st.plans[iso] > 0) ? st.plans[iso] : 0,
                overLong: false, absShare: 0, partial: false,
                homeoffice: false, pending: false, color: ''
            };
            if (day.planMin) day.notes.push('feste Arbeitszeit: ' + cbWhFmt(day.planMin));
            const override = day.override && day.override !== 'auto' ? typeById(day.override) : null;

            if (override && override.id !== 'arbeit') { // manuell gesetzter Abwesenheitstag
                day.creditMin = isWeekend ? 0 : dayMin;
                day.absShare = isWeekend ? 0 : 1; // manuell gesetzte Typen gelten für den ganzen Tag
                day.chips.push(override.short || override.label);
                day.color = override.color;
                day.notes.push(override.label + ' (manuell gesetzt)');
            } else if (!override) { // aus absence.io
                const entries = (st.absence && st.absence.days && st.absence.days[iso]) || [];
                entries.forEach(entry => {
                    const reason = String(entry.reason || '');
                    const isWorkReason = c.workReasons.some(name => String(name).toLowerCase() === reason.toLowerCase());
                    if (isWorkReason) { // Office / Mobile Office -> es wird normal gestempelt
                        day.homeoffice = true;
                        day.notes.push(reason + ' (Zeiterfassung läuft normal)');
                        return;
                    }
                    if (entry.status !== 2 && !(entry.status === 0 && c.includePending)) {
                        day.notes.push(reason + ' (nicht genehmigt, nicht gezählt)');
                        return;
                    }
                    const hours = entry.hourly && entry.hours ? entry.hours : c.dayHours * (entry.ratio || 1);
                    // Anteil am Arbeitstag: 0,5 bei einem halben Tag, bei stundenweisen
                    // Abwesenheiten aus der Länge gerechnet
                    const share = c.dayHours > 0 ? Math.min(1, hours / c.dayHours) : 1;
                    if (!isWeekend) {
                        day.creditMin += Math.round(hours * 60);
                        day.absShare += share;
                    }
                    day.chips.push(shareLabel(share) + reason);
                    day.color = day.color || entry.color || '#3ba55d';
                    if (entry.status === 0) { day.pending = true; day.notes.push(reason + ' (offene Anfrage)'); }
                    else day.notes.push(reason);
                });
                const holiday = st.absence && st.absence.holidays ? st.absence.holidays[iso] : null;
                if (holiday && c.countHolidays && !isWeekend && day.creditMin < dayMin) {
                    day.creditMin = dayMin;
                    day.absShare = 1;
                    day.chips.push('Feiertag');
                    day.color = day.color || '#8a7bd8';
                    day.notes.push('Feiertag: ' + holiday);
                }
            } else { // 'arbeit' -> Abwesenheiten bewusst ignorieren
                day.notes.push('als normaler Arbeitstag gesetzt');
            }
            if (day.creditMin > dayMin) day.creditMin = dayMin;

            // Teil-Abwesenheit (halber Tag, stundenweise): der Rest des Tages wurde ja
            // gearbeitet -> gestempelte und angerechnete Zeit gehören zusammen. Der
            // Einstellungs-Modus regelt nur noch die ganztägigen Abwesenheiten.
            day.partial = day.absShare > 0.02 && day.absShare < 0.97;

            const trackedMin = day.trackedMin || 0;
            if (day.partial) day.totalMin = trackedMin + day.creditMin;
            else if (c.mode === 'sum') day.totalMin = trackedMin + day.creditMin;
            else if (c.mode === 'credit') day.totalMin = day.creditMin > 0 ? day.creditMin : trackedMin;
            else day.totalMin = Math.max(trackedMin, day.creditMin); // 'max' (Standard)
            if (day.totalMin > MAX_DAY_MIN) { // 10-Stunden-Grenze
                day.overLong = true;
                day.notes.push('über 10 Std. – nach ArbZG nicht zulässig');
            }
            return day;
        };

        // ── beliebiger Zeitraum (Woche = 7 Tage, Monat = 28-31 Tage) ──
        const calcRange = (startDate, dayCount, c, st, longLabels) => {
            const days = [], noData = [];
            let sum = 0;
            for (let i = 0; i < dayCount; i++) {
                const day = calcDay(cbWhAddDays(startDate, i), c, st);
                sum += day.totalMin;
                if (!day.isWeekend && !day.isFuture && day.trackedMin === null && day.creditMin === 0) {
                    noData.push(longLabels ? day.dayNum + '.' + cbWhPad(day.date.getMonth() + 1) + '.' : day.label);
                }
                days.push(day);
            }
            return { days: days, sum: sum, noData: noData };
        };

        // noch offene Arbeitstage (ab heute), an denen nichts angerechnet ist
        const openWorkdays = (days, st, dayMin) => days.filter(day =>
            !day.isWeekend && day.iso >= st.todayIso && day.creditMin < dayMin / 2).length;

        const calcWeek = (ref, withCarry) => {
            const c = cfg(), st = stores();
            const week = cbWhWeekInfo(ref || new Date());
            const dayMin = Math.round(c.dayHours * 60);
            const range = calcRange(week.monday, 7, c, st, false);
            const manual = (st.manualAll[week.key] || []).map((item, index) => ({ item: item, key: week.key, index: index }));
            const manualOwnMin = manual.reduce((total, entry) => total + Math.round((Number(entry.item.h) || 0) * 60), 0);
            // Uebertrag aus abgelaufenen Wochen (liegt immer in der aktuellen Woche)
            const carryState = withCarry === false ? { week: '', items: [] } : carryLoad();
            const carryList = (carryState.week && carryState.week === week.key)
                ? carryState.items.map((item, index) => ({ item: item, key: week.key, index: index, carry: true }))
                : [];
            const carryMin = carryList.reduce((total, entry) => total + Math.round((Number(entry.item.h) || 0) * 60), 0);
            const manualAll = carryList.concat(manual);
            const manualMin = manualOwnMin + carryMin;
            const targetMin = Math.round(c.weekHours * 60);
            const doneMin = range.sum + manualMin;
            return {
                scope: 'week', week: week, month: null, days: range.days,
                manual: manualAll, manualMin: manualMin, carryMin: carryMin,
                targetMin: targetMin, doneMin: doneMin, restMin: targetMin - doneMin,
                openDays: openWorkdays(range.days, st, dayMin), noData: range.noData,
                dayMin: dayMin, cfg: c, absence: st.absence,
                label: 'KW ' + week.kw + ' · ' + cbWhIso(week.monday).split('-').reverse().slice(0, 2).join('.')
                    + '–' + cbWhIso(cbWhAddDays(week.monday, 4)).split('-').reverse().slice(0, 2).join('.')
            };
        };

        const calcMonth = (ref) => {
            const c = cfg(), st = stores();
            const info = monthInfo(ref || new Date());
            const dayMin = Math.round(c.dayHours * 60);
            const range = calcRange(info.first, info.dayCount, c, st, true);
            // manuelle Korrekturen haengen an der Kalenderwoche -> eine Woche zaehlt zu dem
            // Monat, in dem ihr Mittwoch liegt (so wird keine Woche doppelt gezaehlt)
            const manual = [];
            let manualMin = 0;
            Object.keys(st.manualAll).sort().forEach(key => {
                const monday = mondayOfWeekKey(key);
                if (!monday) return;
                const wednesday = cbWhAddDays(monday, 2);
                if (wednesday.getMonth() !== info.month || wednesday.getFullYear() !== info.year) return;
                (st.manualAll[key] || []).forEach((item, index) => {
                    manual.push({ item: item, key: key, index: index });
                    manualMin += Math.round((Number(item.h) || 0) * 60);
                });
            });
            const targetMin = Math.round(info.workdays * (c.weekHours / 5) * 60);
            const doneMin = range.sum + manualMin;
            return {
                scope: 'month', week: null, month: info, days: range.days,
                manual: manual, manualMin: manualMin,
                targetMin: targetMin, doneMin: doneMin, restMin: targetMin - doneMin,
                openDays: openWorkdays(range.days, st, dayMin), noData: range.noData,
                dayMin: dayMin, cfg: c, absence: st.absence,
                label: info.label + ' · ' + info.workdays + ' Arbeitstage'
            };
        };

        // ── Übertrag: Plus-/Minusstunden aus abgelaufenen Wochen ──
        // Beim Start einer neuen Woche wird der Saldo (Ist - Soll) jeder abgelaufenen
        // Woche als eigener Eintrag in die aktuelle Woche uebernommen. Alles liegt im
        // localStorage unter CARRY_KEY und kann in der Liste einzeln per X geloescht werden.
        const CARRY_MAX = 26; // mehr als ein halbes Jahr Übertraege braucht niemand

        const carryLoad = () => {
            const state = lsGet(CARRY_KEY, null);
            if (!state || typeof state !== 'object' || !Array.isArray(state.items)) return { week: '', items: [] };
            return { week: String(state.week || ''), items: state.items };
        };
        const carrySave = (state) => lsSet(CARRY_KEY, state);

        const carryLabel = (key) => { // '2026-KW35' -> 'Übertrag KW 35'
            const kw = parseInt(String(key || '').split('-KW')[1], 10);
            return 'Übertrag' + (isFinite(kw) ? ' KW ' + kw : '');
        };
        const carryWhen = (key) => { // Monat + Jahr, in dem die Stunden entstanden sind
            const monday = mondayOfWeekKey(key);
            if (!monday) return '';
            const thursday = cbWhAddDays(monday, 3); // die Woche gehoert zum Monat des Donnerstags
            return MONTH_NAMES[thursday.getMonth()] + ' ' + thursday.getFullYear();
        };

        // Saldo einer Woche ohne die Übertraege (sonst wuerde doppelt gezaehlt)
        const weekBalanceMin = (monday) => {
            const data = calcWeek(monday, false);
            const hasData = data.days.some(day => day.trackedMin !== null || day.creditMin > 0) || data.manual.length > 0;
            if (!hasData) return null; // Woche komplett ohne Daten -> kein Minus erfinden
            return data.doneMin - data.targetMin;
        };

        const syncCarry = () => {
            const cur = cbWhWeekInfo(new Date());
            const state = carryLoad();
            let changed = false;
            const push = (info) => {
                const min = weekBalanceMin(info.monday);
                if (min === null || min === 0) return;
                state.items.push({ from: info.key, h: Math.round(min / 60 * 100) / 100, ts: Date.now() });
                changed = true;
            };
            if (!state.week) { // erster Lauf nach dem Update: die letzte Woche wird noch mitgenommen
                push(cbWhWeekInfo(cbWhAddDays(cur.monday, -7)));
                state.week = cur.key;
                changed = true;
            } else if (state.week !== cur.key) { // neue Woche -> alle Wochen seither nachtragen
                let monday = mondayOfWeekKey(state.week) || cbWhAddDays(cur.monday, -7);
                for (let i = 0; i < 60 && monday < cur.monday; i++) {
                    push(cbWhWeekInfo(monday));
                    monday = cbWhAddDays(monday, 7);
                }
                state.week = cur.key;
                changed = true;
            }
            if (state.items.length > CARRY_MAX) { state.items = state.items.slice(-CARRY_MAX); changed = true; }
            if (changed) carrySave(state);
            return state;
        };


        // ── Styles ──
        const CSS = ''
            + '#cb_wh_panel{margin-bottom:18px;}'
            + '#cb_wh_panel .panel-title{display:flex;align-items:center;gap:6px;}'
            + '#cb_wh_panel .panel-title small{font-weight:400;color:#888;}'
            // Einklapp-Pfeil: Bootstrap-Caret wie beim .dropdown-toggle, im eingeklappten
            // Zustand um 90° nach links gedreht (zeigt dann nach rechts)
            + '#cb_wh_panel .cb_wh_kw{cursor:pointer;}'
            + '#cb_wh_panel .cb_wh_kw .caret{display:inline-block;margin-left:3px;border-width:.38em .38em 0;'
            +     'transition:transform .15s;}'
            + '#cb_wh_panel .cb_wh_kw .caret.cb_wh_shut{transform:rotate(-90deg);}'
            + '#cb_wh_panel .cb_wh_actions{margin-left:auto;display:flex;align-items:center;gap:8px;}'
            + '#cb_wh_panel .cb_wh_actions a{color:#777;text-decoration:none;font-size:13px;cursor:pointer;}'
            + '#cb_wh_panel .cb_wh_actions a:hover,#cb_wh_panel .cb_wh_actions a.cb_wh_open{color:#2A5298;}'
            + '#cb_wh_panel .cb_wh_sync.cb_wh_spin{animation:cb_wh_rot 1s linear infinite;}'
            + '@keyframes cb_wh_rot{to{transform:rotate(360deg);}}'
            + '#cb_wh_panel .panel-body{padding:12px 14px;}'
            + '#cb_wh_panel .cb_wh_rest{text-align:center;line-height:1.1;margin-bottom:8px;}'
            + '#cb_wh_panel .cb_wh_rest b{display:block;font-size:30px;font-weight:700;color:#2A5298;}'
            + '#cb_wh_panel .cb_wh_rest.cb_wh_done b{color:#3ba55d;}'
            + '#cb_wh_panel .cb_wh_rest b small{display:block;font-size:11px;font-weight:400;color:#9aa0a8;letter-spacing:0;margin:0;}'
            + '#cb_wh_panel .cb_wh_rest span{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.04em;}'
            + '#cb_wh_panel .cb_wh_rest .cb_wh_sub{display:block;font-style:normal;font-size:11px;color:#8a919c;margin-top:4px;text-transform:none;letter-spacing:0;}'
            + '#cb_wh_panel .cb_wh_rest .cb_wh_sub.cb_wh_done{color:#3ba55d;}'
            + '#cb_wh_panel .cb_wh_rest .cb_wh_sub span{font-size:inherit;color:inherit;text-transform:none;letter-spacing:0;}'
            + '#cb_wh_panel .cb_wh_bar{position:relative;height:10px;border-radius:5px;background:#e6e8ec;overflow:hidden;margin:8px 0 6px;}'
            // Monatsleiste liegt als Halbton-Raster (Ben-Day dots) ueber der Wochenleiste.
            // Zwei identische Punkt-Ebenen, die zweite um eine halbe Kachel nach rechts und
            // unten versetzt -> die Punkte stehen versetzt zueinander.
            // Beide Abschnitte sind voll breit und werden nur per clip-path beschnitten,
            // damit das Raster ueber die Farbgrenze hinweg luechenlos durchlaeuft.
            + '#cb_wh_panel .cb_wh_bar u{position:absolute;left:0;top:0;bottom:0;width:100%;'
            +     'text-decoration:none;transition:clip-path .3s ease;'
            +     'background-image:radial-gradient(circle,#fff 0.9px,transparent 1.5px),'
            +         'radial-gradient(circle,#fff 0.9px,transparent 1.5px);'
            +     'background-size:6px 6px,6px 6px;background-position:1px 2px,4px 5px;}'
            // der Teil, der ueber die Wochenleiste hinausragt: Punkte in deren Farbe
            + '#cb_wh_panel .cb_wh_bar u.cb_wh_bare{'
            +     'background-image:radial-gradient(circle,#2A5298 0.9px,transparent 1.5px),'
            +         'radial-gradient(circle,#2A5298 0.9px,transparent 1.5px);}'
            + '#cb_wh_panel .cb_wh_bar u.cb_wh_bare.cb_wh_over{'
            +     'background-image:radial-gradient(circle,#3ba55d 0.9px,transparent 1.5px),'
            +         'radial-gradient(circle,#3ba55d 0.9px,transparent 1.5px);}'
            + '#cb_wh_panel .cb_wh_bar i{display:block;height:100%;background:#2A5298;transition:width .3s;}'
            + '#cb_wh_panel .cb_wh_bar.cb_wh_over i{background:#3ba55d;}'
            + '#cb_wh_panel .cb_wh_bar.cb_wh_mini{height:4px;margin:0 0 6px;background:#eef0f3;}'
            + '#cb_wh_panel .cb_wh_bar.cb_wh_mini i{background:#93a7c9;}'
            + '#cb_wh_panel .cb_wh_bar.cb_wh_mini.cb_wh_over i{background:#84c9a1;}'
            + '#cb_wh_panel .cb_wh_kpis{display:flex;justify-content:space-between;font-size:11px;color:#777;margin-bottom:10px;}'
            + '#cb_wh_panel .cb_wh_kpis b{display:block;font-size:13px;color:#333;}'
            + '#cb_wh_panel .cb_wh_kpis span{white-space:nowrap;}'
            // Die Scrollleiste der Seite darf beim Hoehenwechsel nicht auftauchen und
            // verschwinden – sonst wird die ganze Bootstrap-Spalte schmaler und das
            // Panel zappelt in der Breite. Der Platz wird deshalb dauerhaft reserviert.
            + 'html{scrollbar-gutter:stable;}'
            // Der Kalender-Bereich steckt in einem Wrapper. Beim Wechsel Monat <-> Woche
            // wandern die Tage, die es in beiden Ansichten gibt, von ihrer alten an ihre
            // neue Position (FLIP, siehe animateCal). Der Rest des alten Kalenders liegt
            // als "Geist" darueber und blendet aus, neue Teile blenden ein.
            + '#cb_wh_panel .cb_wh_calwrap{position:relative;overflow:hidden;'
            +     'transition:height .34s cubic-bezier(.4,0,.2,1);}'
            + '#cb_wh_panel .cb_wh_calghost{position:absolute;left:0;right:0;top:0;pointer-events:none;'
            +     'opacity:0;transition:opacity .3s ease;}'
            + '#cb_wh_panel .cb_wh_calwrap.cb_wh_swap .cb_wh_calghost{opacity:1;}'
            + '#cb_wh_panel .cb_wh_calwrap.cb_wh_swap .cb_wh_fadein{opacity:0;}'
            + '#cb_wh_panel .cb_wh_fadein{transition:opacity .3s ease;}'
            + '#cb_wh_panel .cb_wh_cal{display:flex;gap:3px;margin:0 0 10px;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_dowhead{font-size:9px;text-transform:uppercase;color:#aaa;text-align:center;line-height:1.5;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_day{padding:2px 1px 3px;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_num{font-size:10px;color:#999;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_val{font-size:11px;margin-top:1px;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_chip{font-size:8px;}'
            + '#cb_wh_panel .cb_wh_day{flex:1 1 0;min-width:0;border:1px solid #dfe2e7;border-radius:4px;padding:3px 1px 4px;text-align:center;cursor:pointer;background:#fff;position:relative;}'
            + '#cb_wh_panel .cb_wh_day:hover{border-color:#2A5298;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_we{background:#f5f6f8;color:#aaa;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_today{border-color:#2A5298;box-shadow:0 0 0 1px #2A5298 inset;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_future{opacity:.65;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_drag{user-select:none;-webkit-user-select:none;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick{border-color:#2A5298;background:#d9e4f5;box-shadow:0 0 0 2px rgba(42,82,152,.45);}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick .cb_wh_val{color:#1d3c73;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick .cb_wh_dow,#cb_wh_panel .cb_wh_day.cb_wh_pick .cb_wh_num{color:#4a6fa5;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick.cb_wh_abs{box-shadow:0 0 0 2px #1d3c73;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick.cb_wh_abs .cb_wh_val{color:#fff;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_pick.cb_wh_future{opacity:1;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_over10{border-color:#c0392b;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_over10 .cb_wh_val{color:#c0392b;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs.cb_wh_over10{box-shadow:0 0 0 1px #c0392b inset;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs.cb_wh_over10 .cb_wh_val{color:#ffe0dc;}'
            + '#cb_wh_panel .cb_wh_dow{display:block;font-size:10px;text-transform:uppercase;color:#999;}'
            + '#cb_wh_panel .cb_wh_num{display:block;font-size:11px;color:#bbb;line-height:1;}'
            + '#cb_wh_panel .cb_wh_val{display:block;font-size:12px;font-weight:700;color:#333;margin-top:2px;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs .cb_wh_val{color:#fff;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs{color:#fff;border-color:transparent;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs .cb_wh_dow,#cb_wh_panel .cb_wh_day.cb_wh_abs .cb_wh_num{color:rgba(255,255,255,.85);}'
            // Teil-Abwesenheit: durchgezogene Linie am unteren Rand
            + '#cb_wh_panel .cb_wh_day.cb_wh_part{background-repeat:no-repeat;background-position:0 100%;'
            +     'background-size:100% 4px;}'
            + '#cb_wh_panel .cb_wh_cal.cb_wh_grid .cb_wh_day.cb_wh_part{background-size:100% 3px;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_part .cb_wh_chip{color:#7b828b;}'
            + '#cb_wh_panel .cb_wh_chip{display:block;font-size:9px;line-height:1.2;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
            + '#cb_wh_panel .cb_wh_ho{position:absolute;top:1px;right:2px;font-size:9px;opacity:.7;}'
            + '#cb_wh_panel .cb_wh_pend{position:absolute;top:1px;left:2px;font-size:9px;}'
            + '#cb_wh_panel .cb_wh_plansign{position:absolute;bottom:0;right:3px;font-size:8px;line-height:1;color:#2A5298;}'
            + '#cb_wh_panel .cb_wh_day.cb_wh_abs .cb_wh_plansign{color:#fff;}'
            + '#cb_wh_panel .cb_wh_manual{border-top:1px solid #eceef1;padding-top:8px;}'
            + '#cb_wh_panel .cb_wh_mhead{display:flex;justify-content:space-between;font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.03em;margin-bottom:5px;}'
            + '#cb_wh_panel .cb_wh_mhead b{color:#333;}'
            + '#cb_wh_panel .cb_wh_mhead small{color:#999;font-weight:400;text-transform:none;}'
            + '#cb_wh_panel .cb_wh_add{display:flex;gap:4px;align-items:center;}'
            + '#cb_wh_panel .cb_wh_add input{height:26px;padding:2px 6px;font-size:12px;}'
            + '#cb_wh_panel .cb_wh_add .cb_wh_h{width:52px;text-align:center;flex:0 0 52px;}'
            + '#cb_wh_panel .cb_wh_add .cb_wh_note{flex:1 1 auto;min-width:0;}'
            + '#cb_wh_panel .cb_wh_add button{padding:1px 8px;font-size:14px;line-height:1.4;}'
            + '#cb_wh_panel .cb_wh_list{list-style:none;margin:6px -6px 0;padding:0;font-size:11px;}'
            + '#cb_wh_panel .cb_wh_list li{display:flex;gap:5px;align-items:center;padding:3px 6px;border-radius:3px;color:#666;transition:background .12s;}'
            + '#cb_wh_panel .cb_wh_list li:hover{background:#f0f2f5;}'
            + '#cb_wh_panel .cb_wh_list li b{color:#333;flex:0 0 auto;}'
            + '#cb_wh_panel .cb_wh_list li em{flex:1 1 auto;font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
            + '#cb_wh_panel .cb_wh_list li small{flex:0 0 auto;color:#9aa1a9;font-size:10px;white-space:nowrap;}'
            + '#cb_wh_panel .cb_wh_list li.cb_wh_carry b{color:#2A5298;}'
            + '#cb_wh_panel .cb_wh_list li.cb_wh_carry em{font-style:italic;}'
            + '#cb_wh_panel .cb_wh_del{color:#c0392b;cursor:pointer;opacity:.6;font-size:10px;}'
            + '#cb_wh_panel .cb_wh_del:hover{opacity:1;}'
            + '.cb_wh_menu{position:absolute;z-index:2147483000;background:#fff;border:1px solid #ccd0d6;border-radius:4px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:4px 0;font:12px/1.5 Arial,sans-serif;min-width:210px;}'
            + '.cb_wh_menu b{display:block;padding:3px 12px 5px;color:#888;font-size:10px;text-transform:uppercase;}'
            + '.cb_wh_menu a{display:flex;align-items:center;gap:7px;padding:4px 12px;color:#333;text-decoration:none;cursor:pointer;}'
            + '.cb_wh_menu a:hover{background:#eef2f9;}'
            + '.cb_wh_menu a i{width:9px;height:9px;border-radius:50%;display:inline-block;border:1px solid rgba(0,0,0,.15);}'
            + '.cb_wh_menu a.cb_wh_act{font-weight:700;}'
            + '.cb_wh_menu.cb_wh_range{min-width:256px;}'
            + '.cb_wh_menu .cb_wh_sum{padding:1px 12px 6px;color:#666;font-size:11px;}'
            + '.cb_wh_menu .cb_wh_sum div{display:flex;justify-content:space-between;gap:12px;padding:1px 0;}'
            + '.cb_wh_menu .cb_wh_sum div.cb_wh_sumtop{border-top:1px solid #eceef1;margin-top:4px;padding-top:4px;}'
            + '.cb_wh_menu .cb_wh_sum b{display:inline;padding:0;font-size:11px;color:#222;text-transform:none;}'
            + '.cb_wh_menu .cb_wh_sumnote{padding:0 12px 6px;color:#9aa0a8;font-size:10px;line-height:1.4;}'
            + '.cb_wh_menu .cb_wh_planrow{display:flex;align-items:center;gap:6px;padding:1px 12px 5px;}'
            + '.cb_wh_menu .cb_wh_planrow input{flex:0 0 64px;width:64px;height:24px;padding:1px 5px;font-size:12px;text-align:center;}'
            + '.cb_wh_menu .cb_wh_planrow em{flex:1 1 auto;font-style:normal;color:#9aa0a8;font-size:10px;}'
            + '.cb_wh_menu .cb_wh_planrow button{padding:1px 9px;font-size:12px;line-height:1.4;}'
            + '#cb_wh_panel .cb_wh_nav{display:flex;align-items:center;justify-content:space-between;gap:6px;margin:0 0 7px;font-size:11px;}'
            + '#cb_wh_panel .cb_wh_nav a{color:#8a919c;text-decoration:none;cursor:pointer;padding:1px 7px;border-radius:3px;line-height:1.6;}'
            + '#cb_wh_panel .cb_wh_nav a:hover{color:#2A5298;background:#eef2f9;}'
            + '#cb_wh_panel .cb_wh_nav a.cb_wh_off{opacity:.3;cursor:default;color:#8a919c;background:none;}'
            + '#cb_wh_panel .cb_wh_nav .cb_wh_now{text-transform:uppercase;letter-spacing:.05em;font-size:10px;}'
            + '.cb_wh_cfgbox{min-width:266px;max-width:278px;padding:2px 0 6px;}'
            + '.cb_wh_cfgbox .cb_wh_cfgsec{padding:7px 12px 3px;margin-top:4px;border-top:1px solid #f0f2f5;'
            +     'color:#9aa0a8;font-size:9px;text-transform:uppercase;letter-spacing:.07em;}'
            + '.cb_wh_cfgbox .cb_wh_cfgsec.cb_wh_first{margin-top:0;border-top:0;padding-top:5px;}'
            + '.cb_wh_cfgline{display:flex;align-items:center;gap:6px;padding:2px 12px;color:#555;font-size:11px;}'
            + '.cb_wh_cfgline label{flex:1 1 auto;margin:0;font-weight:400;white-space:nowrap;}'
            + '.cb_wh_cfgline input{flex:0 0 44px;width:44px;height:22px;padding:1px 4px;font-size:11px;text-align:center;}'
            + '.cb_wh_cfgline em{flex:0 0 auto;color:#9aa0a8;font-style:normal;font-size:10px;}'
            + '.cb_wh_cfgbox .cb_wh_pills{display:flex;gap:2px;flex:0 0 auto;}'
            + '.cb_wh_cfgbox .cb_wh_pills + .cb_wh_pills{margin-left:7px;}'
            + '.cb_wh_cfgbox .cb_wh_pills a{display:block;padding:1px 7px;border:1px solid #d5dae1;border-radius:3px;'
            +     'background:#fff;color:#6b7480;font-size:10px;line-height:1.6;text-decoration:none;cursor:pointer;}'
            + '.cb_wh_cfgbox .cb_wh_pills a:hover{border-color:#2A5298;color:#2A5298;background:#fff;}'
            + '.cb_wh_cfgbox .cb_wh_pills a.cb_wh_act{background:#2A5298;border-color:#2A5298;color:#fff;font-weight:400;}'
            + '.cb_wh_cfgbox .cb_wh_pills.cb_wh_pillsoff{opacity:.4;}'
            + '.cb_wh_cfgbox .cb_wh_pills.cb_wh_pillsoff a{cursor:default;}'
            + '.cb_wh_cfgbox .cb_wh_pills.cb_wh_pillsoff a:hover{border-color:#d5dae1;color:#6b7480;background:#fff;}'
            + '.cb_wh_cfgbox .cb_wh_pills.cb_wh_pillsoff a.cb_wh_act:hover{background:#2A5298;border-color:#2A5298;color:#fff;}'
            + '.cb_wh_cfgbox .cb_wh_cfgline.cb_wh_lineoff label{color:#b9bfc6;}'
            // Tastatur-Belegung: die Tasten sehen wie echte Keycaps aus
            + '.cb_wh_cfgbox .cb_wh_key{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;'
            +     'min-width:19px;height:18px;padding:0 4px;box-sizing:border-box;border:1px solid #c3c9d2;'
            +     'border-radius:3px;background:#fbfcfd;box-shadow:0 1px 0 #dfe3e9;color:#555;'
            +     'font:700 9px/1 Arial,sans-serif;text-decoration:none;cursor:pointer;}'
            + '.cb_wh_cfgbox .cb_wh_key:hover{border-color:#2A5298;color:#2A5298;background:#fbfcfd;}'
            + '.cb_wh_cfgbox .cb_wh_key + .cb_wh_key{margin-left:3px;}'
            + '.cb_wh_cfgbox .cb_wh_key.cb_wh_keyoff{color:#c3c9d2;}'
            + '.cb_wh_cfgbox .cb_wh_key.cb_wh_keycatch{border-color:#2A5298;color:#2A5298;background:#eef2f9;}'
            // Enter zeichnet seine Form selbst, deshalb ohne eigenen Rahmen
            + '.cb_wh_cfgbox .cb_wh_key.cb_wh_keyenter{border:0;background:none;box-shadow:none;'
            +     'padding:0;min-width:0;height:18px;}'
            + '.cb_wh_cfgbox .cb_wh_keyenter svg{display:block;}'
            + '.cb_wh_cfgbox .cb_wh_keyenter:hover svg path{stroke:#2A5298;}'
            + '.cb_wh_cfgnote{padding:7px 12px 0;color:#b0b6bd;font-size:9px;line-height:1.4;}';

        const injectCss = () => {
            if (document.getElementById('cb_wh_css')) return;
            const style = document.createElement('style');
            style.id = 'cb_wh_css';
            style.textContent = CSS;
            document.head.appendChild(style);
        };


        // ── Mini-Kalender: Woche als Streifen, Monat als Raster ──
        const dayCellHtml = (day, compact) => {
            const classes = ['cb_wh_day'];
            if (day.isWeekend) classes.push('cb_wh_we');
            if (day.isToday) classes.push('cb_wh_today');
            if (day.isFuture) classes.push('cb_wh_future');
            if (day.overLong) classes.push('cb_wh_over10');
            // ganztägig abwesend -> Zelle voll gefärbt; nur teilweise -> durchgezogene Linie
            // am unteren Rand (Text bleibt dadurch lesbar), der Anteil steht im Chip
            if (day.chips.length) classes.push(day.partial ? 'cb_wh_part' : 'cb_wh_abs');
            const value = day.totalMin > 0 ? cbWhFmt(day.totalMin) : (day.trackedMin === null ? '–' : '0:00');
            const title = [day.label + ', ' + day.iso.split('-').reverse().join('.')]
                .concat(day.trackedMin === null ? ['keine Zeiterfassung vorhanden'] : ['gestempelt: ' + cbWhFmt(day.trackedMin)])
                .concat(day.creditMin > 0 ? ['angerechnet: ' + cbWhFmt(day.creditMin)
                    + (day.partial ? ' (' + shareLabel(day.absShare).trim() + ' Tag)' : '')] : [])
                .concat(day.partial && day.trackedMin !== null ? ['zusammen: ' + cbWhFmt(day.totalMin)] : [])
                .concat(day.notes)
                .concat(['', 'Klick: Tag manuell setzen', 'Ziehen: mehrere Tage auswählen',
                    'Strg + Klick: einzelne Tage sammeln'])
                .join(NL);
            return '<div class="' + classes.join(' ') + '" data-iso="' + day.iso + '"'
                + (day.chips.length && day.color
                    ? (day.partial
                        ? ' style="background-image:linear-gradient(to right,' + esc(day.color) + ' 0,'
                            + esc(day.color) + ' 100%)"'
                        : ' style="background:' + esc(day.color) + '"')
                    : '')
                + ' title="' + esc(title) + '">'
                + (day.homeoffice ? '<span class="cb_wh_ho" title="Office / Mobile Office">⌂</span>' : '')
                + (day.pending ? '<span class="cb_wh_pend" title="offene Anfrage">•</span>' : '')
                + (day.planMin ? '<span class="cb_wh_plansign" title="' + esc('feste Arbeitszeit: ' + cbWhFmt(day.planMin)) + '">▪</span>' : '')
                + (compact ? '' : '<span class="cb_wh_dow">' + day.label + '</span>')
                + '<span class="cb_wh_num">' + day.dayNum + '.</span>'
                + '<span class="cb_wh_val">' + value + '</span>'
                + (day.chips.length ? '<span class="cb_wh_chip">' + esc(day.chips[0]) + '</span>' : '')
                + '</div>';
        };

        const calHtml = (data) => {
            if (data.scope !== 'month') return data.days.map(day => dayCellHtml(day, false)).join('');
            const lead = (data.days[0].date.getDay() + 6) % 7; // Monatsanfang auf den richtigen Wochentag schieben
            return DAY_LABELS.map(label => '<span class="cb_wh_dowhead">' + label + '</span>').join('')
                + new Array(lead + 1).join('<span></span>')
                + data.days.map(day => dayCellHtml(day, true)).join('');
        };

        // ── Monats- in Wochen-Ansicht überführen (und zurück) ──
        // render() ersetzt den ganzen Panel-Inhalt, eine reine CSS-Transition greift da
        // nicht. Deshalb per FLIP: die Tage, die es in beiden Ansichten gibt, werden auf
        // ihre alte Position zurückgerechnet und von dort an die neue animiert. Der Rest
        // des alten Kalenders liegt als "Geist" darüber und blendet aus, neue Teile
        // (Wochentags-Köpfe, die übrigen Tage des Monats) blenden ein.
        let lastCalKind = null; // 'month' | 'week' | 'none'
        let calAnimTimer = null;
        let navSlide = 0; // -1 = zurück, 1 = vor, 0 = kein Blättern (wird pro Rendern verbraucht)

        const animateCal = (prevH, prevHtml, prevRects, kindChanged, slideDir) => {
            const panel = document.getElementById(PANEL_ID);
            const wrap = panel ? panel.querySelector('.cb_wh_calwrap') : null;
            if (!wrap || prevH === null) return;
            if (calAnimTimer) { clearTimeout(calAnimTimer); calAnimTimer = null; }
            const newCal = wrap.querySelector('.cb_wh_cal');
            // Blättern schiebt seitlich, ein Ansichtswechsel überführt die Tage (FLIP)
            const slide = (!kindChanged && slideDir && newCal) ? (slideDir > 0 ? 1 : -1) : 0;
            let moving = [];
            let ghost = null;

            // Der Startzustand muss VOR der ersten Messung stehen: sobald die Hoehe gelesen
            // wird, berechnet der Browser die Stile des neuen Kalenders – waeren die dann
            // schon der Endzustand, gaebe es nichts mehr zu animieren.
            if (kindChanged) wrap.classList.add('cb_wh_swap'); // vor dem Geist, sonst blendet er nicht
            if ((kindChanged || slide) && prevHtml) {
                ghost = document.createElement('div');
                ghost.className = 'cb_wh_calghost';
                ghost.innerHTML = prevHtml; // nur Optik, keine Events
                wrap.appendChild(ghost);
            }
            if (kindChanged) {
                if (ghost && newCal) { // Tage, die wandern, im Geist verstecken (sonst doppelt)
                    ghost.querySelectorAll('.cb_wh_day').forEach(cell => {
                        const iso = cell.getAttribute('data-iso');
                        if (iso && newCal.querySelector('.cb_wh_day[data-iso="' + iso + '"]')) {
                            cell.style.visibility = 'hidden';
                        }
                    });
                }
                if (newCal) { // alles, was nicht wandert, blendet ein
                    Array.prototype.slice.call(newCal.children).forEach(el => {
                        const iso = el.getAttribute ? el.getAttribute('data-iso') : null;
                        if (iso && prevRects[iso]) moving.push(el);
                        else el.classList.add('cb_wh_fadein');
                    });
                }
            }
            if (slide) { // neu kommt von der Seite herein, alt schiebt zur anderen hinaus
                newCal.style.transition = 'none';
                newCal.style.transform = 'translateX(' + (slide * 100) + '%)';
                newCal.style.opacity = '0';
                if (ghost) {
                    ghost.style.transition = 'none';
                    ghost.style.transform = 'translateX(0)';
                    ghost.style.opacity = '1';
                }
            }

            const newH = wrap.offsetHeight; // opacity/transform aendern das Layout nicht
            if (!kindChanged && !slide && newH === prevH) return; // nichts verschiebt sich

            // FLIP: Differenz zur alten Position als Transform einfrieren
            const flip = [];
            moving.forEach(el => {
                const from = prevRects[el.getAttribute('data-iso')];
                const to = el.getBoundingClientRect();
                if (!to.width || !to.height) return;
                flip.push({
                    el: el,
                    dx: from.left - to.left, dy: from.top - to.top,
                    sx: from.width / to.width, sy: from.height / to.height
                });
            });
            flip.forEach(item => {
                item.el.style.transformOrigin = 'top left';
                item.el.style.transition = 'none';
                item.el.style.zIndex = '2';
                item.el.style.transform = 'translate(' + item.dx.toFixed(2) + 'px,' + item.dy.toFixed(2) + 'px)'
                    + ' scale(' + item.sx.toFixed(4) + ',' + item.sy.toFixed(4) + ')';
            });

            wrap.style.height = prevH + 'px';
            void wrap.offsetHeight; // Reflow, sonst springt alles ohne Übergang
            if (kindChanged) wrap.classList.remove('cb_wh_swap');
            wrap.style.height = newH + 'px';
            flip.forEach(item => {
                item.el.style.transition = 'transform .34s cubic-bezier(.4,0,.2,1)';
                item.el.style.transform = 'none';
            });
            if (slide) {
                newCal.style.transition = 'transform .34s cubic-bezier(.4,0,.2,1),opacity .24s ease';
                newCal.style.transform = 'translateX(0)';
                newCal.style.opacity = '1';
                if (ghost) {
                    ghost.style.transition = 'transform .34s cubic-bezier(.4,0,.2,1),opacity .3s ease';
                    ghost.style.transform = 'translateX(' + (-slide * 100) + '%)';
                    ghost.style.opacity = '0';
                }
            }

            calAnimTimer = setTimeout(() => {
                calAnimTimer = null;
                if (!wrap.isConnected) return;
                wrap.style.height = ''; // wieder auto, damit spätere Inhalte passen
                wrap.querySelectorAll('.cb_wh_calghost').forEach(old => old.remove());
                wrap.querySelectorAll('.cb_wh_fadein').forEach(el => el.classList.remove('cb_wh_fadein'));
                if (newCal) { // Inline-Reste des Seitwaerts-Schiebens entfernen
                    newCal.style.transform = '';
                    newCal.style.opacity = '';
                    newCal.style.transition = '';
                }
                flip.forEach(item => {
                    item.el.style.transform = '';
                    item.el.style.transition = '';
                    item.el.style.transformOrigin = '';
                    item.el.style.zIndex = '';
                });
            }, 380);
        };

        // ── Panel-Inhalt zeichnen ──
        const render = () => {
            const panel = document.getElementById(PANEL_ID);
            if (!panel) return;
            syncCarry(); // Übertraege aus abgelaufenen Wochen aktuell halten
            const view = viewMode(), scope = scopeMode(), ref = refDate();
            const isMonthView = view === 'month';
            const week = calcWeek(ref);
            const month = (isMonthView || scope !== 'week') ? calcMonth(ref) : null;
            const calData = (isMonthView && month) ? month : week; // Mini-Kalender
            const main = (scope === 'month' && month) ? month : week; // grosse Anzeige
            const sub = (scope === 'both' && month) ? month : null;   // kleine Zusatzzeile
            const isMonth = main.scope === 'month';

            const percent = main.targetMin > 0 ? Math.max(0, Math.min(100, Math.round(main.doneMin / main.targetMin * 100))) : 0;
            const restDone = main.restMin <= 0;
            const perDay = (!restDone && main.openDays > 0) ? cbWhFmt(main.restMin / main.openDays) : '–';
            const subPercent = sub && sub.targetMin > 0 ? Math.max(0, Math.min(100, Math.round(sub.doneMin / sub.targetMin * 100))) : 0;
            const subDone = sub ? sub.restMin <= 0 : false;
            const age = main.absence && main.absence.ts ? Math.round((Date.now() - main.absence.ts) / 60000) : null;

            const oldWrap = panel.querySelector('.cb_wh_calwrap');
            const oldCal = oldWrap ? oldWrap.querySelector('.cb_wh_cal') : null;
            const prevCalH = oldWrap ? oldWrap.offsetHeight : null; // fuer die Hoehen-Animation
            const prevCalHtml = oldCal ? oldCal.outerHTML : '';     // alter Kalender als Geist
            const prevCalRects = {};                                // Startpositionen der Tage
            if (oldCal) {
                oldCal.querySelectorAll('.cb_wh_day').forEach(cell => {
                    const iso = cell.getAttribute('data-iso');
                    if (!iso) return;
                    const box = cell.getBoundingClientRect();
                    prevCalRects[iso] = { left: box.left, top: box.top, width: box.width, height: box.height };
                });
            }
            const calOpenNow = calIsOpen();
            // eingeklappt: in der Monats-Ansicht optional die aktuelle Woche stehen lassen
            const calShow = calOpenNow ? calData
                : ((isMonthView && calFoldWeek()) ? week : null);
            const calKind = calShow ? calShow.scope : 'none';
            const calKindChanged = lastCalKind !== null && lastCalKind !== calKind;
            lastCalKind = calKind;
            const slideDir = navSlide; // nur für dieses Rendern
            navSlide = 0;

            const heading = panel.querySelector('.cb_wh_kw');
            if (heading) {
                heading.innerHTML = esc(calData.label)
                    + ' <span class="caret' + (calOpenNow ? '' : ' cb_wh_shut') + '"></span>';
                heading.setAttribute('title', calOpenNow ? 'Mini-Kalender einklappen' : 'Mini-Kalender ausklappen');
                if (!heading.getAttribute('data-cb-bound')) { // sonst haengt der Listener nach jedem Rendern erneut
                    heading.setAttribute('data-cb-bound', '1');
                    heading.addEventListener('click', event => {
                        event.preventDefault();
                        event.stopPropagation();
                        closeMenus();
                        toggleCal();
                        render();
                    });
                }
            }

            const icon = panel.querySelector('.cb_wh_sync'); // Infos stecken im Tooltip des Sync-Icons
            if (icon) {
                const when = age === null ? 'noch nicht geladen'
                    : (age < 1 ? 'gerade eben' : (age < 60 ? 'vor ' + age + ' Min.' : 'vor ' + Math.round(age / 60) + ' Std.'));
                const missing = main.noData.slice(0, 8).join(', ') + (main.noData.length > 8 ? ' …' : '');
                icon.setAttribute('title', !cbWhHasGm()
                    ? 'Für die Übernahme aus absence.io werden @grant GM_setValue und GM_getValue gebraucht'
                    : 'Abwesenheiten aus absence.io holen (Stand: ' + when + ')'
                        + (main.absence && main.absence.user && main.absence.user.name ? ' – ' + main.absence.user.name : '')
                        + (main.noData.length ? NL + 'Keine Tabellen-Zeilen für ' + missing + ' – als 0:00 gerechnet' : ''));
            }

            const sollTitle = isMonth
                ? 'Monats-Soll: ' + main.month.workdays + ' Arbeitstage × ' + cbWhFmtDec(main.cfg.weekHours / 5) + ' Std.'
                : 'Wochen-Soll';
            // Kachel mit dem Soll des ganzen Monats (entfällt, wenn die grosse Anzeige schon der Monat ist)

            // Blätter-Leiste über dem Kalender
            const lim = navLimits(), prevOk = canShift(-1), nextOk = canShift(1);
            const stepName = isMonthView ? 'en Monat' : 'e Woche';
            const prevTitle = prevOk ? 'ein' + stepName + ' zurück' : 'Anfang des Zeitraums (ab Januar ' + lim.start.getFullYear() + ')';
            const nextTitle = nextOk ? 'ein' + stepName + ' vor' : 'Ende des Zeitraums (bis Juni ' + lim.end.getFullYear() + ')';
            const entryWeek = cbWhWeekInfo(ref); // neue Korrekturen landen in dieser Woche
            const manualData = calData.scope === 'month' ? calData : week;
            const manualTitle = 'Neue Eingaben zählen zur KW ' + entryWeek.kw + ' ('
                + cbWhIso(entryWeek.monday).split('-').reverse().slice(0, 2).join('.') + '–'
                + cbWhIso(cbWhAddDays(entryWeek.monday, 6)).split('-').reverse().slice(0, 2).join('.') + ')';

            // ── Feierabend-Hinweis (klein und grau im grossen Rest-Wert) ──
            // mit fester Arbeitszeit fuer heute: was heute noch fehlt und bis wann
            // ohne: erst wenn weniger als die eingestellte Schwelle offen ist (week_until_hours)
            let untilHtml = '';
            untilState = null;
            if (isCurrentPeriod()) {
                const today = calcDay(new Date(), main.cfg, stores());
                if (today.planMin) {
                    const leftMin = today.planMin - today.totalMin;
                    if (leftMin > 0) {
                        untilState = {
                            prefix: 'bis ',
                            suffix: ' Uhr · heute noch ' + cbWhFmt(leftMin),
                            min: leftMin,
                            title: 'feste Arbeitszeit heute: ' + cbWhFmt(today.planMin)
                                + ' · bereits ' + cbWhFmt(today.totalMin) + ' · ohne Pause gerechnet'
                        };
                    } else {
                        untilHtml = '<small title="' + esc('feste Arbeitszeit heute: ' + cbWhFmt(today.planMin)) + '">'
                            + 'heute erledigt · ' + cbWhFmt(today.totalMin) + '</small>';
                    }
                } else if (!restDone && main.restMin > 0 && main.restMin < Math.round(main.cfg.untilHours * 60)) {
                    untilState = {
                        prefix: 'bis ',
                        suffix: ' Uhr',
                        min: main.restMin,
                        title: 'offene Stunden ab jetzt gerechnet – ohne Pause'
                    };
                }
            }
            if (untilState) {
                untilHtml = '<small title="' + esc(untilState.title) + '">'
                    + esc(untilText(untilState)) + '</small>';
            }

            panel.querySelector('.panel-body').innerHTML = ''
                + '<div class="cb_wh_rest' + (restDone ? ' cb_wh_done' : '') + '">'
                +     '<b>' + untilHtml + (restDone ? '+' + cbWhFmt(-main.restMin) : cbWhFmt(main.restMin)) + '</b>'
                +     '<span>' + (restDone ? 'Stunden über dem Soll' : 'Stunden noch offen') + (isMonth ? ' (Monat)' : '')
                +         (sub ? '<em class="cb_wh_sub' + (subDone ? ' cb_wh_done' : '') + '">'
                +             '<span title="Verbleibende Stunden für diesen Monat">'
                +                 (subDone ? '+' + cbWhFmt(-sub.restMin) + ' über dem Soll' : cbWhFmt(sub.restMin) + ' offen') + '</span>'
                +             ' · <span title="Gearbeitete Stunden für diesen Monat">' + cbWhFmt(sub.doneMin) + '</span>'
                +             ' / <span title="Soll des ganzen Monats">' + cbWhFmt(sub.targetMin) + '</span>'
                +         '</em>' : '')
                +     '</span>'
                + '</div>'
                + '<div class="cb_wh_bar' + (restDone ? ' cb_wh_over' : '') + '" title="'
                +         esc((isMonth ? 'Monat: ' : 'Woche: ') + percent + ' %'
                +             (sub && !isMonth ? ' · Monat: ' + subPercent + ' %' : '')) + '">'
                +     '<i style="width:' + percent + '%"></i>'
                // Punkt-Raster in zwei Abschnitten: über der Wochenleiste weiß, auf dem
                // leeren Balken in der Farbe der Wochenleiste. Beide Ebenen sind voll
                // breit und werden nur beschnitten – so bleibt das Raster lückenlos.
                +     (sub ? '<u style="clip-path:inset(0 ' + (100 - Math.min(percent, subPercent)) + '% 0 0)"></u>' : '')
                +     (sub && subPercent > percent
                        ? '<u class="cb_wh_bare' + (restDone ? ' cb_wh_over' : '') + '"'
                            + ' style="clip-path:inset(0 ' + (100 - subPercent) + '% 0 ' + percent + '%)"></u>'
                        : '')
                + '</div>'
                + '<div class="cb_wh_kpis">'
                +     '<span title="' + esc(sollTitle) + '">Soll' + (isMonth ? ' (Monat)' : '') + '<b>' + cbWhFmt(main.targetMin) + '</b></span>'
                +     '<span title="' + (isMonth ? 'Gearbeitete Stunden in diesem Monat' : 'Gearbeitete Stunden diese Woche') + '">Ist<b>' + cbWhFmt(main.doneMin) + '</b></span>'
                +     '<span title="' + esc('Rest verteilt auf die verbleibenden Arbeitstage ('
                +         main.openDays + (main.openDays === 1 ? ' Arbeitstag' : ' Arbeitstage') + ')') + '">&#216; / Tag<b>' + perDay + '</b></span>'
                + '</div>'
                + '<div class="cb_wh_nav">'
                +     '<a class="cb_wh_prev glyphicon glyphicon-chevron-left' + (prevOk ? '' : ' cb_wh_off') + '" title="' + esc(prevTitle) + '"></a>'
                +     '<a class="cb_wh_now' + (isCurrentPeriod() ? ' cb_wh_off' : '') + '" title="' + esc(isMonthView ? 'zurück zum aktuellen Monat' : 'zurück zur aktuellen Woche') + '">heute</a>'
                +     '<a class="cb_wh_next glyphicon glyphicon-chevron-right' + (nextOk ? '' : ' cb_wh_off') + '" title="' + esc(nextTitle) + '"></a>'
                + '</div>'
                + '<div class="cb_wh_calwrap">'
                +     (calShow ? '<div class="cb_wh_cal' + (calShow.scope === 'month' ? ' cb_wh_grid' : '') + '">' + calHtml(calShow) + '</div>' : '')
                + '</div>'
                + '<div class="cb_wh_manual">'
                +     '<div class="cb_wh_mhead"><span title="' + esc(manualTitle) + '">Manuelle Korrektur</span><b>'
                +         (manualData.manualMin >= 0 ? '+' : '') + cbWhFmt(manualData.manualMin)
                +         ' <small>' + esc(calData.scope === 'month' ? calData.month.label : 'KW ' + week.week.kw) + '</small>'
                +     '</b></div>'
                +     '<div class="cb_wh_add">'
                +         '<input type="text" class="form-control cb_wh_h" placeholder="1,5" title="' + esc('Stunden (z.B. 1,5 oder 0:30) – ' + manualTitle) + '">'
                +         '<input type="text" class="form-control cb_wh_note" placeholder="Notiz (optional)">'
                +         '<button type="button" class="btn btn-default cb_wh_minus" title="Stunden abziehen">&#8722;</button>'
                +         '<button type="button" class="btn btn-default cb_wh_plus" title="Stunden hinzufügen">+</button>'
                +     '</div>'
                + (manualData.manual.length ? '<ul class="cb_wh_list">' + manualData.manual.map(entry => {
                            const hours = Number(entry.item.h) || 0;
                            const isCarry = entry.carry === true;
                            const fromKey = isCarry ? String(entry.item.from || '') : entry.key;
                            const when = carryWhen(fromKey); // Monat + Jahr der Stunden
                            const text = isCarry ? carryLabel(fromKey) : (entry.item.note || 'Korrektur');
                            const tip = (isCarry ? 'Plus-/Minusstunden aus ' : '')
                                + fromKey.replace('-KW', ', KW ') + (when ? ' · ' + when : '')
                                + (isCarry ? ' – werden in dieser Woche mitgezählt' : '');
                            return '<li' + (isCarry ? ' class="cb_wh_carry"' : '') + '>'
                                + '<b>' + (hours >= 0 ? '+' : '') + cbWhFmt(hours * 60) + '</b>'
                                + '<em title="' + esc(tip) + '">' + esc(text) + '</em>'
                                + (when ? '<small>' + esc(when) + '</small>' : '')
                                + '<a class="cb_wh_del glyphicon glyphicon-remove" data-week="' + entry.key + '" data-index="' + entry.index + '"'
                                    + (isCarry ? ' data-carry="1"' : '') + ' title="entfernen"></a>'
                                + '</li>';
                        }).join('') + '</ul>' : '')
                + '</div>';

            // direkt nach dem Austausch, bevor irgendetwas anderes Stile berechnen kann
            animateCal(prevCalH, prevCalHtml, prevCalRects, calKindChanged, slideDir);
            bindEvents(panel);
            paintPick(); // eine bestehende Auswahl nach dem Neuzeichnen wieder markieren
        };


        // ── Zusammenfassung als Text in die Zwischenablage ──
        const fallbackCopy = (text, done) => { // aelterer Weg, falls die Clipboard-API blockt
            try {
                const area = document.createElement('textarea');
                area.value = text;
                area.style.cssText = 'position:fixed;top:-1000px;left:-1000px;';
                document.body.appendChild(area);
                area.select();
                const ok = document.execCommand('copy');
                area.remove();
                if (ok) { done(); return; }
            } catch (e) {}
            cbWhToast('Kopieren hat nicht geklappt', false);
        };

        const copySummary = () => {
            const ref = refDate();
            const week = calcWeek(ref);
            const month = calcMonth(ref);
            const pad = (text, width) => { let out = String(text); while (out.length < width) out += ' '; return out; };
            const row = (label, value) => pad(label, 16) + value;
            const lines = ['Arbeitsstunden ' + week.label];
            lines.push(row('Soll', cbWhFmt(week.targetMin)));
            lines.push(row('Ist', cbWhFmt(week.doneMin)));
            lines.push(row(week.restMin <= 0 ? 'Über dem Soll' : 'Noch offen', cbWhFmt(Math.abs(week.restMin))));
            if (week.manualMin) lines.push(row('davon manuell', (week.manualMin >= 0 ? '+' : '') + cbWhFmt(week.manualMin)));
            lines.push('');
            lines.push(month.month.label + ': Ist ' + cbWhFmt(month.doneMin) + ' / Soll ' + cbWhFmt(month.targetMin)
                + ' (' + (month.restMin <= 0 ? '+' + cbWhFmt(-month.restMin) + ' über dem Soll' : cbWhFmt(month.restMin) + ' offen') + ')');
            lines.push('');
            week.days.forEach(day => {
                lines.push(pad(day.label + ' ' + day.dayNum + '.' + cbWhPad(day.date.getMonth() + 1) + '.', 12)
                    + pad(day.trackedMin === null && day.creditMin === 0 ? '–' : cbWhFmt(day.totalMin), 8)
                    + (day.chips.length ? day.chips.join(', ') : '')
                    + (day.overLong ? ' (über 10 Std.!)' : ''));
            });
            if (week.manual.length) {
                lines.push('');
                lines.push('Manuelle Korrekturen:');
                week.manual.forEach(entry => {
                    const hours = Number(entry.item.h) || 0;
                    lines.push('  ' + pad((hours >= 0 ? '+' : '') + cbWhFmt(hours * 60), 8)
                        + (entry.carry ? carryLabel(String(entry.item.from || '')) : (entry.item.note || 'Korrektur')));
                });
            }
            const text = lines.join(NL);
            const done = () => cbWhToast('Zusammenfassung kopiert');
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
                    return;
                }
            } catch (e) {}
            fallbackCopy(text, done);
        };

        // ── Eingabe "1,5" / "0:30" / "-2" in Stunden umwandeln ──
        const parseHours = (text) => {
            const raw = String(text || '').trim().replace(',', '.');
            if (!raw) return null;
            const time = raw.match(/^(-?)(\d{1,3}):(\d{2})$/);
            if (time) {
                const value = parseInt(time[2], 10) + parseInt(time[3], 10) / 60;
                return time[1] === '-' ? -value : value;
            }
            const number = parseFloat(raw);
            return isFinite(number) ? number : null;
        };

        // ── manuelle Korrektur speichern (pro Kalenderwoche) ──
        const addManual = (hours) => {
            const panel = document.getElementById(PANEL_ID);
            const noteInput = panel ? panel.querySelector('.cb_wh_note') : null;
            const week = cbWhWeekInfo(refDate()); // die gerade angezeigte Woche
            const store = lsGet(MANUAL_KEY, {});
            const list = store[week.key] || [];
            list.push({ h: Math.round(hours * 100) / 100, note: noteInput ? noteInput.value.trim() : '', ts: Date.now() });
            store[week.key] = list;
            const keys = Object.keys(store).sort();
            while (keys.length > 90) { delete store[keys.shift()]; } // deckt den ganzen blaetterbaren Zeitraum ab
            lsSet(MANUAL_KEY, store);
            render();
        };

        // ── Tages-Typ manuell setzen (Klick auf einen Tag) ──
        const openDayMenu = (cell) => {
            closeMenus();
            const iso = cell.getAttribute('data-iso');
            const current = lsGet(TYPE_KEY, {})[iso] || 'auto';
            const menu = document.createElement('div');
            menu.className = 'cb_wh_menu';
            menu.innerHTML = '<b>' + iso.split('-').reverse().join('.') + '</b>'
                + DAY_TYPES.map(type => '<a data-type="' + type.id + '" class="' + (type.id === current ? 'cb_wh_act' : '') + '">'
                    + '<i style="background:' + (type.color || 'transparent') + '"></i>' + esc(type.label) + '</a>').join('')
                + planRowHtml(planOf(iso), 1);
            document.body.appendChild(menu);
            bindPlanRow(menu, [iso], () => { menu.remove(); clearPick(); render(); });
            const box = cell.getBoundingClientRect();
            menu.style.top = (window.scrollY + box.bottom + 4) + 'px';
            menu.style.left = Math.max(6, Math.min(window.scrollX + box.left,
                window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 10)) + 'px';
            menu.querySelectorAll('a[data-type]').forEach(link => link.addEventListener('click', () => {
                const type = link.getAttribute('data-type');
                const store = lsGet(TYPE_KEY, {});
                if (type === 'auto') delete store[iso]; else store[iso] = type;
                const limit = cbWhIso(navLimits().start);
                Object.keys(store).forEach(key => { if (key < limit) delete store[key]; });
                lsSet(TYPE_KEY, store);
                menu.remove();
                render();
            }));
            setTimeout(() => { // erst danach lauschen, sonst schließt der eigene Klick das Menü direkt
                const close = (event) => {
                    if (!menu.contains(event.target)) { menu.remove(); document.removeEventListener('click', close); }
                };
                document.addEventListener('click', close);
            }, 0);
        };

        // ── Mehrere Tage (per Drag ausgewählt): Zusammenfassung + Tages-Typ für alle ──
        const openRangeMenu = (isos) => {
            document.querySelectorAll('.cb_wh_menu').forEach(old => old.remove()); // Markierung bleibt stehen
            const panel = document.getElementById(PANEL_ID);
            if (!panel || !isos.length) return;

            const c = cfg(), st = stores();
            const sollPerDay = Math.round(c.weekHours / 5 * 60); // Tages-Soll = Wochen-Soll / 5
            const days = isos.map(iso => calcDay(cbWhFromIso(iso), c, st));
            const sum = (pick) => days.reduce((total, day) => total + (pick(day) || 0), 0);
            const trackedMin = sum(day => day.trackedMin);
            const creditMin = sum(day => day.creditMin);
            const totalMin = sum(day => day.totalMin);
            const workdays = days.filter(day => !day.isWeekend).length;
            const targetMin = workdays * sollPerDay;
            const diffMin = totalMin - targetMin;
            const missing = days.filter(day => !day.isWeekend && !day.isFuture && day.trackedMin === null && day.creditMin === 0)
                .map(day => day.dayNum + '.' + cbWhPad(day.date.getMonth() + 1) + '.');
            const kinds = {};
            days.forEach(day => { kinds[day.override || 'auto'] = true; });
            const plans = {};
            days.forEach(day => { plans[day.planMin || 0] = true; }); // gemeinsame feste Arbeitszeit?
            const commonPlan = Object.keys(plans).length === 1 ? (days[0].planMin || 0) : 0;
            const common = Object.keys(kinds).length === 1 ? Object.keys(kinds)[0] : ''; // nur markieren, wenn alle gleich
            const dayList = isos.map(iso => iso.slice(8) + '.' + iso.slice(5, 7) + '.');
            // lückenlos ausgewählt? dann Zeitraum zeigen, sonst die Tage einzeln
            const gapless = isos.length === Math.round((cbWhFromIso(isos[isos.length - 1]) - cbWhFromIso(isos[0])) / 86400000) + 1;
            const span = gapless
                ? (isos.length === 1 ? dayList[0] : dayList[0] + ' – ' + dayList[dayList.length - 1])
                : dayList.slice(0, 4).join(', ') + (dayList.length > 4 ? ' …' : '');
            const dayWord = isos.length === 1 ? ' Tag' : ' Tage';
            const tooLong = days.filter(day => day.overLong).length;
            const row = (label, value, top) => '<div' + (top ? ' class="cb_wh_sumtop"' : '') + '>'
                + '<span>' + esc(label) + '</span><b>' + esc(value) + '</b></div>';

            const menu = document.createElement('div');
            menu.className = 'cb_wh_menu cb_wh_range';
            menu.innerHTML = '<b>' + isos.length + dayWord + ' · ' + esc(span) + '</b>'
                + '<div class="cb_wh_sum">'
                +     row('Gestempelt', cbWhFmt(trackedMin))
                +     row('Angerechnet', cbWhFmt(creditMin))
                +     row('Gezählt (Ist)', cbWhFmt(totalMin), true)
                +     row('Soll (' + workdays + ' Arbeitstage)', cbWhFmt(targetMin))
                +     row(diffMin >= 0 ? 'Über dem Soll' : 'Unter dem Soll', (diffMin >= 0 ? '+' : '') + cbWhFmt(diffMin))
                +     row('Ø pro Arbeitstag', workdays ? cbWhFmt(totalMin / workdays) : '–')
                +     (tooLong ? row('über 10 Std.', tooLong + (tooLong === 1 ? ' Tag' : ' Tage')) : '')
                + '</div>'
                + (missing.length ? '<div class="cb_wh_sumnote">Ohne Erfassung: ' + esc(missing.join(', ')) + ' – als 0:00 gerechnet</div>' : '')
                + '<b>' + (isos.length === 1 ? 'Diesen Tag setzen' : 'Alle ' + isos.length + ' Tage setzen') + '</b>'
                + DAY_TYPES.map(type => '<a data-type="' + type.id + '" class="' + (type.id === common ? 'cb_wh_act' : '') + '">'
                    + '<i style="background:' + (type.color || 'transparent') + '"></i>' + esc(type.label) + '</a>').join('')
                + planRowHtml(commonPlan, isos.length);
            document.body.appendChild(menu);
            // Sicherheitsnetz: solange das Popup offen ist, sind die Tage auf jeden Fall markiert
            isos.forEach(iso => {
                const cell = panel.querySelector('.cb_wh_day[data-iso="' + iso + '"]');
                if (cell) cell.classList.add('cb_wh_pick');
            });
            bindPlanRow(menu, isos, () => { menu.remove(); clearPick(); render(); });

            const anchor = panel.querySelector('.cb_wh_day[data-iso="' + isos[0] + '"]') || panel.querySelector('.cb_wh_cal');
            const box = anchor.getBoundingClientRect();
            menu.style.top = (window.scrollY + box.bottom + 4) + 'px';
            menu.style.left = Math.max(6, Math.min(window.scrollX + box.left,
                window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 10)) + 'px';

            menu.querySelectorAll('a[data-type]').forEach(link => link.addEventListener('click', () => {
                const type = link.getAttribute('data-type');
                const store = lsGet(TYPE_KEY, {});
                isos.forEach(iso => { if (type === 'auto') delete store[iso]; else store[iso] = type; });
                const limit = cbWhIso(navLimits().start);
                Object.keys(store).forEach(key => { if (key < limit) delete store[key]; });
                lsSet(TYPE_KEY, store);
                menu.remove();
                clearPick();
                render();
            }));

            // beim naechsten Druck daneben wieder zu – auf mousedown, damit der eigene
            // Klick des Drags nicht zaehlt und kein setTimeout-Wettlauf entsteht
            const close = (event) => {
                if (!menu.isConnected) { document.removeEventListener('mousedown', close); return; }
                if (menu.contains(event.target)) return;
                menu.remove();
                clearPick();
                document.removeEventListener('mousedown', close);
            };
            document.addEventListener('mousedown', close);
        };

        // ── Einstellungs-Popup (Zahnrad neben dem Sync-Icon) ──
        // kompakte Schalter-Gruppe (mehrere Knoepfe nebeneinander statt untereinander)
        const cfgGroup = (key, options, current, off) => '<span class="cb_wh_pills' + (off ? ' cb_wh_pillsoff' : '') + '">'
            + options.map(option => '<a data-cfg="' + key + '" data-value="' + option.id + '"'
                + ' class="' + (option.id === current ? 'cb_wh_act' : '') + '"'
                + ' title="' + esc(option.label) + '">' + esc(option.short || option.label) + '</a>').join('')
            + '</span>';

        // eine Zeile im Einstellungs-Popup: Beschriftung links, Bedienelement rechts
        const cfgLine = (label, content, title, off) => '<div class="cb_wh_cfgline' + (off ? ' cb_wh_lineoff' : '') + '"'
            + (title ? ' title="' + esc(title) + '"' : '') + '><label>' + esc(label) + '</label>' + content + '</div>';

        const openCfgMenu = (anchor) => {
            const open = !!document.querySelector('.cb_wh_cfgbox');
            closeMenus();
            if (open) return; // zweiter Klick auf das Zahnrad schliesst das Popup wieder

            const c = cfg();
            const box = document.createElement('div');
            box.className = 'cb_wh_menu cb_wh_cfgbox';
            const numField = (cls, value) => '<input type="text" class="form-control ' + cls + '" value="' + esc(value) + '">';
            const monthView = viewMode() === 'month'; // die Einklapp-Option gilt nur dort
            box.innerHTML = '<div class="cb_wh_cfgsec cb_wh_first">Anzeige</div>'
                + cfgLine('Kalender', cfgGroup('week_view', VIEW_OPTIONS, viewMode()))
                + cfgLine('Stunden', cfgGroup('week_hours_scope', SCOPE_OPTIONS, scopeMode()))
                + cfgLine('eingeklappt', cfgGroup('cal_collapsed', CAL_START_OPTIONS, settings.cal_collapsed === 'closed' ? 'closed' : 'open')
                    + cfgGroup('cal_remember', CAL_MEMORY_OPTIONS, calRemember() ? 'on' : 'off'),
                    'Startzustand des Mini-Kalenders und ob ein Umklappen gemerkt wird')
                + cfgLine('eingeklappt zeigt', cfgGroup('cal_collapsed_mode', CAL_FOLD_OPTIONS,
                        calFoldWeek() ? 'week' : 'none', !monthView),
                    monthView ? 'In der Monats-Ansicht: eingeklappt nur die aktuelle Woche, ausgeklappt der ganze Monat'
                        : 'Nur in der Monats-Übersicht einstellbar',
                    !monthView)
                + '<div class="cb_wh_cfgsec">Soll-Stunden</div>'
                + cfgLine('Woche', numField('cb_wh_cfg_week', cbWhFmtDec(c.weekHours)) + '<em>Std.</em>')
                + cfgLine('Abwesenheitstag', numField('cb_wh_cfg_day', cbWhFmtDec(c.dayHours)) + '<em>Std.</em>')
                + '<div class="cb_wh_cfgsec">Feierabend</div>'
                + cfgLine('Uhrzeit ab unter', numField('cb_wh_cfg_until', cbWhFmtDec(c.untilHours)) + '<em>Std. offen</em>',
                    'Die Uhrzeit erscheint klein über den offenen Stunden, sobald weniger als dieser Wert offen ist')
                + '<div class="cb_wh_cfgsec">Tastatur</div>'
                + cfgLine('blättern', keyCapHtml('nav_prev') + keyCapHtml('nav_next'))
                + cfgLine('heute · Ansicht', keyCapHtml('nav_today') + keyCapHtml('view_toggle'))
                + cfgLine('Kalender auf/zu', keyCapHtml('cal_toggle'))
                + '<div class="cb_wh_cfgnote">Taste ändern: klicken, dann drücken · Esc bricht ab, Rücktaste löscht</div>';
            document.body.appendChild(box);
            anchor.classList.add('cb_wh_open');

            // Rechtsbuendig unter dem Zahnrad. Die linke Kante wird nur EINMAL bestimmt und
            // danach festgehalten – sonst wandert das Popup, wenn sich seine Breite durch
            // eine Umschaltung minimal aendert.
            let fixedLeft = null;
            const place = () => {
                const rect = anchor.getBoundingClientRect();
                box.style.top = (window.scrollY + rect.bottom + 6) + 'px';
                if (fixedLeft === null) {
                    fixedLeft = Math.max(6, Math.min(window.scrollX + rect.right - box.offsetWidth,
                        window.scrollX + document.documentElement.clientWidth - box.offsetWidth - 10));
                }
                box.style.left = fixedLeft + 'px';
            };
            place();

            box.querySelectorAll('a[data-key]').forEach(link => link.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const id = link.getAttribute('data-key');
                keyCapture = (keyCapture === id) ? null : id; // zweiter Klick bricht ab
                repaintKeyCaps();
            }));

            box.querySelectorAll('a[data-cfg]').forEach(link => link.addEventListener('click', () => {
                if (link.closest('.cb_wh_lineoff')) return; // ausgegraute Zeile ist gesperrt
                const key = link.getAttribute('data-cfg');
                const patch = {};
                patch[key] = link.getAttribute('data-value');
                saveSettings(patch);
                if (key === 'cal_collapsed') resetCalOpen(true); // gemerkten Zustand verwerfen
                if (key === 'cal_remember') resetCalOpen(false);
                if (key === 'week_view') { // Sperre der Einklapp-Option nachziehen
                    const monthNow = viewMode() === 'month';
                    const pill = box.querySelector('a[data-cfg="cal_collapsed_mode"]');
                    const row = pill ? pill.closest('.cb_wh_cfgline') : null;
                    if (row) {
                        row.classList.toggle('cb_wh_lineoff', !monthNow);
                        row.setAttribute('title', monthNow
                            ? 'In der Monats-Ansicht: eingeklappt nur die aktuelle Woche, ausgeklappt der ganze Monat'
                            : 'Nur in der Monats-Übersicht einstellbar');
                        const pills = row.querySelector('.cb_wh_pills');
                        if (pills) pills.classList.toggle('cb_wh_pillsoff', !monthNow);
                    }
                }
                box.querySelectorAll('a[data-cfg="' + key + '"]').forEach(other => {
                    if (other === link) other.classList.add('cb_wh_act'); else other.classList.remove('cb_wh_act');
                });
                render();
                place();
            }));

            const applyNumber = (input, key, fallback) => {
                const value = numOr(input.value, 0);
                if (!value) { input.value = cbWhFmtDec(fallback); return; }
                const patch = {};
                patch[key] = value;
                saveSettings(patch);
                input.value = cbWhFmtDec(value);
                render();
                place();
            };
            const weekInput = box.querySelector('.cb_wh_cfg_week');
            const dayInput = box.querySelector('.cb_wh_cfg_day');
            const untilInput = box.querySelector('.cb_wh_cfg_until');
            weekInput.addEventListener('change', () => applyNumber(weekInput, 'week_hours', cfg().weekHours));
            dayInput.addEventListener('change', () => applyNumber(dayInput, 'absence_day_hours', cfg().dayHours));
            untilInput.addEventListener('change', () => applyNumber(untilInput, 'week_until_hours', cfg().untilHours));
            [weekInput, dayInput, untilInput].forEach(input => input.addEventListener('keydown', event => {
                if (event.key === 'Enter') { event.preventDefault(); input.blur(); }
            }));

            setTimeout(() => { // erst danach lauschen, sonst schliesst der eigene Klick das Popup direkt
                const close = (event) => {
                    if (box.contains(event.target)) return;
                    box.remove();
                    anchor.classList.remove('cb_wh_open');
                    document.removeEventListener('click', close);
                };
                document.addEventListener('click', close);
            }, 0);
        };

        // ── Sync-Tab für absence.io öffnen und auf neue Daten warten ──
        let syncTimer = null;
        const startSync = () => {
            if (!cbWhHasGm()) {
                cbWhToast('Dafür werden im Script-Header @grant GM_setValue und GM_getValue gebraucht', false);
                return;
            }
            const icon = document.querySelector('#' + PANEL_ID + ' .cb_wh_sync');
            if (icon) icon.classList.add('cb_wh_spin');
            const before = (cbWhGmGet(ABSENCE_KEY, null) || {}).ts || 0;
            window.open('https://app.absence.io/#/mycalendar', 'cb_absence_sync'); // schließt sich selbst wieder
            let tries = 0;
            clearInterval(syncTimer);
            syncTimer = setInterval(() => {
                tries++;
                const now = (cbWhGmGet(ABSENCE_KEY, null) || {}).ts || 0;
                if (now > before) {
                    clearInterval(syncTimer);
                    if (icon) icon.classList.remove('cb_wh_spin');
                    render();
                    cbWhToast('Abwesenheiten aktualisiert', true);
                } else if (tries > 30) {
                    clearInterval(syncTimer);
                    if (icon) icon.classList.remove('cb_wh_spin');
                    cbWhToast('Keine neuen Daten - ist der absence.io-Login noch aktiv?', false);
                }
            }, 1000);
        };

        // ── Events an das gerenderte Panel hängen ──
        const bindEvents = (panel) => {
            dayCells(panel).forEach(cell => {
                cell.addEventListener('click', event => {
                    event.preventDefault();
                    if (dragSkipClick) return; // gerade wurde eine Mehrfach-Auswahl abgeschlossen
                    openDayMenu(cell);
                });
                cell.addEventListener('mousedown', event => { // Start einer moeglichen Drag-Auswahl
                    if (event.button !== 0) return;
                    event.preventDefault(); // verhindert das Markieren von Text beim Ziehen
                    dragAdd = event.ctrlKey || event.metaKey; // Strg/Cmd -> Auswahl erweitern
                    if (dragAdd) document.querySelectorAll('.cb_wh_menu').forEach(old => old.remove()); // Auswahl behalten
                    else closeMenus();
                    dragging = true;
                    dragMoved = false;
                    dragFrom = cell.getAttribute('data-iso');
                    dragTo = dragFrom;
                    const cal = cell.parentNode;
                    if (cal && cal.classList && cal.classList.contains('cb_wh_cal')) cal.classList.add('cb_wh_drag');
                    paintPick();
                });
                cell.addEventListener('mouseenter', () => { // Auswahl mitziehen
                    if (!dragging) return;
                    const iso = cell.getAttribute('data-iso');
                    if (!iso || iso === dragTo) return;
                    dragTo = iso;
                    dragMoved = true;
                    paintPick();
                });
            });
            if (!dragBound) { // nur einmal pro Seitenaufruf
                dragBound = true;
                document.addEventListener('mouseup', () => {
                    if (!dragging) return;
                    dragging = false;
                    const isos = pickedIsos(); // Tage im gerade gezogenen Bereich
                    const openMenu = () => {
                        dragSkipClick = true;
                        setTimeout(() => { dragSkipClick = false; }, 0);
                        paintPick();
                        openRangeMenu(pickSet.slice());
                    };
                    if (dragAdd) { // Strg: einzelnen Tag umschalten bzw. Bereich dazunehmen
                        if (dragMoved) isos.forEach(iso => { if (pickSet.indexOf(iso) < 0) pickSet.push(iso); });
                        else togglePick(dragFrom);
                        pickSet.sort();
                        dragFrom = null;
                        dragTo = null;
                        dragSkipClick = true; // auch beim Abwaehlen kein Tages-Menü
                        setTimeout(() => { dragSkipClick = false; }, 0);
                        if (pickSet.length) openMenu(); else clearPick();
                    } else if (dragMoved && isos.length > 1) {
                        pickSet = isos.slice();
                        dragFrom = null;
                        dragTo = null;
                        openMenu();
                    } else {
                        clearPick(); // Einzelklick -> das normale Tages-Menü uebernimmt
                    }
                    dragMoved = false;
                    dragAdd = false;
                });
            }
            const navLink = (selector, action) => { // Blättern: deaktivierte Pfeile bleiben stumm
                const link = panel.querySelector(selector);
                if (!link || link.classList.contains('cb_wh_off')) return;
                link.addEventListener('click', event => { event.preventDefault(); closeMenus(); action(); render(); });
            };
            navLink('.cb_wh_prev', () => { navSlide = -1; shiftNav(-1); });
            navLink('.cb_wh_next', () => { navSlide = 1; shiftNav(1); });
            navLink('.cb_wh_now', () => { // Richtung danach, wo wir herkommen
                navSlide = (navDate && navDate < new Date()) ? 1 : -1;
                navDate = null;
            });
            const hoursInput = panel.querySelector('.cb_wh_h');
            const submit = (sign) => {
                const value = parseHours(hoursInput.value);
                if (value === null || value === 0) { cbWhToast('Bitte Stunden angeben, z.B. 1,5 oder 0:30', false); return; }
                addManual(sign * Math.abs(value));
            };
            panel.querySelector('.cb_wh_plus').addEventListener('click', () => submit(1));
            panel.querySelector('.cb_wh_minus').addEventListener('click', () => submit(-1));
            [hoursInput, panel.querySelector('.cb_wh_note')].forEach(input => {
                input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); submit(1); } });
            });
            panel.querySelectorAll('.cb_wh_del').forEach(link => link.addEventListener('click', () => {
                const index = parseInt(link.getAttribute('data-index'), 10);
                if (link.getAttribute('data-carry') === '1') { // Übertrag aus einer alten Woche loeschen
                    const state = carryLoad();
                    state.items.splice(index, 1);
                    carrySave(state);
                    render();
                    return;
                }
                const key = link.getAttribute('data-week');
                const store = lsGet(MANUAL_KEY, {});
                const list = store[key] || [];
                list.splice(index, 1);
                if (list.length) store[key] = list; else delete store[key];
                lsSet(MANUAL_KEY, store);
                render();
            }));
        };


        // ── Tastendruck ausführen ──
        const runKeyAction = (id) => {
            if (id === 'nav_prev' || id === 'nav_next') {
                const step = id === 'nav_prev' ? -1 : 1;
                if (!canShift(step)) return;
                closeMenus();
                navSlide = step;
                shiftNav(step);
                render();
                return;
            }
            if (id === 'nav_today') {
                if (isCurrentPeriod()) return;
                closeMenus();
                navSlide = (navDate && navDate < new Date()) ? 1 : -1;
                navDate = null;
                render();
                return;
            }
            if (id === 'view_toggle') {
                closeMenus();
                saveSettings({ week_view: viewMode() === 'month' ? 'week' : 'month' });
                render();
                return;
            }
            if (id === 'cal_toggle') {
                closeMenus();
                toggleCal();
                render();
            }
        };

        const onPanelKey = (event) => {
            if (!document.getElementById(PANEL_ID)) return;

            if (keyCapture) { // gerade wird eine neue Taste gesucht
                event.preventDefault();
                event.stopPropagation();
                const action = keyCapture;
                keyCapture = null;
                if (event.key !== 'Escape') {
                    const map = keyMap();
                    const value = (event.key === 'Backspace' || event.key === 'Delete') ? '' : event.key;
                    if (value) { // dieselbe Taste nicht zweimal belegen
                        Object.keys(map).forEach(id => { if (id !== action && sameKey(map[id], value)) map[id] = ''; });
                    }
                    map[action] = value;
                    saveSettings({ keys: map });
                }
                repaintKeyCaps();
                return;
            }

            const target = event.target;
            const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return; // Eingaben haben Vorrang
            if (target && target.isContentEditable) return;
            if (event.ctrlKey || event.metaKey || event.altKey) return;

            const map = keyMap();
            const hit = Object.keys(map).filter(id => sameKey(map[id], event.key))[0];
            if (!hit) return;
            event.preventDefault();
            runKeyAction(hit);
        };
        document.addEventListener('keydown', onPanelKey);

        // ── Panel in die Filter-Spalte hängen ──
        const buildPanel = () => {
            if (document.getElementById(PANEL_ID)) return true;
            const table = document.querySelector('table[id^="datagrid_table_"]');
            const row = table ? table.closest('.row') : null;
            const column = row ? row.querySelector('.col-md-3') : null;
            const fallback = document.querySelector('#list') || document.querySelector('.container');
            if (!column && !fallback) return false;
            injectCss();
            const panel = document.createElement('div');
            panel.id = PANEL_ID;
            panel.className = 'panel panel-default';
            if (!column) panel.style.maxWidth = '360px';
            panel.innerHTML = '<div class="panel-heading"><h3 class="panel-title">Arbeitsstunden'
                + '<small class="cb_wh_kw"></small>'
                + '<span class="cb_wh_actions">'
                +     '<a class="cb_wh_copy glyphicon glyphicon-duplicate" title="Zusammenfassung in die Zwischenablage kopieren"></a>'
                +     '<a class="cb_wh_sync glyphicon glyphicon-refresh" title="Abwesenheiten aus absence.io holen"></a>'
                +     '<a class="cb_wh_cfg glyphicon glyphicon-cog" title="Anzeige-Einstellungen"></a>'
                + '</span>'
                + '</h3></div><div class="panel-body"></div>';
            const target = column || fallback;
            target.insertBefore(panel, target.firstChild);
            panel.querySelector('.cb_wh_copy').addEventListener('click', (event) => { event.preventDefault(); copySummary(); });
            panel.querySelector('.cb_wh_sync').addEventListener('click', () => startSync());
            panel.querySelector('.cb_wh_cfg').addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                openCfgMenu(event.currentTarget);
            });
            return true;
        };

        const refresh = () => {
            if (!buildPanel()) return; // Panel (noch) nicht baubar -> naechster Versuch
            readTable();
            render();
        };

        // ── Start: Panel aufbauen, bei AJAX-Updates der Tabelle neu rechnen ──
        refresh();
        let debounce = null;
        const schedule = (delay) => { clearTimeout(debounce); debounce = setTimeout(refresh, delay); };

        const observer = new MutationObserver(mutations => {
            const panel = document.getElementById(PANEL_ID);
            // Soft-Reload (z.B. dailyResultModal auf/zu) ersetzt die Spalte und wirft das Panel raus
            if (!panel || !panel.isConnected) { schedule(50); return; }
            // eigene Popups und Toasts haengen an document.body – die sind keine fremde
            // Aenderung und duerfen kein Neu-Rendern ausloesen (sonst ist die Auswahl weg)
            const ours = (node) => !!(node && node.nodeType === 1 && node.classList
                && (node.classList.contains('cb_wh_menu') || node.classList.contains('cb_wh_toast')));
            const outside = mutations.some(entry => {
                if (panel === entry.target || panel.contains(entry.target)) return false;
                const nodes = Array.prototype.slice.call(entry.addedNodes)
                    .concat(Array.prototype.slice.call(entry.removedNodes));
                if (nodes.length && nodes.every(ours)) return false;
                return true;
            });
            if (!outside) return; // eigene Renderings ignorieren
            schedule(250);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Sicherheitsnetz: falls nach einem Soft-Reload keine Mutationen mehr folgen
        setInterval(() => { if (!document.getElementById(PANEL_ID)) refresh(); }, 1500);
        setInterval(paintUntil, 20000); // "bis HH:MM" mitlaufen lassen, ohne das Panel neu zu bauen

        setTimeout(refresh, 1200); // die settings kommen erst kurz nach dem Start aus dem localStorage
        setTimeout(refresh, 3000);

        try { // andere Tabs (z.B. der Sync-Tab) melden neue Abwesenheiten
            if (typeof GM_addValueChangeListener === 'function') {
                GM_addValueChangeListener(ABSENCE_KEY, () => render());
            }
        } catch (e) {}

        if (settings.absence_auto_sync) { // optional: Abwesenheiten selbst nachladen
            setTimeout(() => {
                const cached = cbWhGmGet(ABSENCE_KEY, null);
                if (cbWhHasGm() && (!cached || (Date.now() - (cached.ts || 0)) > 12 * 3600000)) startSync();
            }, 2500);
        }
    })();
    // ─────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────
    // ─── Telefon: Amtsholung, 3CX-Anruf & Telefon-Notiz ──────────────────────
    // 1. Firma und Brand bekommen klein "(Vorwahl: X)" aus der Amtsholungs-Liste
    //    angehängt. Ein Klick auf die Anzeige setzt einen eigenen Wert (falls
    //    eine Firmierung mal anders in IPSI steht als in der Liste).
    // 2. "Telefon:" und "Handy:" in den Vertragsdaten werden zu Anruflinks:
    //    ein tel:-Link, für den die 3CX-App unter Windows registriert ist.
    //    Gewählt wird Amtsholung der Brand + Nummer ohne Schrägstriche,
    //    Leerzeichen und Klammern. Daneben sitzt ein Copy-Icon wie bei den
    //    Website-Materialien (Shift+Klick kopiert die Wählnummer inkl. Amt).
    // 3. Nach dem Klick läuft unten links eine Leiste mit Startzeit und Dauer
    //    und darüber klappt der Notizzettel auf: Brand, Kundenfirma, Ansprech-
    //    partner, Ort, E-Mail, Nummer – plus ein Feld für Notizen während des
    //    Gesprächs. Der Zettel schwebt (kein Modal), ist verschiebbar und
    //    blockiert IPSI nicht.
    // 4. "Beenden & notieren" in der Leiste legt in der Kundenkommunikation
    //    eine Telefon-Notiz an bzw. hängt den Eintrag
    //    unter den letzten Eintrag einer bestehenden eigenen Telefon-Notiz:
    //    Datum, Uhrzeit, Nummer und dahinter die Doku aus dem Zettel. Bei
    //    mehreren eigenen Telefon-Notizen kommt vorher eine Übersicht.
    (() => {
        if (!/^\/(project|contract)\/detailed\//.test(location.pathname)) return;

        // ── Amtsholungs-Liste ──────────────────────────────────────────────
        // Werte laut Amtsholungs-Übersicht. Eigene Ergänzungen/Korrekturen
        // landen in settings.phone_prefixes und haben immer Vorrang.
        const PREFIX_LIST = {
            'wwwe GmbH': '0',
            'Euroweb': '1',
            'United Media AG': '2',
            'Internet Online Media GmbH': '3',
            'WN Online-Service GmbH & Co. KG': '4',
            'Westfalen-Blatt OnlineService': '5',
            'STZ Online-Service GmbH': '6',
            'um united media Switzerland AG': '7',
            'reeach by Onlane GmbH': '8',
            'Pkw.de Digital Mobility Solutions GmbH': '9',
            'Maxworker Verwaltungs GmbH': '11',
            'vertical IT-Service GmbH': '12',
            'net365': '16',
        };

        const PREFIX_CLASS = 'cb_vorwahl';
        const LINK_CLASS = 'cb_tel_link';
        const COPY_CLASS = 'cb_tel_copy';
        const BAR_ID = 'cb_call_bar';
        const PANEL_ID = 'cb_call_panel';
        const PICKER_ID = 'cb_phone_picker';
        const CALL_STORE = 'cb_phone_call_' + (typeof storage_key === 'string' ? storage_key : location.pathname);

        // Rechtsformen fliegen beim Vergleich raus, Ortsangaben bleiben drin –
        // sonst wäre "United Media AG" nicht von der Schweizer Brand zu trennen.
        const LEGAL_FORMS = ['gmbh', 'ag', 'mbh', 'kg', 'kgaa', 'co', 'ohg', 'ug', 'gbr', 'ev', 'se', 'ltd', 'inc', 'llc', 'sa', 'srl', 'bv', 'nv'];

        const nameTokens = (value) => String(value || '')
            .toLowerCase()
            .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(token => token && LEGAL_FORMS.indexOf(token) === -1);

        const prefixTable = () => Object.assign({}, PREFIX_LIST, settings.phone_prefixes || {});

        // Beste Übereinstimmung: alle Wörter des Listen-Eintrags müssen im
        // IPSI-Namen stecken. "United Media AG Deutschland" trifft damit
        // "United Media AG", nicht die Schweizer Brand. Der längste Treffer
        // gewinnt, damit "um united media Switzerland AG" Vorrang hat.
        const lookupPrefix = (name) => {
            const words = nameTokens(name);
            if (!words.length) return null;
            let best = null;
            Object.keys(prefixTable()).forEach(key => {
                const value = prefixTable()[key];
                if (value === '' || value === null || value === undefined) return;
                const keyWords = nameTokens(key);
                if (!keyWords.length) return;
                if (!keyWords.every(word => words.indexOf(word) !== -1)) return;
                if (!best || keyWords.length > best.score) best = { key: key, value: String(value).trim(), score: keyWords.length };
            });
            return best;
        };

        // ── Panels, in denen Firma/Brand/Telefon/Handy stehen ──────────────
        // Projekt-Seite: Firma/Brand im Info-Panel, Telefon/Handy im separaten
        // Vertragsdaten-Panel. Vertrags-Seite: alles im Info-Panel.
        const scopes = () => {
            const list = [];
            const info = document.getElementById(INFO_PANEL_ID);
            if (info) list.push(info);
            document.querySelectorAll('.panel .panel-title').forEach(title => {
                if ((title.textContent || '').trim().toLowerCase().indexOf('vertragsdaten') !== 0) return;
                const panel = title.closest('.panel');
                if (panel && list.indexOf(panel) === -1) list.push(panel);
            });
            return list;
        };

        const labelRows = (names) => {
            const rows = [];
            scopes().forEach(scope => {
                scope.querySelectorAll('p > b').forEach(bold => {
                    const label = (bold.textContent || '').replace(/\s+/g, ' ').trim().replace(/:\s*$/, '').toLowerCase();
                    if (names.indexOf(label) === -1) return;
                    if (rows.some(row => row.bold === bold)) return;
                    rows.push({ bold: bold, p: bold.parentElement, label: label });
                });
            });
            return rows;
        };

        // Firmierung steht im title/alt des Logos, nicht als Text.
        const companyName = (p) => {
            const img = p.querySelector('img');
            if (img) return (img.getAttribute('title') || img.getAttribute('alt') || '').trim();
            return (p.textContent || '').replace(/^[^:]*:\s*/, '').trim();
        };

        const escapeText = (value) => String(value || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // ── Kundendaten für den Notizzettel ────────────────────────────────
        // Die Copy-Buttons sammeln Firma, Ansprechpartner und Ort beim
        // Seitenaufruf schon in den lokalen Speicher; nur falls dort noch
        // nichts steht, wird der Kundenblock der Vertragsdaten direkt gelesen.
        const storedProject = () => {
            try { return JSON.parse(localStorage.getItem(storage_key) || 'null') || {}; } catch (e) { return {}; }
        };

        const clientLines = () => { // "Firma / Ansprechpartner / Straße / Ort"
            const mail = labelRows(['e-mail', 'email'])[0];
            let paragraph = null;
            if (mail) {
                const row = mail.p.closest('.row');
                if (row) paragraph = row.querySelector('p');
            }
            if (!paragraph) { // ohne E-Mail-Zeile: der Absatz ohne <b> mit mehreren <br>
                scopes().some(scope => {
                    paragraph = Array.prototype.slice.call(scope.querySelectorAll('.row p'))
                        .find(item => !item.querySelector('b') && item.querySelectorAll('br').length >= 2) || null;
                    return !!paragraph;
                });
            }
            if (!paragraph) return [];
            return (paragraph.innerText || '').split('\n').map(line => line.trim()).filter(Boolean);
        };

        const callInfo = () => {
            const stored = storedProject();
            const lines = clientLines();
            const brandRow = labelRows(['brand'])[0];
            return {
                brand: stored.project_brand || (brandRow ? companyName(brandRow.p) : ''),
                company: stored.client_brand || lines[0] || '', // Firma des Kunden
                contact: stored.client_name || lines[1] || '', // Ansprechpartner
                location: stored.client_location || lines[3] || '',
                email: stored.client_email || '',
            };
        };

        // ── "(Vorwahl: X)" neben Firma und Brand ───────────────────────────
        const renderPrefixBadges = () => {
            if (!settings.phone_prefix_show) return;
            labelRows(['firma', 'brand']).forEach(row => {
                if (row.p.querySelector('.' + PREFIX_CLASS)) return;
                const name = companyName(row.p);
                if (!name) return;
                const hit = lookupPrefix(name);
                const badge = document.createElement('small');
                badge.className = PREFIX_CLASS + (hit ? '' : ' ' + PREFIX_CLASS + '_missing');
                badge.textContent = hit ? '(Vorwahl: ' + hit.value + ')' : '(Vorwahl: ?)';
                badge.dataset.cbName = name;
                badge.title = hit
                    ? 'Amtsholung ' + hit.value + ' – hinterlegt als "' + hit.key + '". Klick: eigenen Wert für "' + name + '" setzen.'
                    : 'Für "' + name + '" ist keine Amtsholung hinterlegt. Klick: Wert eintragen.';
                badge.addEventListener('click', () => editPrefix(name));
                row.p.appendChild(document.createTextNode(' '));
                row.p.appendChild(badge);
            });
        };

        const editPrefix = (name) => {
            const current = lookupPrefix(name);
            const answer = window.prompt('Amtsholung für "' + name + '" (leer = Eintrag entfernen):', current ? current.value : '');
            if (answer === null) return;
            const map = Object.assign({}, settings.phone_prefixes || {});
            if (answer.trim() === '') delete map[name];
            else map[name] = answer.trim();
            saveSettings({ phone_prefixes: map });
            resetRendering();
            refresh();
            showNotification('Amtsholung aktualisiert');
        };

        // ── Nummern aufbereiten ────────────────────────────────────────────
        const dialPrefix = () => { // die Brand entscheidet, wie rausgewählt wird
            const rows = labelRows(['brand', 'firma']);
            const brand = rows.find(row => row.label === 'brand');
            const firma = rows.find(row => row.label === 'firma');
            const hit = (brand && lookupPrefix(companyName(brand.p))) || (firma && lookupPrefix(companyName(firma.p)));
            return hit ? hit.value : null;
        };

        const cleanNumber = (raw) => { // "06251/848080" -> "06251848080"
            // "+49 (0)6251 ..." -> die Null in Klammern wird bei Vorwahl 0049 nicht gewählt
            let digits = String(raw || '').replace(/\(\s*0\s*\)/g, '').replace(/[^\d+]/g, '');
            digits = digits.charAt(0) + digits.slice(1).replace(/\+/g, '');
            if (digits.charAt(0) === '+') {
                const intl = String(settings.phone_intl_prefix === undefined ? '00' : settings.phone_intl_prefix);
                digits = intl + digits.slice(1);
            }
            return digits;
        };

        const dialNumber = (raw) => {
            const number = cleanNumber(raw);
            if (!number) return '';
            const prefix = dialPrefix();
            return (prefix === null ? '' : prefix) + number;
        };

        // Ein Feld kann mehrere Nummern enthalten – am Schrägstrich wird NICHT
        // getrennt, der steckt in der Vorwahl ("06251/848080").
        const splitNumbers = (text) => String(text || '')
            .split(/[;,\n|]+|\s+oder\s+/i)
            .map(part => part.trim())
            .filter(part => part.replace(/\D/g, '').length >= 4);

        const buildLink = (raw, label) => {
            const link = document.createElement('a');
            const dial = dialNumber(raw);
            const scheme = settings.phone_scheme || 'tel';
            link.className = LINK_CLASS;
            link.textContent = raw;
            link.dataset.cbRaw = raw;
            link.dataset.cbLabel = label;
            if (dial) {
                link.href = scheme + ':' + dial;
                link.title = 'Über 3CX anrufen: ' + dial + (dialPrefix() === null ? ' (ohne Amtsholung – Brand steht nicht in der Liste)' : '');
            } else {
                link.href = '#';
                link.title = 'Keine wählbare Nummer erkannt';
            }
            link.addEventListener('click', event => {
                if (!dial) { event.preventDefault(); return; }
                startCall(raw, dial, label);
            });
            return link;
        };

        const buildCopyIcon = (raw) => {
            const icon = document.createElement('a');
            icon.href = '#';
            icon.className = 'glyphicon glyphicon-copy ' + COPY_CLASS;
            icon.title = 'Nummer kopieren – mit Shift die Wählnummer inkl. Amtsholung';
            icon.addEventListener('click', event => {
                event.preventDefault();
                copyToClipboard(event.shiftKey ? dialNumber(raw) : cleanNumber(raw));
            });
            return icon;
        };

        const renderPhoneRows = () => {
            if (!settings.phone_links) return;
            labelRows(['telefon', 'handy', 'mobil']).forEach(row => {
                if (row.p.querySelector('.' + LINK_CLASS)) return;
                const rest = Array.prototype.slice.call(row.p.childNodes).filter(node => node !== row.bold);
                const raw = rest.map(node => node.textContent).join('').trim();
                if (!raw) return;
                const numbers = splitNumbers(raw);
                if (!numbers.length) return;
                rest.forEach(node => node.remove());
                numbers.forEach((number, index) => {
                    row.p.appendChild(document.createTextNode(index ? ', ' : ' '));
                    row.p.appendChild(buildLink(number, row.label));
                    row.p.appendChild(document.createTextNode(' '));
                    row.p.appendChild(buildCopyIcon(number));
                });
            });
        };

        const resetRendering = () => { // vor einem Neuaufbau alles Eigene entfernen
            document.querySelectorAll('.' + PREFIX_CLASS).forEach(el => el.remove());
            document.querySelectorAll('.' + LINK_CLASS).forEach(link => {
                link.replaceWith(document.createTextNode(link.textContent));
            });
            document.querySelectorAll('.' + COPY_CLASS).forEach(el => el.remove());
        };

        // ── Laufendes Telefonat ────────────────────────────────────────────
        const call = { startedAt: 0, raw: '', dial: '', label: '', notes: '', panelOpen: false, timer: 0 };

        const storeCall = () => {
            try {
                if (!call.startedAt) sessionStorage.removeItem(CALL_STORE);
                else sessionStorage.setItem(CALL_STORE, JSON.stringify({ startedAt: call.startedAt, raw: call.raw, dial: call.dial, label: call.label, notes: call.notes, panelOpen: call.panelOpen }));
            } catch (e) {}
        };

        const restoreCall = () => { // ein Reload während des Telefonats darf die Startzeit nicht verlieren
            try {
                const stored = JSON.parse(sessionStorage.getItem(CALL_STORE) || 'null');
                if (stored && stored.startedAt) Object.assign(call, stored);
            } catch (e) {}
        };

        const two = (value) => (value < 10 ? '0' : '') + value;

        const elapsedText = () => {
            const seconds = Math.max(0, Math.round((Date.now() - call.startedAt) / 1000));
            const hours = Math.floor(seconds / 3600);
            const rest = seconds % 3600;
            return (hours ? hours + ':' + two(Math.floor(rest / 60)) : Math.floor(rest / 60)) + ':' + two(rest % 60);
        };

        const startText = () => {
            const date = new Date(call.startedAt);
            return two(date.getHours()) + ':' + two(date.getMinutes());
        };

        const startCall = (raw, dial, label) => {
            if (!settings.phone_note) return;
            if (call.startedAt && call.raw === raw) return; // Nachwählen derselben Nummer: Startzeit und Notizen behalten
            call.startedAt = Date.now();
            call.raw = raw;
            call.dial = dial;
            call.label = label;
            call.notes = '';
            call.panelOpen = settings.phone_note_panel_auto !== false; // Notizzettel gleich mit aufklappen
            storeCall();
            renderBar();
            startNoteScan(); // dauert ein paar Sekunden – läuft während des Telefonats mit
        };

        const endCall = () => {
            call.startedAt = 0;
            call.notes = '';
            call.panelOpen = false;
            storeCall();
            renderBar();
        };

        const paintBar = () => { // Leiste und Zettel laufen im Sekundentakt mit
            if (!call.startedAt) return;
            const bar = document.getElementById(BAR_ID);
            if (bar) bar.querySelector('.cb_call_meta').textContent = call.raw + ' · ab ' + startText() + ' Uhr · ' + elapsedText();
            const time = document.querySelector('#' + PANEL_ID + ' .cb_call_panel_time');
            if (time) time.textContent = 'ab ' + startText() + ' Uhr · ' + elapsedText();
        };

        const renderBar = () => {
            let bar = document.getElementById(BAR_ID);
            if (!call.startedAt) {
                if (bar) bar.remove();
                if (call.timer) { clearInterval(call.timer); call.timer = 0; }
                renderPanel();
                return;
            }
            if (!bar) {
                bar = document.createElement('div');
                bar.id = BAR_ID;
                bar.innerHTML = '<span class="cb_call_dot"></span>'
                    + '<span class="cb_call_text"><b>Telefonat läuft</b><span class="cb_call_meta"></span></span>'
                    + '<button type="button" class="btn btn-default btn-xs cb_call_zettel" title="Notizzettel mit den Kundendaten ein-/ausblenden"><span class="glyphicon glyphicon-pencil"></span></button>'
                    + '<button type="button" class="btn btn-primary btn-xs cb_call_done" title="Telefonat beenden und die Telefon-Notiz in der Kundenkommunikation anlegen bzw. ergänzen">Beenden &amp; notieren</button>'
                    + '<button type="button" class="close cb_call_cancel" title="Telefonat ohne Notiz verwerfen">×</button>';
                document.body.appendChild(bar);
                bar.querySelector('.cb_call_zettel').addEventListener('click', () => {
                    call.panelOpen = !call.panelOpen; // zweiter Klick klappt den Zettel wieder zu
                    storeCall();
                    renderPanel();
                });
                bar.querySelector('.cb_call_done').addEventListener('click', () => finishCall());
                bar.querySelector('.cb_call_cancel').addEventListener('click', () => endCall());
            }
            paintBar();
            renderPanel();
            if (!call.timer) call.timer = setInterval(paintBar, 1000);
        };

        // ── Notizzettel zum laufenden Telefonat ────────────────────────────
        // Absichtlich kein Modal mit Backdrop: der Zettel schwebt, damit IPSI
        // während des Gesprächs bedienbar bleibt. Verschieben am Kopf.
        const panelNotes = () => {
            const area = document.querySelector('#' + PANEL_ID + ' .cb_call_notes');
            return area ? area.value : (call.notes || '');
        };

        const panelPosition = () => {
            try { return JSON.parse(localStorage.getItem('cb_phone_panel_pos') || 'null'); } catch (e) { return null; }
        };

        const makeDraggable = (panel, handle) => {
            let fromX = 0, fromY = 0, left = 0, bottom = 0, dragging = false;
            const onMove = (event) => {
                if (!dragging) return;
                panel.style.left = Math.max(4, left + (event.clientX - fromX)) + 'px';
                panel.style.bottom = Math.max(4, bottom - (event.clientY - fromY)) + 'px';
            };
            const onUp = () => {
                if (!dragging) return;
                dragging = false;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                try { localStorage.setItem('cb_phone_panel_pos', JSON.stringify({ left: panel.style.left, bottom: panel.style.bottom })); } catch (e) {}
            };
            handle.addEventListener('mousedown', event => {
                if (event.target.closest('button')) return;
                const box = panel.getBoundingClientRect();
                fromX = event.clientX;
                fromY = event.clientY;
                left = box.left;
                bottom = window.innerHeight - box.bottom;
                dragging = true;
                event.preventDefault();
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        };

        const renderPanel = () => {
            let panel = document.getElementById(PANEL_ID);
            if (!call.startedAt || !call.panelOpen) {
                if (panel) {
                    if (call.startedAt) call.notes = panel.querySelector('.cb_call_notes').value; // nur zugeklappt: Text behalten
                    panel.remove();
                }
                return;
            }
            if (panel) { paintBar(); return; }

            const info = callInfo();
            const fact = (label, value) => (value ? '<dt>' + escapeText(label) + '</dt><dd>' + escapeText(value) + '</dd>' : '');
            const number = call.raw + (call.dial && call.dial !== call.raw ? ' (wählt ' + call.dial + ')' : '');

            panel = document.createElement('div');
            panel.id = PANEL_ID;
            panel.innerHTML = '<div class="cb_call_panel_head">'
                + '<b>Telefonat</b>'
                + '<span class="cb_call_panel_time"></span>'
                + '<button type="button" class="close cb_call_panel_hide" title="Zettel zuklappen – das Telefonat läuft weiter">×</button>'
                + '</div>'
                + '<dl class="cb_call_facts">'
                + fact('Brand', info.brand)
                + fact('Kunde', info.company)
                + fact('Ansprechpartner', info.contact)
                + fact('Ort', info.location)
                + fact('E-Mail', info.email)
                + fact(call.label === 'handy' ? 'Handy' : 'Telefon', number)
                + '</dl>'
                + '<label class="cb_call_notes_label">Notizen zum Telefonat</label>'
                + '<textarea class="cb_call_notes" placeholder="Was wurde besprochen? Der Text landet hinter Datum, Uhrzeit und Nummer in der Telefon-Notiz."></textarea>';
            document.body.appendChild(panel);

            const saved = panelPosition(); // zuletzt hingeschobene Position
            if (saved && saved.left) { panel.style.left = saved.left; panel.style.bottom = saved.bottom; }

            const area = panel.querySelector('.cb_call_notes');
            area.value = call.notes || '';
            let queued = 0;
            area.addEventListener('input', () => {
                call.notes = area.value;
                clearTimeout(queued);
                queued = setTimeout(storeCall, 300); // übersteht einen Reload mitten im Gespräch
            });

            panel.querySelectorAll('.cb_call_panel_hide').forEach(button => button.addEventListener('click', () => {
                call.notes = area.value;
                call.panelOpen = false;
                storeCall();
                renderPanel();
            }));
            makeDraggable(panel, panel.querySelector('.cb_call_panel_head'));
            paintBar();
        };

        // ── Notiz-Zeile ────────────────────────────────────────────────────
        const noteLine = (doku) => {
            const date = new Date(call.startedAt || Date.now());
            const template = settings.phone_note_line || '{datum}, {zeit} Uhr – {nummer} | {doku}';
            const text = String(doku || '').trim();
            const values = {
                '{datum}': two(date.getDate()) + '.' + two(date.getMonth() + 1) + '.' + date.getFullYear(),
                '{zeit}': two(date.getHours()) + ':' + two(date.getMinutes()),
                '{nummer}': call.raw || '',
                '{waehlnummer}': call.dial || '',
                '{dauer}': elapsedText(),
                '{label}': call.label === 'handy' ? 'Handy' : 'Telefon',
                '{doku}': text,
            };
            const hasSlot = template.indexOf('{doku}') !== -1;
            const line = Object.keys(values).reduce((acc, key) => acc.split(key).join(values[key]), template);
            return hasSlot || !text ? line : line + text; // gespeicherte Einstellung ohne {doku}: Doku hinten anhängen
        };

        // ── Kundenkommunikation: Panel, Grid, eigene Telefon-Notizen ───────
        const commPanel = () => document.getElementById('customer-communications');
        const commGrid = () => {
            const panel = commPanel();
            return panel ? panel.querySelector('table[id^="datagrid_table_"]') : null;
        };
        const gridHash = () => {
            const grid = commGrid();
            const match = grid && grid.id.match(/^datagrid_table_(.+)$/);
            return match ? match[1] : '';
        };
        const contractNumber = () => {
            const link = document.getElementById('customerCommunicationManage');
            const match = link && (link.getAttribute('href') || '').match(/\/contract\/(\d+)\//);
            return match ? match[1] : '';
        };
        const loginName = () => {
            const el = document.querySelector('.userIdentity .userName');
            return ((el && el.textContent) || '').trim().toLowerCase();
        };

        const rowsFrom = (root, page) => {
            const grid = root.querySelector('table[id^="datagrid_table_"]');
            if (!grid) return [];
            return Array.prototype.slice.call(grid.querySelectorAll('tbody tr')).map(tr => {
                const cells = tr.children;
                const edit = cells[0] ? cells[0].querySelector('a.contractNoticeManage[href]') : null;
                return {
                    type: ((cells[1] && cells[1].textContent) || '').trim(),
                    content: ((cells[2] && cells[2].textContent) || '').replace(/\s+/g, ' ').trim(),
                    user: ((cells[4] && cells[4].textContent) || '').trim().toLowerCase(),
                    date: ((cells[5] && cells[5].textContent) || '').replace(/\s+/g, ' ').trim(),
                    href: edit ? edit.getAttribute('href') : '',
                    page: page,
                };
            });
        };

        const isOwnPhoneNote = (row) => row.type === 'Telefon' && !!row.href && !!loginName() && row.user === loginName();

        const perPageSelect = () => document.querySelector('select[name="datagrid_select_' + gridHash() + '"]');

        // Das Panel lädt seine Seiten per POST nach – so lassen sich alle Seiten
        // im Hintergrund durchsuchen. Wichtig: Seitenzahl und Einträge-pro-Seite
        // NICHT in einem Request mischen, sonst landet man immer auf Seite 1.
        // Der Filter (communicationType/-Service) wird dabei nie angefasst –
        // der sitzt serverseitig in der Session und würde sonst hängen bleiben.
        const commPost = (body) => {
            const contract = contractNumber();
            if (!gridHash() || !contract) return Promise.resolve(null);
            return fetch('/contract/' + contract + '/customer/communications', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                body: body,
            })
                .then(response => (response.ok ? response.text() : ''))
                .then(html => (html ? new DOMParser().parseFromString(html, 'text/html') : null))
                .catch(() => null);
        };

        const setCommPerPage = (perPage) => commPost('datagrid_select_' + gridHash() + '=' + perPage); // stellt auch auf Seite 1
        const loadCommPage = (page) => commPost('datagrid_page_' + gridHash() + '=' + page);

        const findOwnPhoneNotes = async () => {
            const found = [];
            const seen = {};
            const collect = (root, page) => rowsFrom(root, page).forEach(row => {
                if (!isOwnPhoneNote(row) || seen[row.href]) return;
                seen[row.href] = true;
                found.push(row);
            });

            const panel = commPanel();
            if (!panel) return found;
            if (!settings.phone_note_scan) { collect(panel, 1); return found; }

            const original = perPageSelect() ? perPageSelect().value : '5';
            const first = await setCommPerPage(15);
            if (!first) { collect(panel, 1); return found; }
            collect(first, 1);
            const pageNumbers = Array.prototype.slice.call(first.querySelectorAll('[id^="datagrid_page_"] a[data-page]'))
                .map(link => Number(link.getAttribute('data-page')) || 0);
            const lastPage = Math.min(pageNumbers.length ? Math.max.apply(null, pageNumbers) : 1, 40);
            for (let page = 2; page <= lastPage; page++) {
                const doc = await loadCommPage(page);
                if (!doc) break;
                collect(doc, page);
            }
            await setCommPerPage(original); // Seitenzustand des Panels zurückstellen
            return found;
        };

        // Gefundene eigene Telefon-Notizen werden gemerkt, damit der Klick auf
        // "Notiz" nicht auf die Seitensuche warten muss.
        const noteStoreKey = () => 'cb_phone_notes_' + (contractNumber() || 'x');

        const readNoteStore = () => {
            try {
                const list = JSON.parse(localStorage.getItem(noteStoreKey()) || '[]');
                return Array.isArray(list) ? list : [];
            } catch (e) { return []; }
        };

        const writeNoteStore = (list) => {
            try { localStorage.setItem(noteStoreKey(), JSON.stringify(list.slice(0, 20))); } catch (e) {}
        };

        const mergeNoteStore = (rows) => {
            if (!rows.length) return;
            const list = readNoteStore();
            rows.forEach(row => {
                const known = list.find(item => item.href === row.href);
                if (known) Object.assign(known, row);
                else list.push(row);
            });
            writeNoteStore(list);
        };

        const forgetNote = (href) => writeNoteStore(readNoteStore().filter(item => item.href !== href));

        const visibleOwnPhoneNotes = () => {
            const panel = commPanel();
            return panel ? rowsFrom(panel, 1).filter(isOwnPhoneNote) : [];
        };

        let noteScan = null;
        const startNoteScan = () => {
            if (!settings.phone_note_scan) return null;
            if (!commPanel() || !gridHash()) return null; // Panel lädt noch – kein leeres Ergebnis merken
            if (!noteScan) noteScan = findOwnPhoneNotes().then(rows => { writeNoteStore(rows); return rows; });
            return noteScan;
        };

        // ── Modal der Kundenkommunikation ──────────────────────────────────
        const whenCommModalReady = (callback) => { // Inhalt kommt per AJAX nach
            const modal = document.getElementById('customer-communication-manage');
            if (!modal) return;
            let done = false;
            const attempt = () => {
                if (done) return;
                const body = document.getElementById('customer-communication-body');
                if (!modal.classList.contains('in') || !body || !body.querySelector('#notice')) return;
                done = true;
                observer.disconnect();
                clearTimeout(guard);
                setTimeout(() => callback(body), 80);
            };
            const observer = new MutationObserver(attempt);
            observer.observe(modal, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] });
            const guard = setTimeout(() => observer.disconnect(), 15000);
            attempt();
        };

        const setTypeTelefon = (body) => {
            const select = body.querySelector('#type');
            if (!select) return;
            const option = Array.prototype.slice.call(select.options).find(item => (item.textContent || '').trim() === 'Telefon')
                || Array.prototype.slice.call(select.options).find(item => item.value === '117');
            if (!option) return;
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        };

        const fillArea = (area, text) => {
            area.value = text;
            area.dispatchEvent(new Event('input', { bubbles: true }));
            area.dispatchEvent(new Event('change', { bubbles: true }));
            area.focus();
            try { area.setSelectionRange(area.value.length, area.value.length); } catch (e) {}
            area.scrollTop = area.scrollHeight;
        };

        const openNewNote = (line) => {
            const trigger = document.getElementById('customerCommunicationManage');
            if (!trigger) {
                copyToClipboard(line);
                return;
            }
            trigger.click();
            whenCommModalReady(body => {
                setTypeTelefon(body);
                const area = body.querySelector('#notice');
                if (area) fillArea(area, line);
            });
        };

        const editLinkFor = (href) => {
            const panel = commPanel();
            if (!panel) return null;
            return Array.prototype.slice.call(panel.querySelectorAll('a.contractNoticeManage[href]'))
                .find(link => link.getAttribute('href') === href) || null;
        };

        // Liegt die Notiz auf einer anderen Seite des Panels, wird das Grid
        // vorher auf 15 Einträge und die passende Seite umgestellt.
        const showCommPage = (page) => new Promise(resolve => {
            const hash = gridHash();
            const jump = () => {
                const link = document.querySelector('#datagrid_page_' + hash + ' a[data-page="' + page + '"]');
                if (!link) { resolve(); return; } // ohne Link steht das Grid schon auf dieser Seite
                link.click();
                setTimeout(resolve, 1400);
            };
            const select = perPageSelect();
            if (select && select.value !== '15') { // 15 pro Seite = dieselbe Seitenaufteilung wie beim Suchen
                select.value = '15';
                select.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(jump, 1600);
                return;
            }
            jump();
        });

        const openExistingNote = async (note, line) => {
            let link = editLinkFor(note.href);
            if (!link) { // Notiz liegt auf einer anderen Seite des Panels
                await showCommPage(note.page || 1);
                link = editLinkFor(note.href);
            }
            if (!link) { // Notiz existiert nicht mehr -> Merker aufräumen und neu anlegen
                forgetNote(note.href);
                openNewNote(line);
                return;
            }
            try { link.scrollIntoView({ block: 'center' }); } catch (e) {}
            link.click();
            whenCommModalReady(body => {
                setTypeTelefon(body);
                const area = body.querySelector('#notice');
                if (!area) return;
                const existing = area.value.replace(/\s+$/, '');
                fillArea(area, existing ? existing + '\n\n' + line : line);
            });
        };

        // ── Übersicht, wenn mehrere eigene Telefon-Notizen existieren ──────
        const openNotePicker = (notes, line) => {
            if (document.getElementById(PICKER_ID)) return;

            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade in';
            backdrop.id = PICKER_ID + '_backdrop';
            document.body.appendChild(backdrop);

            const picker = document.createElement('div');
            picker.id = PICKER_ID;
            picker.className = 'modal fade';
            picker.style.display = 'block';
            picker.innerHTML = '<div class="modal-dialog modal-sm"><div class="modal-content">'
                + '<div class="modal-header">'
                + '<button type="button" class="close" id="cb_phone_picker_close">×</button>'
                + '<h4 class="modal-title">Telefon-Notiz wählen</h4>'
                + '</div>'
                + '<div class="modal-body" id="cb_phone_picker_list"></div>'
                + '</div></div>';
            document.body.appendChild(picker);
            requestAnimationFrame(() => picker.classList.add('in'));

            const close = () => {
                picker.classList.remove('in');
                document.removeEventListener('keydown', onKey);
                setTimeout(() => { picker.remove(); backdrop.remove(); }, 200);
            };
            const onKey = (event) => { if (event.key === 'Escape') close(); };
            document.addEventListener('keydown', onKey);
            picker.querySelector('#cb_phone_picker_close').addEventListener('click', close);
            backdrop.addEventListener('click', close);

            const list = picker.querySelector('#cb_phone_picker_list');
            notes.forEach(note => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-default btn-block cb_phone_picker_item';
                button.innerHTML = '<b>' + escapeText(note.date) + '</b><br><small>' + escapeText(note.content.slice(0, 90)) + '</small>';
                button.addEventListener('click', () => { close(); openExistingNote(note, line); });
                list.appendChild(button);
            });

            const fresh = document.createElement('button');
            fresh.type = 'button';
            fresh.className = 'btn btn-primary btn-block';
            fresh.textContent = 'Neue Telefon-Notiz';
            fresh.addEventListener('click', () => { close(); openNewNote(line); });
            list.appendChild(fresh);
        };

        const finishCall = async () => {
            const line = noteLine(panelNotes()); // Startzeit + Doku sichern, bevor Leiste und Zettel weg sind
            document.querySelectorAll('.cb_call_done').forEach(button => { button.disabled = true; button.textContent = 'Suche…'; });

            let notes = visibleOwnPhoneNotes();
            const scan = startNoteScan();
            if (scan) {
                const scanned = await scan;
                if (scanned) notes = scanned;
            } else if (!notes.length) {
                notes = readNoteStore();
            }

            endCall();
            if (!notes.length) { openNewNote(line); return; }
            if (notes.length === 1) { openExistingNote(notes[0], line); return; }
            openNotePicker(notes, line);
        };

        // ── CSS ────────────────────────────────────────────────────────────
        const style = document.createElement('style');
        style.textContent = [
            '.' + PREFIX_CLASS + ' { margin-left: 6px; font-size: 85%; color: #888; cursor: pointer; white-space: nowrap; }',
            '.' + PREFIX_CLASS + ':hover { color: #337ab7; }',
            '.' + PREFIX_CLASS + '_missing { color: #c0392b; }',
            '.' + LINK_CLASS + ' { text-decoration: none; border-bottom: 1px dotted currentColor; }',
            '.' + LINK_CLASS + ':hover { text-decoration: none; border-bottom-style: solid; }',
            '.' + COPY_CLASS + ' { margin-left: 6px; font-size: 11px; color: #999; text-decoration: none; opacity: .7; }',
            '.' + COPY_CLASS + ':hover { color: #337ab7; opacity: 1; text-decoration: none; }',
            '#' + BAR_ID + ' { position: fixed; left: 20px; bottom: 20px; z-index: 1060; display: flex; align-items: center;',
            '    gap: 10px; padding: 9px 12px; font-size: 12px; line-height: 1.35; background: #fff; color: #333;',
            '    border: 1px solid #d5d5d5; border-left: 4px solid #5cb85c; border-radius: 4px; box-shadow: 0 6px 18px rgba(0,0,0,.2); }',
            '#' + BAR_ID + ' .cb_call_dot { width: 9px; height: 9px; border-radius: 50%; background: #5cb85c; flex: 0 0 auto;',
            '    animation: cb_call_pulse 1.4s ease-in-out infinite; }',
            '#' + BAR_ID + ' .cb_call_text { display: flex; flex-direction: column; }',
            '#' + BAR_ID + ' .cb_call_meta { color: #777; font-size: 11px; }',
            '#' + BAR_ID + ' .cb_call_cancel { margin-left: 2px; font-size: 18px; line-height: 1; opacity: .5; }',
            '#' + BAR_ID + ' .cb_call_cancel:hover { opacity: .9; }',
            '#' + BAR_ID + ' .btn { flex: 0 0 auto; }',
            // IPSI gibt jedem .btn .glyphicon einen rechten Abstand – im Icon-Button stört der
            '#' + BAR_ID + ' .cb_call_zettel .glyphicon { margin: 0; }',
            '@keyframes cb_call_pulse { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }',
            '#' + PANEL_ID + ' { position: fixed; left: 20px; bottom: 78px; z-index: 1061; width: 340px;',
            '    max-width: calc(100vw - 40px); background: #fff; color: #333; font-size: 12px; line-height: 1.45;',
            '    border: 1px solid #d5d5d5; border-radius: 4px; box-shadow: 0 6px 18px rgba(0,0,0,.2); }',
            '#' + PANEL_ID + ' .cb_call_panel_head { display: flex; align-items: baseline; gap: 8px; padding: 8px 10px;',
            '    background: #f5f5f5; border-bottom: 1px solid #e2e2e2; border-radius: 3px 3px 0 0; cursor: move;',
            '    user-select: none; }',
            '#' + PANEL_ID + ' .cb_call_panel_time { flex: 1 1 auto; color: #777; font-size: 11px; }',
            '#' + PANEL_ID + ' .cb_call_facts { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px;',
            '    margin: 0; padding: 8px 10px; border-bottom: 1px solid #eee; }',
            '#' + PANEL_ID + ' .cb_call_facts dt { color: #999; font-weight: normal; white-space: nowrap; }',
            '#' + PANEL_ID + ' .cb_call_facts dd { margin: 0; word-break: break-word; }',
            '#' + PANEL_ID + ' .cb_call_notes_label { display: block; margin: 8px 10px 4px; color: #999; font-weight: normal; }',
            '#' + PANEL_ID + ' .cb_call_notes { width: calc(100% - 20px); min-height: 90px; margin: 0 10px 10px; padding: 6px 8px;',
            '    font-size: 12px; border: 1px solid #ccc; border-radius: 3px; resize: vertical; }',
            'html.cb_tel_darkmode #' + PANEL_ID + ' { background: #262626; color: #ddd; border-color: #3d3d3d; }',
            'html.cb_tel_darkmode #' + PANEL_ID + ' .cb_call_panel_head { background: #1f1f1f; border-color: #3d3d3d; }',
            'html.cb_tel_darkmode #' + PANEL_ID + ' .cb_call_facts { border-color: #3d3d3d; }',
            'html.cb_tel_darkmode #' + PANEL_ID + ' .cb_call_notes { background: #1f1f1f; color: #ddd; border-color: #3d3d3d; }',
            '#' + PICKER_ID + ' .cb_phone_picker_item { text-align: left; white-space: normal; margin-bottom: 6px; }',
            '#' + PICKER_ID + ' .cb_phone_picker_item small { color: #888; }',
            'html.cb_tel_darkmode #' + BAR_ID + ' { background: #262626; color: #ddd; border-color: #3d3d3d; }',
            'html.cb_tel_darkmode #' + BAR_ID + ' .cb_call_meta { color: #999; }',
            'html.cb_tel_darkmode .' + PREFIX_CLASS + ' { color: #9a9a9a; }',
        ].join('\n');
        document.head.appendChild(style);

        // ── Aufbau & Nachziehen bei DOM-Änderungen ─────────────────────────
        const refresh = () => {
            document.documentElement.classList.toggle('cb_tel_darkmode', !!settings.darkmode);
            renderPrefixBadges();
            renderPhoneRows();
        };

        let pending = 0;
        const schedule = () => {
            clearTimeout(pending);
            pending = setTimeout(refresh, 250);
        };

        restoreCall();
        renderBar();
        if (call.startedAt) setTimeout(startNoteScan, 3000); // Reload mitten im Gespräch: Suche vorwärmen
        refresh();
        // Die Settings kommen erst kurz nach dem Start aus dem localStorage,
        // die Panels teils erst per AJAX – deshalb mehrfach nachziehen.
        setTimeout(refresh, 800);
        setTimeout(refresh, 2500);
        setTimeout(() => mergeNoteStore(visibleOwnPhoneNotes()), 3000); // eigene Telefon-Notizen der ersten Seite merken
        new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    })();
    // ─────────────────────────────────────────────────────────────────────────

    const intervalId = setInterval(checkForElement, 500);
})();
