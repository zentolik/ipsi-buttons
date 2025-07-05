// ==UserScript==
// @name         Copy-Buttons
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  try to take over the world!
// @author       Zentolik
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=securewebsystems.net
// @grant        none
// ==/UserScript==

!(function() {
    'use strict';
    const settings = {
        copy_button: true,
        copy_work_button: false,
    };

    const selectors = {
        server_attribute: 'data-v-8744275e',
        href_attribute: 'data-v-2a36c6f6',
    };

    const edo = ['pandava', 'nidhogg', 'cerberus'];
    let elementText = '', notifications = [];

    const loadFromSessionStorage = () => {
        const storedElementText = sessionStorage.getItem('elementText');
        const storedClientId = sessionStorage.getItem('client_id');
        const storedClientUrl = sessionStorage.getItem('client_url');

        if (storedElementText && storedClientId && storedClientUrl) {
            elementText = storedElementText;
            const client_id = storedClientId;
            const client_url = storedClientUrl;
            createButtonContainer();
            settings.copy_button && createCopyButton(elementText, client_id);
            settings.copy_work_button && createWorkCopyButton(elementText, client_id, client_url);
            return true;
        }
        return false;
    };

    const checkForElement = () => {
        if (loadFromSessionStorage()) {
            clearInterval(intervalId);
            return;
        }
        const targetElement = document.querySelector(`div[${selectors.server_attribute}] > button[${selectors.server_attribute}].btn-primary`);
        if (targetElement) {
            elementText = targetElement.innerText.toLowerCase().trim();
            if (edo.includes(elementText)) {
                const client_id = document.querySelector('h1').textContent.replace(/\D/g, '');
                const client_url = document.querySelector(`a[${selectors.href_attribute}].text-primary`).textContent;

                sessionStorage.setItem('elementText', elementText);
                sessionStorage.setItem('client_id', client_id);
                sessionStorage.setItem('client_url', client_url);

                createButtonContainer();
                settings.copy_button && createCopyButton(elementText, client_id);
                settings.copy_work_button && createWorkCopyButton(elementText, client_id, client_url);
                clearInterval(intervalId);
            }
        }
    };

    const createButtonContainer = () => {
        if (!document.querySelector('.copyBtnContainer')) {
            const container = document.createElement('div');
            container.className = 'copyBtnContainer';
            Object.assign(container.style, {
                position: 'fixed',
                right: settings.copy_button ? '20px' : '0',
                bottom: settings.copy_button ? '40px' : '25vh',
                display: 'flex',
                gap: '15px',
                zIndex: '1000',
            });
            document.body.appendChild(container);
        }
    };

    const createCopyButton = (server, id) => {
        if (!document.querySelector('#copyButton')) {
            const button = createButton('copyButton', 'btn btn-success', `L:\\${server}\\${id}`);
            button.title = `L:\\${server}\\${id}`;
            button.addEventListener('click', () => copyToClipboard(`L:\\${server}\\${id}`));
            document.querySelector('.copyBtnContainer').appendChild(button);
        }
    };

    const createWorkCopyButton = (server, id, url) => {
        if (!document.querySelector('#copyWorkButton')) {
            const svg = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 115.77 122.88" style="enable-background:new 0 0 115.77 122.88; width: 11px;" fill="white" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/></g></svg>';
            const button = createButton('copyWorkButton', 'btn btn-primary', svg);
            button.title = `L:\\${server}\\${id}\\work\\${url}`;
            Object.assign(button.style, {
                borderTopRightRadius: settings.copy_button ? 'revert-layer' : '0',
                borderBottomRightRadius: settings.copy_button ? 'revert-layer' : '0',
            });
            button.addEventListener('click', () => copyToClipboard(`L:\\${server}\\${id}\\work\\${url}`));
            document.querySelector('.copyBtnContainer').appendChild(button);
        }
    };

    const createButton = (idName, className, text) => {
        const button = document.createElement('button');
        button.id = idName;
        button.className = className;
        button.innerHTML = text;
        return button;
    };

    const copyToClipboard = (copyText) => {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('Copied to clipboard:', copyText);
        showNotification(copyText);
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'label label-success';
        notification.textContent = message;
        notification.style = 'position: fixed; right: 20px; z-index: 999; opacity: 0; transition: all 0.5s ease;';
        document.body.appendChild(notification);
        let bottomValue = settings.copy_button ? '80px' : '40px';
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

    const intervalId = setInterval(checkForElement, 500);


})();
