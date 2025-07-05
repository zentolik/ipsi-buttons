// ==UserScript==
// @name         Copy-Buttons
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  doing stuff ʕ·͡ᴥ·ʔ
// @author       Zentolik
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=securewebsystems.net
// @grant        none
// ==/UserScript==

!(function() { // ʕ·͡ᴥ·ʔ hi & ty <3
    'use strict';
    console.log('ʕ·͡ᴥ·ʔ *bup*');
    let settings = {
        button_position: true, // ändert die position vom btn (wenn auf "false", empfähle ich "copy_icon" zu aktivieren") //
        copy_work_button: true, // pfad geht bis zu "L:\EDO\ID\WORK\" //
        copy_icon: false, // copy-icon als button-text (anstatt des pfades) //
        button_color: 'green', // red / yellow / blue / cyan / green / gray / #rrggbb (HEX-Color) //
        delete_button: false, // erstellt ein delete-button, der beim klicken die projekt-daten aus dem local storage löscht //
        open_folder: false, // WIP (bitte nicht aktivieren. funktioniert nicht) //
    };

    const selectors = {
        server_attr: 'data-v-8744275e',
        href_attr: 'data-v-2a36c6f6',
        dfs_attr: 'data-v-08642a33',
    };

    const copy_svg = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88; width: 11px;" fill="white" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>';
    const folder_svg = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M 5 4 C 3.3544268 4 2 5.3555411 2 7 L 2 16 L 2 26 L 2 43 C 2 44.644459 3.3544268 46 5 46 L 45 46 C 46.645063 46 48 44.645063 48 43 L 48 26 L 48 16 L 48 11 C 48 9.3549372 46.645063 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.562937 10 46 10.437063 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4364589 4.4355732 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 26 L 46 43 C 46 43.562937 45.562937 44 45 44 L 5 44 C 4.4355732 44 4 43.563541 4 43 L 4 26 L 4 16 C 4 15.43497 4.4349698 15 5 15 z"></path></svg>';

    const edoList = ['pandava', 'nidhogg', 'cerberus'];
    let edo = '', notifications = [], loopListener = true, url_id = window.location.pathname.split('detailed/')[1];

    const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem(url_id);
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        settings = { ...settings, ...JSON.parse(storedSettings) };
    }

    if (storedData) {
        const storedObject = JSON.parse(storedData);
        if (storedObject.url_id === url_id) {
            edo = storedObject.edo;
            const client_id = storedObject.client_id;
            const client_domain = storedObject.client_domain;

            createButtonContainer();
            createCopyButton(edo, client_id, client_domain);
            createSettings();

            return true;
        }
    }
        return false;
    };

    const checkForElement = () => {
    if (loadFromLocalStorage()) return clearInterval(intervalId);

    const targetElement = document.querySelector(`div[${selectors.server_attr}] > button.btn-primary`);
    const bElement = Array.from(document.querySelectorAll(`b[${selectors.dfs_attr}]`)).find(el => el.innerText.trim() === "Server:");

    if ((targetElement || bElement) && loopListener) {
        edo = targetElement?.innerText.toLowerCase().trim() || edo;

        if (bElement) {
            const selectElement = bElement.closest(`tr[${selectors.dfs_attr}]`)?.querySelector(`select[${selectors.dfs_attr}]`);
            selectElement?.addEventListener("input", () => {
                const selectedOption = selectElement.options[selectElement.selectedIndex]?.innerText.split(' (')[0];
                document.querySelector(`button.btn-success[${selectors.dfs_attr}]`)?.addEventListener('click', () => {
                    edo = selectedOption.toLowerCase().trim();
                });
            });
        }

        if (edoList.includes(edo)) {
            const client_id = document.querySelector('h1').textContent.replace(/\D/g, '');
            const client_domain = document.querySelector(`a[${selectors.href_attr}].text-primary`).textContent;
            const dataToStore = {
                client_domain,
                client_id,
                edo,
                url_id
            };
            localStorage.setItem(url_id, JSON.stringify(dataToStore));

            createButtonContainer();
            loopListener = false;
            createCopyButton(edo, client_id, client_domain);

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
            Object.assign(container.style, {
                position: 'fixed', right: settings.button_position ? '20px' : '0', bottom: settings.button_position ? '40px' : '25vh', display: 'flex', gap: '5px', zIndex: '1000'
            });
            container.className = 'copyBtnContainer';
            document.body.appendChild(container);

            settings.delete_button && createRemoveButton();
        }
    };

    const createRemoveButton = () => {
        if (!document.querySelector('#removeButton')) {
            const removeButton = createButton('removeButton', 'btn btn-danger glyphicon glyphicon-trash', '');
            removeButton.title = 'Button entfernen';
            removeButton.addEventListener('click', () => {
                localStorage.removeItem(url_id);
                const copyButton = document.querySelector('#copyButton');
                if (copyButton) {
                    copyButton.remove();
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

    const createCopyButton = (server, id, url) => {
        if (!document.querySelector('#copyButton')) {
            let path = '';
            path = settings.copy_work_button ? `L:\\${server}\\${id}\\work\\` : `L:\\${server}\\${id}`;
            let color_class = 'btn-default';
            let customColor = false;

            if (settings.button_color.startsWith("#")) {
                customColor = true;
            } else {
                if (settings.button_color.toLowerCase().trim() === 'red') {
                    color_class = 'btn-danger';
                } else if (settings.button_color.toLowerCase().trim() === 'blue') {
                    color_class = 'btn-primary';
                } else if (settings.button_color.toLowerCase().trim() === 'green') {
                    color_class = 'btn-success';
                } else if (settings.button_color.toLowerCase().trim() === 'yellow') {
                    color_class = 'btn-warning';
                } else if (settings.button_color.toLowerCase().trim() === 'cyan') {
                    color_class = 'btn-info';
                }
            }

            const button = createButton('copyButton', `btn ${color_class}`, settings.copy_icon ? copy_svg : path);
            if (!settings.button_position) {
                Object.assign(button.style, {
                    borderTopRightRadius: '0', borderBottomRightRadius: '0'
                });
            }
            if (customColor) {
                button.setAttribute('style', `background-color: ${settings.button_color.toLowerCase().trim()} !important;`);
            }
            button.title = path;
            button.addEventListener('click', () => copyToClipboard(path));
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

        const bottomValue = settings.button_position ? '80px' : '40px';
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
        }, 2000);
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
        style.textContent = `
            :root {
                --cb_background: #eaedf7;
                --cb_background_dark: #363636;
                --cb_font: #757575;
                --cb_font_active: #1b1b1b;
                --cb_active: #16b968;
                --cb_active_dark: #173a2e;
                --cb_deactivated: #e70637;
                --cb_deactivated_dark: #3d1b25;
                --cb_switch_width: 32px;
                --cb_switch_height: 20px;
                --cb_color_red: #ea4858;
                --cb_color_yellow: #e8d247;
                --cb_color_blue: #476fe8;
                --cb_color_cyan: #47d2e8;
                --cb_color_green: #15db81;
                --cb_color_gray: #f2f5ff;
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
                width: calc(90vw - (25px * 2));
                height: calc(90vh - (100px + 20px));
                max-width: 300px;
                max-height: 250px;
                padding: 35px 0;
                background-color: var(--cb_background);
                border-radius: 15px;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 1);
                outline: 0 !important;
                box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, .25) inset, 0 1px 1px 0 rgba(255, 255, 255, .25) inset !important;
                transform: scale(0);
                transform-origin: bottom right;
                transition: bottom 0.35s cubic-bezier(0.25, 1, 0.5, 1.15), transform 0.2s ease-in-out;
            }
            .cb_container .cb_settings:has(.popup_content.open) {
                bottom: 70px;
                transition: bottom 0.35s cubic-bezier(0.25, 1, 0.5, 1.15);
            }
            .cb_container .cb_settings .settings_title {
                font-size: 24px;
                font-family: sans-serif;
                font-weight: bolder;
                letter-spacing: 12px;
                text-transform: uppercase;
                color: var(--cb_font);
                margin-right: -12px;
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
                min-width: 170px;
            }
            .cb_container .cb_settings .cb_setting input {
                display: none;
            }
            .cb_container .cb_settings .cb_setting label.cb_switch, .cb_container .cb_settings .cb_setting label.cb_checkbox, .cb_container .cb_settings .cb_setting label.cb_switch {
                display: flex;
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
                transition: all 0.25s ease-in-out;
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
            .cb_container .cb_settings .cb_setting:has(.active) label.cb_checkbox .box::before, .cb_container .cb_settings .cb_setting:has(.active) label.cb_checkbox .box::after {
                width: calc(var(--cb_switch_height) / 1.90);
                border-radius: calc(var(--cb_switch_height) / 3);
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
            .cb_container .cb_settings .cb_setting .popup_title {
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
                background: var(--cb_font_active);
                border-radius: 30px;
                border: solid 5px var(--cb_background);
                transform: scaleX(0.000001);
                transform-origin: center center;
                top: 21px;
                left: -5px;
                transition: transform 0.2s ease-in-out;
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input {
                position: relative;
                display: inline-block;
                width: calc(var(--cb_switch_width) - 10px);
                height: calc(var(--cb_switch_width) - 10px);
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
                transition: all 0.25s ease;
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
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.active {
                background: var(--cb_active);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content label.cb_input.active::after {
                border: solid 3px var(--cb_font_active);
                width: calc(var(--cb_switch_width) / 3.5);
                height: calc(var(--cb_switch_width) / 3.5);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content.open {
                transform: scaleX(1);
                transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1.15);
            }
            .cb_container .cb_settings .cb_setting .popup_container .popup_content.open label.cb_input {
                transform: scale(1);
                transition: scale 0.25s cubic-bezier(0.25, 1, 0.5, 1.15);
            }
            .cb_container.open .cb_settings {
                transform: scale(1);
                transition: bottom 0.35s cubic-bezier(0.25, 1, 0.5, 1.15), transform 0.35s cubic-bezier(0.25, 1, 0.5, 1.15);
            }
        `;

        document.head.appendChild(style);

        const cbContainer = document.createElement('div');
        cbContainer.classList.add('cb_container');
        cbContainer.innerHTML = `
            <div class="cb_settings">
                <span class="settings_title">settings</span>

                <div class="cb_setting">
                    <input type="checkbox" id="copy_work_button" name="work-pfad"/>
                    <label class="cb_switch" for="copy_work_button">
                        <span class="setting_title">"work"-Pfad</span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="copy_icon" name="copy-icon"/>
                    <label class="cb_switch" for="copy_icon">
                        <span class="setting_title">"copy"-Icon</span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting">
                    <input type="checkbox" id="delete_button" name="delete-button"/>
                    <label class="cb_switch" for="delete_button">
                        <span class="setting_title">Delete-Button</span>
                        <span class="box"></span>
                    </label>
                </div>

                <div class="cb_setting color_settings popup_settings">
                    <span class="popup_title setting_title">Button-Farbe</span>
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

            <div class="cb_btn btn btn-default glyphicon glyphicon-plus"></div>
        `;

        document.querySelector('.copyBtnContainer').appendChild(cbContainer);

        const cb_btn = document.querySelector('.cb_btn');
        const cb_container = document.querySelector('.cb_container');
        const popup_content = document.querySelectorAll('.popup_content');

        cb_btn.addEventListener('click', function() {
            cb_container.classList.toggle('open');
        });

        document.addEventListener('click', function(event) {
            const isClickInsideContainer = cb_container.contains(event.target);
            const isClickInsidePopup = Array.from(popup_content).some(popup => popup.contains(event.target));

            if (!isClickInsideContainer && cb_container.classList.contains('open')) {
                cb_container.classList.remove('open');
                popup_content.forEach(popup => popup.classList.remove('open'));
            }
        });

        popup_content.forEach(popup => {
            document.addEventListener('click', function(event) {
                const isClickInsidePopup = popup.contains(event.target);
                const isClickInsideContainer = cb_container.contains(event.target);

                if (!isClickInsidePopup && isClickInsideContainer) {
                    popup.classList.remove('open');
                }
            });
        });

        const popups = document.querySelectorAll('.popup_settings');
        popups.forEach(popup => {
            const popup_title = popup.querySelector('.popup_title');
            const popup_btn = popup.querySelector('.popup_btn');
            const popup_content = popup.querySelector('.popup_content');

            function clickPopupBtn(button) {
                button.addEventListener('click', function(event) {
                    event.stopPropagation();
                    popup_content.classList.toggle('open');
                });
            }

            clickPopupBtn(popup_title);
            clickPopupBtn(popup_btn);
        });

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
            const oldButton = document.querySelector('#copyButton');
            if (oldButton) {
                oldButton.remove();
            }

            const storedData = JSON.parse(localStorage.getItem(url_id));
            if (storedData) {
                const { edo, client_id, client_domain } = storedData;
                createCopyButton(edo, client_id, client_domain);
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
