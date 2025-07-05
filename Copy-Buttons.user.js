// ==UserScript==
// @name         Copy-Buttons
// @namespace    https://github.com/zentolik
// @version      0.88
// @description  doing stuff ʕ·͡ᴥ·ʔ
// @author       Kaan Korkmaz
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=securewebsystems.net
// @updateURL    https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @downloadURL  https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @grant        none
// ==/UserScript==

!(function() { // ʕ·͡ᴥ·ʔ hi & ty <3
    'use strict';
    console.log('ʕ·͡ᴥ·ʔ *bup*');
    let settings = {
        button_position: true, // ändert die position vom btn (wenn auf "false", empfähle ich "copy_icon" zu aktivieren") //
        button_position_space: '20px', // Abstand vom Button nach unten und rechts //
        copy_work_button: true, // Pfad geht bis zu "L:\EDO\ID\WORK\" //
        copy_drive: 'l', // Laufwerk für den Pfad //
        copy_icon: false, // copy-icon als button-text (anstatt des pfades) //
        button_color: 'blue', // red / yellow / blue / cyan / green / gray / #rrggbb (HEX-Color) //
        delete_button: false, // erstellt ein delete-button, der beim klicken die projekt-daten aus dem local storage löscht //
        open_folder: false, // WIP (bitte nicht aktivieren. funktioniert nicht) //
        darkmode: false,
        default_email_client: 'browser',
        department: '',
        user: '',
    };

    const selectors = { // Attribute, zum selektieren der Container
        server_attr: 'data-v-8744275e',
        href_attr: 'data-v-2a36c6f6',
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


    const loadFromLocalStorage = () => { // Funktion, zum laden der Settings, aus dem lokalen Speicher
        const storedData = localStorage.getItem(project_id),
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
            if (storedObject.project_id === project_id) {
                createButtonContainer();
                createSettings();
                createCopyButton(false, false, false, 'copyPath');
                createCopyButton(false, false, false, 'copyClientdata');
                return true;
            }
        }
        return false;
    };

    const checkForElement = () => {
        if (loadFromLocalStorage()) return clearInterval(intervalId);

        const btnPrimary = document.querySelector(`div[${selectors.server_attr}] > button.btn-primary`),
              serverElement = Array.from(document.querySelectorAll(`b[${selectors.dfs_attr}]`)).find(el => el.innerText.toLowerCase().trim() === "server:"),
              firmaElement = Array.from(document.querySelectorAll('#collapseOne .panel-body p b')).find(el => el.innerText.toLowerCase().trim() === "firma:"),
              brandElement = Array.from(document.querySelectorAll('#collapseOne .panel-body p b')).find(el => el.innerText.toLowerCase().trim() === "brand:"),
              typElement = Array.from(document.querySelectorAll('#collapseOne .panel-body p b')).find(el => el.innerText.toLowerCase().trim() === "typ"),
              emailElement = Array.from(document.querySelectorAll('#collapseOne .panel-body p b')).find(el => el.innerText.toLowerCase().trim() === "e-mail:");
        if ((btnPrimary || serverElement) && loopListener) {
            edo = btnPrimary?.innerText.toLowerCase().trim() || edo;

            if (serverElement) {
                const selectElement = serverElement.closest(`tr[${selectors.dfs_attr}]`)?.querySelector(`select[${selectors.dfs_attr}]`);
                selectElement?.addEventListener("input", () => {
                    const selectedOption = selectElement.options[selectElement.selectedIndex]?.innerText.split(' (')[0];
                    document.querySelector(`button.btn-success[${selectors.dfs_attr}]`)?.addEventListener('click', () => {
                        edo = selectedOption.toLowerCase().trim();
                    });
                });
            }

            if (edoList.includes(edo)) {
                let client_id = document.querySelector('h1').textContent.replace(/\D/g, ''),
                    client_domain = document.querySelector(`a[${selectors.href_attr}].text-primary`).textContent,
                    client_data = emailElement.parentElement.parentElement.parentElement.querySelector('p').innerText.split('\n'),
                    client_brand = client_data[0],
                    client_name = client_data[1],
                    client_street = client_data[2],
                    client_location = client_data[3],
                    client_email = emailElement.parentElement.textContent.replace('E-Mail: ',''),
                    project_company = firmaElement.parentElement.querySelector('img').alt,
                    project_brand = brandElement.parentElement.querySelector('img').alt,
                    project_type = typElement.parentElement.textContent.replace('Typ: ','');
                const dataToStore = {
                    client_id,
                    client_domain,
                    client_brand,
                    client_name,
                    client_street,
                    client_location,
                    client_email,
                    edo,
                    project_id,
                    project_company,
                    project_brand,
                    project_type
                };
                localStorage.setItem(project_id, JSON.stringify(dataToStore));

                createButtonContainer();
                createSettings();
                loopListener = false;
                createCopyButton(edo, client_id, client_domain, 'copyPath');
                createCopyButton(edo, client_id, client_domain, 'copyClientdata');

                if (settings.open_folder) {
                    openFolderButton(edo, client_id);
                }

                clearInterval(intervalId);
            }
        }
    };

    const createButtonContainer = () => {
        if (!document.querySelector('.copyBtnContainer')) {
            const container = document.createElement('div');
            const user_bar = document.querySelector('user-bar');
            const casbar = user_bar.shadowRoot.querySelector('.casbar-wrapper');
            const casbar_height = casbar.clientHeight;
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
                localStorage.removeItem(project_id);
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
        const data = JSON.parse(localStorage.getItem(project_id));
        if ((!edo && !client_id && !client_domain || type === 'copyClientdata') && data) {
            client_domain = data.client_domain;
            client_id = data.client_id;
            edo = data.edo;
            project_id = data.project_id;
            let { client_brand, client_email, client_location, client_name, client_street, project_company, project_brand, project_type } = data;
        }
        if (type === 'copyPath') {
            if (!document.querySelector('#copyPath')) {
                copy = settings.copy_work_button ? `${settings.copy_drive.trim().toUpperCase()}:\\${edo}\\${client_id}\\work\\` : `${settings.copy_drive.trim().toUpperCase()}:\\${edo}\\${client_id}`;
                const button = createButton('copyPath', settings.copy_icon ? `btn ${color_class} glyphicon glyphicon-folder-open` : `btn ${color_class}`, settings.copy_icon ? '' : copy);
                button.title = copy;
                setBtnProperties(button);
            }
        }
        if (type === 'copyClientdata') {
            if (!document.querySelector('#copyClientdata') && document.body.classList.contains('otrs_extension_active')) {
                copy = data.client_email;
                const button = createButton('copyClientdata', settings.copy_icon ? `btn ${color_class} glyphicon glyphicon-send` : `btn ${color_class}`, settings.copy_icon ? '' : data.client_email);
                button.title = copy;
                setBtnProperties(button);
                const extendedData = {
                    ...data,
                    department: settings.department || ''
                };
                button.addEventListener('click', () =>
                    window.open(`https://otrs.euroweb.net/index.pl?Action=AgentTicketEmail#${JSON.stringify(extendedData)}`, '_blank')
                );

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

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'label label-success';
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed', right: '20px', zIndex: '999', opacity: '0', transition: '0.5s ease'
        });
        document.body.appendChild(notification);
        const user_bar = document.querySelector('user-bar');
        const casbar = user_bar.shadowRoot.querySelector('.casbar-wrapper');
        const casbar_height = casbar.clientHeight;
        const copyPath_height = document.querySelector('#copyPath').clientHeight;

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
        }, 1250);
    };

    const openFolderButton = (server, id) => {
        const button = createButton('openFolderButton', 'btn btn-info', folder_svg);
        button.addEventListener('click', () => fetch(`http://localhost:5000/openFolder?path=L:\\${server}\\${id}`)
            .then(() => console.log('Folder opened!'))
            .catch(console.error)
        );
        document.querySelector('.copyBtnContainer').appendChild(button);
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
            .cb_container [id*="_delete_btn"], .cb_container [id*="_save_btn"], .cb_container [id*="_send_btn"] {
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
            .cb_info-sign {
                top: 0;
                font-size: 12px;
                color: var(--cb_font);
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
        }

        cbContainer.innerHTML = `
            <div class="cb_settings">
                <div class="cb_ls_container cb_side_container">
                    <span class="cb_side_close_btn glyphicon glyphicon-remove" title="Übersicht schließen"></span>
                    <span class="settings_title">Projekte</span>
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
                    <button id="cb_user_save_btn" class="glyphicon glyphicon-floppy-disk" title="Änderungen speichern"></button>
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

                <span class="settings_title">Settings</span>

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
            const numericKeysArray = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (/^\d+$/.test(key)) { // Checken, ob "Key" nur aus Nummern besteht
                    const value = localStorage.getItem(key);
                    numericKeysArray.push({ key, value });

                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.setAttribute('data-key', key); // "Key" als value für data attribute "data-key" setzten

                    const value_obj = JSON.parse(value);

                    // Ältere Versionen (alle unter 0.82) nutzen "url_id" als Key für Projekt-ID, anstatt "project_id". Das wird hier angepasst ("url_id" → "project_id).
                    if ('url_id' in value_obj) value_obj.project_id = value_obj.url_id;

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
                        .filter(([key, value]) => value_obj[key] !== undefined)
                        .map(([_, formattedValue]) => formattedValue + '&#013')
                        .join('');

                    label.innerHTML = `${key} | <a href="/project/detailed/${key}" title="Link zur Projekt-Seite ${key}" target="_blank">Projektlink</a> <span class="glyphicon glyphicon-info-sign cb_info-sign" title="${project_btnTitle}"></span>`;

                    label.appendChild(checkbox);
                    // label.appendChild(document.createTextNode(`${key}`));
                    container.appendChild(label);
                }
            }
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

            const storedData = JSON.parse(localStorage.getItem(project_id));
            if (storedData) {
                createCopyButton(false, false, false, 'copyPath');
                createCopyButton(false, false, false, 'copyClientdata');
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

                if (department) settings.department = department;
                if (user) settings.user = user;

                localStorage.setItem('settings', JSON.stringify(settings));

                showNotification('Änderungen gespeichert');

                // Popup schließen
                document.querySelector('.cb_user_container')?.classList.remove('open');
            });

            // Vorbelegung laden
            if (settings.department) {
                const isWeb = settings.department.startsWith("Webdepartment Berlin/");
                if (isWeb) {
                    const [, subTeam] = settings.department.split("/");
                    mainSelect.value = "Webdepartment Berlin";
                    subSelectContainer.style.display = "block";
                    subSelect.value = subTeam;
                } else {
                    mainSelect.value = settings.department;
                }
            }
            if (settings.user) {
                const [first = "", last = ""] = settings.user.split(',').map(s => s.trim());
                document.getElementById("cb_user_firstname").value = first;
                document.getElementById("cb_user_lastname").value = last;
            }

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

                const projectData = JSON.parse(localStorage.getItem(project_id));
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

    const intervalId = setInterval(checkForElement, 500);
})();
