// ==UserScript==
// @name         Copy-Buttons
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  try to take over the world!
// @author       Kaan Korkmaz
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=securewebsystems.net
// @grant        none
// ==/UserScript==

!(function() {
    'use strict';
    const settings = {
        copy_button: true,
        copy_work_button: false,
        open_folder: false
    };
    const selectors = {
        server_attribute: 'data-v-8744275e',
        href_attribute: 'data-v-2a36c6f6',
        dfs_attribute: 'data-v-08642a33'
    };
    const edoList = ['pandava', 'nidhogg', 'cerberus'];
    let edo = '', notifications = [], loopListener = true;

    const loadFromSessionStorage = () => {
        const storedEdo = sessionStorage.getItem('edo'), storedClientId = sessionStorage.getItem('client_id'), storedClientUrl = sessionStorage.getItem('client_url');
        if (storedEdo && storedClientId && storedClientUrl) {
            edo = storedEdo;
            createButtonContainer();
            settings.copy_button && createCopyButton(edo, storedClientId);
            settings.copy_work_button && createWorkCopyButton(edo, storedClientId, storedClientUrl);
            return true;
        }
        return false;
    };

    const checkForElement = () => {
        if (loadFromSessionStorage()) return clearInterval(intervalId);

        const targetElement = document.querySelector(`div[${selectors.server_attribute}] > button.btn-primary`);
        const bElement = Array.from(document.querySelectorAll(`b[${selectors.dfs_attribute}]`)).find(el => el.innerText.trim() === "Server:");

        if (targetElement || bElement || loopListener) {
            edo = targetElement?.innerText.toLowerCase().trim() || edo;

            if (bElement) {
                const selectElement = bElement.closest(`tr[${selectors.dfs_attribute}]`)?.querySelector(`select[${selectors.dfs_attribute}]`);
                selectElement?.addEventListener("input", () => {
                    const selectedOption = selectElement.options[selectElement.selectedIndex]?.innerText.split(' (')[0];
                    document.querySelector(`button.btn-success[${selectors.dfs_attribute}]`)?.addEventListener('click', () => {
                        edo = selectedOption.toLowerCase().trim();
                    });
                });
            }

            if (edoList.includes(edo)) {
                const client_id = document.querySelector('h1').textContent.replace(/\D/g, '');
                const client_url = document.querySelector(`a[${selectors.href_attribute}].text-primary`).textContent;

                sessionStorage.setItem('edo', edo);
                sessionStorage.setItem('client_id', client_id);
                sessionStorage.setItem('client_url', client_url);

                createButtonContainer();
                loopListener = false;
                settings.copy_button && createCopyButton(edo, client_id);
                settings.copy_work_button && createWorkCopyButton(edo, client_id, client_url);
                clearInterval(intervalId);
                settings.open_folder && openFolderButton(edo, client_id);
            }
        }
    };

    const createButtonContainer = () => {
        if (!document.querySelector('.copyBtnContainer')) {
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed', right: settings.copy_button ? '20px' : '0', bottom: settings.copy_button ? '40px' : '25vh',
                display: 'flex', gap: '15px', zIndex: '1000'
            });
            container.className = 'copyBtnContainer';
            document.body.appendChild(container);
        }
    };

    const createButton = (id, className, text) => {
        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        button.innerHTML = text;
        return button;
    };

    const createCopyButton = (server, id) => {
        if (!document.querySelector('#copyButton')) {
            const button = createButton('copyButton', 'btn btn-success', `L:\\${server}\\${id}`);
            button.title = button.innerText;
            button.addEventListener('click', () => copyToClipboard(button.title));
            document.querySelector('.copyBtnContainer').appendChild(button);
        }
    };

    const createWorkCopyButton = (server, id, url) => {
        if (!document.querySelector('#copyWorkButton')) {
            const svg = '<?xml version="1.0" encoding="utf-8"?><svg>...</svg>';
            const button = createButton('copyWorkButton', 'btn btn-primary', svg);
            button.title = `L:\\${server}\\${id}\\work\\${url}`;
            button.addEventListener('click', () => copyToClipboard(button.title));
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
        console.log('Copied to clipboard:', text);
        showNotification(text);
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'label label-success';
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed', right: '20px', zIndex: '999', opacity: '0', transition: 'all 0.5s ease'
        });
        document.body.appendChild(notification);

        const bottomValue = settings.copy_button ? '80px' : '40px';
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
        const button = createButton('openFolderButton', 'btn btn-info', `Open Folder`);
        button.addEventListener('click', () => fetch(`http://localhost:5000/openFolder?path=L:\\${server}\\${id}`)
                                .then(() => console.log('Folder opened!'))
                                .catch(console.error)
                               );
        document.querySelector('.copyBtnContainer').appendChild(button);
    };

    const intervalId = setInterval(checkForElement, 500);
})();