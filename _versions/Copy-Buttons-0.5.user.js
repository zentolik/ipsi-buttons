// ==UserScript==
// @name         Copy-Buttons
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  doing stuff ʕ·͡ᴥ·ʔ
// @author       Zentolik
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=securewebsystems.net
// @grant        none
// ==/UserScript==

!(function() { // ʕ·͡ᴥ·ʔ hi & ty <3
    'use strict';
    const settings = {
        button_position: true, // ändert die position vom btn (wenn auf "false", empfähle ich "copy_icon" zu aktivieren") //
        copy_work_button: true, // pfad geht bis zu "L:\EDO\ID\WORK\" //
        copy_icon: false, // "copy"-icon als button-Text (anstatt des pfades) //
        button_color: 'blue', // red / yellow / blue / cyan / green / gray //
        open_folder: false, // WIP (bitte nicht aktivieren. funktioniert nicht) //
    };

    const selectors = {
        server_attr: 'data-v-8744275e',
        href_attr: 'data-v-2a36c6f6',
        dfs_attr: 'data-v-08642a33'
    };

    const copy_svg = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88; width: 11px;" fill="white" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>';
    const folder_svg = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M 5 4 C 3.3544268 4 2 5.3555411 2 7 L 2 16 L 2 26 L 2 43 C 2 44.644459 3.3544268 46 5 46 L 45 46 C 46.645063 46 48 44.645063 48 43 L 48 26 L 48 16 L 48 11 C 48 9.3549372 46.645063 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.562937 10 46 10.437063 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4364589 4.4355732 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 26 L 46 43 C 46 43.562937 45.562937 44 45 44 L 5 44 C 4.4355732 44 4 43.563541 4 43 L 4 26 L 4 16 C 4 15.43497 4.4349698 15 5 15 z"></path></svg>';
    const edoList = ['pandava', 'nidhogg', 'cerberus'];
    let edo = '', notifications = [], loopListener = true, url_id = window.location.pathname.split('detailed/')[1];

    const loadFromLocalStorage = () => {
        const edoData = ['edo', 'client_id', 'client_domain', 'url_id'].map(key => localStorage.getItem(`${url_id}_${key}`));
        if (edoData.every(item => item) && edoData[3] === url_id) {
            [edo] = edoData;
            createButtonContainer();
            createCopyButton(edo, edoData[1]);
            return true;
        }
        return false;
    };

    const checkForElement = () => {
        if (loadFromLocalStorage()) return clearInterval(intervalId);

        const targetElement = document.querySelector(`div[${selectors.server_attr}] > button.btn-primary`);
        const bElement = Array.from(document.querySelectorAll(`b[${selectors.dfs_attr}]`)).find(el => el.innerText.trim() === "Server:");

        if (targetElement && loopListener || bElement && loopListener || loopListener) {
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
                ['edo', 'client_id', 'client_domain', 'url_id'].forEach((key, i) => localStorage.setItem(`${url_id}_${key}`, [edo, client_id, client_domain, url_id][i]));
                createButtonContainer();
                loopListener = false;
                createCopyButton(edo, client_id, client_domain);
                settings.open_folder && openFolderButton(edo, client_id);
                clearInterval(intervalId);
            }
        }
    };

    const createButtonContainer = () => {
        if (!document.querySelector('.copyBtnContainer')) {
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed', right: settings.button_position ? '20px' : '0', bottom: settings.button_position ? '40px' : '25vh', display: 'flex', gap: '15px', zIndex: '1000'
            });
            container.className = 'copyBtnContainer';
            document.body.appendChild(container);
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
            const button = createButton('copyButton', `btn ${color_class}`, settings.copy_icon ? copy_svg : path);
            if (!settings.button_position) {
                Object.assign(button.style, {
                    borderTopRightRadius: '0', borderBottomRightRadius: '0'
                });
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

    const intervalId = setInterval(checkForElement, 500);
})();
