// ==UserScript==
// @name         Copy-Buttons (OTRS-Extension)
// @namespace    https://github.com/zentolik
// @version      0.06
// @description  Funktioniert nur mit Copy-Buttons Version 0.82 oder neuer!
// @author       Zentolik
// @match        https://otrs.euroweb.net/index.pl?Action=AgentTicketEmail*
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otrs.euroweb.net
// @updateURL    https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @downloadURL  https://github.com/zentolik/ipsi-buttons/raw/main/Copy-Buttons.user.js
// @grant        none
// ==/UserScript==

!(function() {
    'use strict';
    const HOST = window.location.host;
    const URL = window.location.href.split('#');
    if (HOST === 'ipsi.securewebsystems.net') {
        document.body.classList.add('otrs_extension_active'); // Klasse, zum generieren des OTRS-Buttons in IPSI
    }
    if (HOST === 'otrs.euroweb.net' && URL[1] && !document.body.classList.contains('LoginScreen')) { // Code nur laufen lassen; wenn NICHT im LogIn-Screen, es die OTRS-Seite ist und die URL die MailData beinhaltet.
        const mailData = JSON.parse(decodeURI(URL[1]));
        console.log(mailData);

        const selectors = { // Map, zum selektieren der Felder.
            dest_search: '#Dest_Search',
            dest_select: '#Dest_Select',
            to_customer: '#ToCustomer',
            to_customer_label: '[for="ToCustomer"]',
            customer_id: '#CustomerID',
            subject: '#Subject',
            template_label: 'label[for="StandardTemplateID"]',
            template_search: '#StandardTemplateID_Search',
            template_select: '#StandardTemplateID_Select',
            next_state_search: '#NextStateID_Search',
            next_state_select: '#NextStateID_Select',
            sender_label: 'label[for="DynamicField_Sender"]',
            sender_search: '#DynamicField_Sender_Search',
            sender_select: '#DynamicField_Sender_Select',
        };

        const department_array = mailData.department.toLowerCase().trim().split('/');

        let mailSettings = {
            gender: 'male',
            desired_domain: 'no',
            desired_domain_name: '',
            image_quality: 'no'
        }

        const style = document.createElement('style');
        const settingStyles = () => {
            style.textContent = `
                @keyframes loading-ani {
                    100% {transform: translate(-50%,-50%) rotate(1turn)}
                }
                @keyframes expand-border {
                    0% {
                        border: 0px solid #F92;
                    }
                    100% {
                        border: 12px solid #F92;
                    }
                }
                body.scriptLoading {
                    overflow: hidden;
                    width: 100vw;
                    height: 100vh;
                }
                body.scriptLoading #AppWrapper,
                body.scriptLoading #AppWrapper::before,
                body #AppWrapper .cb_mailsettings_popup.formLoading::before {
                    pointer-event: none;
                    touch-action: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                body.scriptLoading #AppWrapper {
                    position: relative;
                }
                body.scriptLoading #AppWrapper::before,
                body #AppWrapper .cb_mailsettings_popup.formLoading::before {
                    position: absolute;
                    content: '';
                    z-index: 999999;
                    background: rgb(0 0 0 / 75%);
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                body.scriptLoading #AppWrapper::after,
                body #AppWrapper .cb_mailsettings_popup.formLoading::after {
                    position: fixed;
                    content: '';
                    z-index: 999998;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    width: 50px;
                    aspect-ratio: 1;
                    display: grid;
                    border-radius: 50%;
                    background:
                        linear-gradient(0deg ,rgb(0 0 0/50%) 30%,#0000 0 70%,rgb(0 0 0/100%) 0) 50%/8% 100%,
                        linear-gradient(90deg,rgb(0 0 0/25%) 30%,#0000 0 70%,rgb(0 0 0/75% ) 0) 50%/100% 8%;
                    background-repeat: no-repeat;
                    animation: loading-ani 1s infinite steps(12);
                }
                body #AppWrapper .cb_close_button {
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    height: 25px;
                    width: 25px;
                    z-index: 1000001;
                    cursor: pointer;
                }
                body #AppWrapper .cb_close_button::before,
                body #AppWrapper .cb_close_button::after{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    content: '';
                    height: 1px;
                    width: 25px;
                    background-color: #fff;;
                    z-index: 1;
                }
                body #AppWrapper .cb_close_button::before {
                    transform: translate(-50%,-50%) rotate(45deg);
                }
                body #AppWrapper .cb_close_button::after {
                    transform: translate(-50%,-50%) rotate(-45deg);
                }
                body #AppWrapper .cb_mailsettings_popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    background-color: #fff;
                    z-index: 1000001;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    width: 300px;
                }
                body #AppWrapper .cb_mailsettings_popup.formLoading {
                    cursor: not-allowed;
                }
                body #AppWrapper .cb_mailsettings_popup h3 {
                    margin-bottom: unset;
                    padding-block: 20px;
                    font-size: 20px;
                    color: #fff;
                    background-color: #333;
                    text-align: center;
                }
                body #AppWrapper .cb_mailsettings_popup form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 20px;
                }
                body #AppWrapper .cb_mailsettings_popup form .cb_gender_container span {
                    display: block;
                }
                body #AppWrapper .cb_mailsettings_popup form .cb_gender_container .cb_gender_label {
                    display: inline-block;
                    font-size: 11px;
                    padding: 6px 10px;
                    background-color: #ddd;
                    margin-right: 2px;
                }
                body #AppWrapper .cb_mailsettings_popup form .cb_gender_container .cb_gender_label:has(input:checked) {
                    background-color: #bbb;
                    cursor: not-allowed;
                }
                body #AppWrapper .cb_mailsettings_popup form .cb_gender_container .cb_gender_label input {
                    display: none;
                }
                body #AppWrapper .cb_mailsettings_popup form label select {
                    width: 100%;
                    border-radius: 0;
                    cursor: pointer;
                }
                body #AppWrapper .cb_mailsettings_popup form .cb_gender_container .cb_gender_label,
                body #AppWrapper .cb_mailsettings_popup form label select {
                    margin-top: 5px;
                }
                body #AppWrapper .cb_mailsettings_popup form button {
                    padding: 8px 12px;
                    width: fit-content;
                    background-color: #F92;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                }
                ${selectors.to_customer_label}.confLabel .Marker {
                    position: relative;
                }
                ${selectors.to_customer_label}.confLabel .Marker::before {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    content: 'Bitte klicken Sie HIER und bestätigen Sie mit der "Enter"-Taste!';
                    top: 50%;
                    left: -260%;
                    width: 270px;
                    height: 46px;
                    padding: 6px;
                    text-align: center;
                    text-shadow: none;
                    font-weight: initial;
                    font-size: 14px;
                    line-height: initial;
                    color: black;
                    background: #ddd;
                    transform: translate(-50%, -50%);
                    border: 6px solid #F92;
                    box-shadow: 0 0 7px 0px rgb(0 0 0 / 35%);
                            animation: 1s infinite alternate expand-border;
                    z-index: 2;
                }
            `;
        }
        settingStyles();

        let popup_open = true;
        let loading = true;

        // Funktion, um das Popup zu erzeugen
        (function createMailSettingsPopup() {
            const appWrapper = document.querySelector('#AppWrapper');
            if (!appWrapper) return;

            // Schließbutton
            const close_button = document.createElement('span');
            close_button.className = 'cb_close_button';
            close_button.setAttribute('title','Popup schließen');
            close_button.addEventListener("click", function (e) {
                endScriptLoading();
                popup.remove(); // Schließe das Popup
                popup_open = false;
                loading = false;
            });

            // Popup-Container
            const popup = document.createElement('div');
            popup.className = 'cb_mailsettings_popup formLoading';

            popup.innerHTML = `<h3>Deine Mailsettings</h3>`;

            // Formular
            const form = document.createElement('form');

            const genderContainer = document.createElement('div');
            genderContainer.className = 'cb_gender_container';
            genderContainer.innerHTML = `
                <span>Anrede:</span>
                <label class="cb_gender_label" for="female">Frau<input type="radio" id="female" name="gender" value="female"></label>
                <label class="cb_gender_label" for="male">Herr<input type="radio" id="male" name="gender" value="male" checked></label>
            `;
            form.appendChild(genderContainer);

            waitForElm('.cb_gender_label').then((elm) => {
                const cb_gender_label = document.querySelectorAll('.cb_gender_label');
                cb_gender_label.forEach(label => {
                    label.onchange = () => {
                        mailSettings.gender = label.getAttribute('for');
                        console.log(mailSettings.gender);
                    };
                });
            });

            if (department_array[0].includes('webdepartment berlin')) {
                // Wunschdomain Select
                const domainLabel = document.createElement('label');
                domainLabel.innerText = 'Wunschdomain-Text anzeigen:';
                const domainSelect = document.createElement('select');
                domainSelect.innerHTML = `
                    <option value="no" selected>Nein</option>
                    <option value="yes">Ja</option>
                `;
                domainSelect.value = mailSettings.desired_domain;
                domainLabel.appendChild(domainSelect);
                form.appendChild(domainLabel);

                // Textinput für Wunschdomain (nur bei "Ja")
                const domainInput = document.createElement('input');
                domainInput.type = 'text';
                domainInput.placeholder = 'wunschdomain.de';
                domainInput.style.display = mailSettings.desired_domain === 'yes' ? 'block' : 'none';
                domainInput.value = mailSettings.desired_domain_name;
                domainInput.oninput = () => {
                    mailSettings.desired_domain_name = domainInput.value;
                };
                form.appendChild(domainInput);

                domainSelect.onchange = () => {
                    mailSettings.desired_domain = domainSelect.value;
                    domainInput.style.display = domainSelect.value === 'yes' ? 'block' : 'none';
                };

                // Bildqualität Select
                const qualityLabel = document.createElement('label');
                qualityLabel.innerText = 'Bildqualität-Text anzeigen:';
                const qualitySelect = document.createElement('select');
                qualitySelect.innerHTML = `
                    <option value="no" selected>Nein</option>
                    <option value="yes">Ja</option>
                `;
                qualitySelect.value = mailSettings.image_quality;
                qualitySelect.onchange = () => {
                    mailSettings.image_quality = qualitySelect.value;
                };
                qualityLabel.appendChild(qualitySelect);
                form.appendChild(qualityLabel);
            }

            // Speichern-Button
            const saveButton = document.createElement('button');
            saveButton.type = 'button';
            saveButton.innerText = 'Speichern';
            saveButton.onclick = () => {
                popup.remove(); // Schließe das Popup
                popup_open = false;
                if (!loading) {
                    endScriptLoading(); // ende loadingscreen
                }
                waitForElm(`.InputField_InputContainer:has(${selectors.template_search}) > .InputField_Selection > .Text`).then((elm) => {
                    const iframeText = document.querySelector('#RichTextField iframe');
                    const domainLink = `<a data-cke-saved-href="https://${mailData.client_domain}/" href="https://${mailData.client_domain}/">${mailData.client_domain}</a>`;
                    setTimeout(() => {
                        if (department_array[0].includes('webdepartment berlin')) {
                            // Funktion zur Bearbeitung des Body-Inhalts
                            (function cleanUpBody() {
                                const body = iframeText.contentWindow.document.querySelector('body');
                                if (!body) return;
                                let html = body.innerHTML;

                                // Anrede auswählen
                                if (mailSettings.gender === 'male') {
                                    html = html.replace(/ Sehr geehrte Frau XXX,/g, '');
                                } else if (mailSettings.gender === 'female') {
                                    html = html.replace(/Sehr geehrter Herr XXX, /g, '');
                                }
                                // Ersetze "<strong>XXXXXX</strong>" mit der Kundennummer
                                html = html.replace(/<strong>XXXXXX<\/strong>/, `<strong>${mailData.client_id}</strong>`);

                                // Ersetze alle "XXX" mit dem Kundennamen
                                html = html.replace(/XXX/g, `${mailData.client_name}`);

                                if (mailSettings.desired_domain === 'yes') {
                                    html = html.replace(/<strong>\*{4} OPTIONAL Wunschdomain \*{4}<\/strong>/g, '');
                                    html = html.replace(/<strong>\*{4} OPTIONAL Wunschdomain ENDE \*{4}<\/strong>/g, '');
                                    if (mailSettings.desired_domain_name) {
                                        html = html.replace(/Domain <a data-cke-saved-href="http:\/\/www.domain.tld\/" href="http:\/\/www.domain.tld\/" rel="noopener noreferrer" target="_blank">www.domain.tld<\/a\>/g, `Domain <a data-cke-saved-href="http://${mailSettings.desired_domain_name}" href="http://${mailSettings.desired_domain_name}"><strong>${mailSettings.desired_domain_name}</strong></a>`);
                                    } else {
                                        html = html.replace(/Domain <a data-cke-saved-href="http:\/\/www.domain.tld\/" href="http:\/\/www.domain.tld\/" rel="noopener noreferrer" target="_blank">www.domain.tld<\/a\>/g, `Domain <strong>www.domain.tld</strong>`);
                                    }
                                } else {
                                    // Entferne alles von Wunschdomain-Start bis Wunschdomain-Ende
                                    html = html.replace(/<strong>\*{4} OPTIONAL Wunschdomain \*{4}<\/strong>[\s\S]*?<strong>\*{4} OPTIONAL Wunschdomain ENDE \*{4}<\/strong>/g, '');
                                }

                                if (mailSettings.image_quality === 'yes') {
                                    html = html.replace(/<strong>\*{4} OPTIONAL Bildqualität \*{4}<\/strong>/g, '');
                                    html = html.replace(/<strong>\*{4} OPTIONAL Bildqualität ENDE \*{4}<\/strong>/g, '');
                                } else {
                                    // Entferne alles von Bildqualität-Start bis Bildqualität-Ende
                                    html = html.replace(/<strong>\*{4} OPTIONAL Bildqualität \*{4}<\/strong>[\s\S]*?<strong>\*{4} OPTIONAL Bildqualität ENDE \*{4}<\/strong>/g, '');
                                }

                                // Ersetze alle Domainlink-Platzhalter mit der Domain des Kunden
                                html = html.replace(/<a[^>]*href="http:\/\/www\.domain\.tld\/"[^>]*>www\.domain\.tld<\/a>/g, `<strong>${domainLink}</strong>`);

                                let brandDomain = domainMap[mailData.project_brand] || 'euroweb.de';
                                if (mailData.project_brand === 'United Media' && mailData.project_company === 'um united media Switzerland AG Schweiz') {
                                    brandDomain = domainMap.United_Media_Schweiz;
                                }

                                html = html.replace(/<a[^>]*href="https:\/\/https\/www.branddomain.tld"[^>]*>https:\/\/www.branddomain.tld<\/a>/g, `<a data-cke-saved-href="http://${brandDomain}" href="http://${brandDomain}"><strong>${brandDomain}</strong></a>`);

                                // Setze den bearbeiteten Inhalt zurück in den Body
                                body.innerHTML = html;
                            })();
                        }
                        if (department_array[0].includes('team aktualisierung berlin')) {
                            // Funktion zur Bearbeitung des Body-Inhalts
                            (function cleanUpBody() {
                                const body = iframeText.contentWindow.document.querySelector('body');
                                if (!body) return;
                                let html = body.innerHTML;
                                // Ersetze alle Domainlink-Platzhalter mit der Domain des Kunden
                                html = html.replace(/<strong><span style="font-family:Arial,sans-serif">XXX<\/span><\/strong>/, `<strong>${domainLink}</strong`);

                                // Anrede auswählen
                                if (mailSettings.gender === 'male') {
                                    html = html.replace(/ Guten Tag Frau XXX,/g, '');
                                } else if (mailSettings.gender === 'female') {
                                    html = html.replace(/Guten Tag Herr XXX, /g, '');
                                }

                                // Ersetze alle "XXX" mit dem Kundennamen
                                html = html.replace(/XXX/g, `${mailData.client_name}`);

                                // Setze den bearbeiteten Inhalt zurück in den Body
                                body.innerHTML = html;

                                // Auflistung einsetzten
                                const pElements = iframeText.contentWindow.document.querySelectorAll('p');
                                const ulElement = document.createElement('ul');
                                const liElement = document.createElement('li');
                                const brElement = document.createElement('br');
                                liElement.appendChild(brElement);
                                ulElement.appendChild(liElement);
                                pElements[2].replaceWith(ulElement);
                            })();
                        }
                        loading = false;
                        endScriptLoading();
                    }, '750');
                });
            };
            form.appendChild(saveButton);

            popup.appendChild(form);
            appWrapper.appendChild(popup);
            appWrapper.appendChild(close_button);
        })();

        document.head.appendChild(style);
        document.body.classList.add('scriptLoading');
        document.querySelector(selectors.to_customer_label).classList.add('confLabel');

        function endScriptLoading() { // function, zum beenden des "scriptLoading"s
            if (document.body.classList.contains('scriptLoading')) {
                document.body.classList.remove('scriptLoading');
            }
        }

        function waitForElm(selector) { // functin, zum warten auf ein Element
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }
                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
        function simulateEnterOnInput(input) { // functin, um "Enter"-Taste zu simulieren
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            input.dispatchEvent(enterEvent);
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    console.log("Input confirmed:", this.value);
                }
            });
        }

        const ke = new KeyboardEvent('keydown', {
            bubbles: true, cancelable: true, keyCode: 13
        });

        const domainMap = {
            'Euroweb': 'euroweb.de', // EW
            'Internet Media': 'internet-media.com', // IOM
            'Stuttgarter Zeitung': 'stz-onlineservice.de', // STZ
            'United Media': 'united-media.de', // UMAG
            'United Media Schweiz': 'united-media.ch', // UMAG_CH
            'WESTFALEN-BLATT': 'westfalen-blatt-onlineservice.de', // WB
            'WN OnlineService': 'wn-onlineService.de', // WN
        }
        const mailMap = {
            'Euroweb': 'info@euroweb.de', // EW
            'Internet Media': 'info@internet-media.at', // IOM
            'Stuttgarter Zeitung': 'info@stz-onlineservice.de', // STZ
            'United Media': 'info@united-media.de', // UMAG
            'United Media Schweiz': 'info@united-media.ch', // UMAG_CH
            'WESTFALEN-BLATT': 'info@westfalen-blatt-onlineservice.de', // WB
            'WN OnlineService': 'info@wn-onlineservice.de', // WN
        }
        let brandMap = {
            'Euroweb': 0, // EW
            'Internet Media': 0, // IOM
            'Stuttgarter Zeitung': 0, // STZ
            'United Media': 0, // UMAG
            'United Media Schweiz': 0, // UMAG_CH
            'WESTFALEN-BLATT': 0, // WB
            'WN OnlineService': 0, // WN
        }

        window.addEventListener('load', function () {
            function dest() { // function zum füllen des Feldes "Aus Queue"
                const dest_search = document.querySelector(selectors.dest_search);
                dest_search.focus();
                const dest_select = document.querySelector(selectors.dest_select);
                if (department_array[0].includes('webdepartment berlin')) {
                    waitForElm('[data-id="182||Webdepartment Berlin"] > i').then((elm) => {
                        elm.click();
                    });
                    if (department_array[1].includes('team daniel regiment')) {
                        waitForElm('[data-id="185||Webdepartment Berlin::Team Daniel Regiment"] > div').then((elm) => {
                            elm.click();
                        });
                    }
                    if (department_array[1].includes('team dennis schübel')) {
                        waitForElm('[data-id="184||Webdepartment Berlin::Team Dennis Schübel"] > div').then((elm) => {
                            elm.click();
                        });
                    }
                    if (department_array[1].includes('team manuela glockmann')) {
                        waitForElm('[data-id="189||Webdepartment Berlin::Team Manuela Glockmann"] > div').then((elm) => {
                            elm.click();
                        });
                    }
                    if (department_array[1].includes('team piotr mostowy')) {
                        waitForElm('[data-id="186||Webdepartment Berlin::Team Piotr Mostowy"] > div').then((elm) => {
                            elm.click();
                        });
                    }
                    if (department_array[1].includes('team sabrina reichenbach')) {
                        waitForElm('[data-id="190||Webdepartment Berlin::Team Sabrina Reichenbach"] > div').then((elm) => {
                            elm.click();
                        });
                    }
                }
                if (department_array[0].includes('team aktualisierung berlin')) {
                    waitForElm('[data-id="183||Team Aktualisierung Berlin"] > div').then((elm) => {
                        // elm.focus();
                        elm.click();
                    });
                }
            }
            function customerMail() { // function zum füllen des Feldes "An Kundenbenutzer"
                const to_customer = document.querySelector(selectors.to_customer);
                to_customer.click();
                to_customer.focus();
                to_customer.classList.add('CustomerAutoComplete', 'W75pc', 'ui-autocomplete-input');
                to_customer.value = mailData.client_email;
                to_customer.focus();
                to_customer.dispatchEvent(ke);
                simulateEnterOnInput(to_customer);
            }

            function customerId() { // function zum füllen des Feldes "Kundennummer"
                const customer_id = document.querySelector(selectors.customer_id);
                customer_id.value = mailData.client_id;
            }

            function subjectFill() { // function zum füllen des Feldes "Betreff"
                const subject = document.querySelector(selectors.subject);
                if (department_array[0].includes('webdepartment berlin')) {
                    subject.value = `Onlinestellung Ihrer Internetseite | ${mailData.client_id}`
                }
                if (department_array[0].includes('team aktualisierung berlin')) {
                    if (mailData.project_type.toLowerCase().trim() === 'korrektur') {
                        mailData.project_type = 'Korrektur';
                    } else {
                        mailData.project_type = 'Aktualisierung';
                    }
                    subject.value = `${mailData.client_id} | Fertigstellung Ihrer ${mailData.project_type}`
                }
            }

            function template() { // function zum füllen des Feldes "Textvorlage" und der leichten anpassung des textes
                if (department_array[0].includes('webdepartment berlin')) {
                    brandMap = {
                        'Euroweb': 241, // EW
                        'Internet Media': 242, // IOM
                        'Stuttgarter Zeitung': 245, // STZ
                        'United Media': 246, // UMAG
                        'United Media Schweiz': 332, // UMAG_CH
                        'WESTFALEN-BLATT': 247, // WB
                        'WN OnlineService': 248, // WN
                    }
                }
                if (department_array[0].includes('team aktualisierung berlin')) {
                    brandMap = {
                        'Euroweb': 504, // EW
                        'Internet Media': 505, // IOM
                        'Stuttgarter Zeitung': 508, // STZ
                        'United Media': 509, // UMAG
                        'United Media Schweiz': 510, // UMAG_CH
                        'WESTFALEN-BLATT': 511, // WB
                        'WN OnlineService': 512, // WN
                    }
                }
                let brand = brandMap[mailData.project_brand] || '504';
                if (mailData.project_brand === 'United Media' && mailData.project_company === 'um united media Switzerland AG Schweiz') {
                    brand = brandMap.United_Media_Schweiz;
                }
                console.log(brand);
                const template_label = document.querySelector(selectors.template_label);
                template_label.click();
                waitForElm(`${selectors.template_select} [data-id="${brand}"] > div`).then((elm) => {
                    elm.click();
                    const formLoading = document.querySelector('.formLoading');
                    formLoading.classList.remove('formLoading');
                });
            }

            function next_state() { // function zum füllen des Feldes "Nächster Status des Tickets"
                const next_state_search = document.querySelector(selectors.next_state_search);
                next_state_search.focus();
                waitForElm(`${selectors.next_state_select} [data-id="2"] > div`).then((elm) => {
                    elm.click();
                    waitForElm('#NextStateID_Select[aria-activedescendant="j16_3"] > #j16_1').then((elm) => {
                        elm.click();
                    });
                });
            }

            function sender() { // function zum füllen des Feldes "Sender"
                let brand = mailMap[mailData.project_brand] || 'info@euroweb.de';
                if (mailData.project_brand === 'United Media' && mailData.project_company === 'um united media Switzerland AG Schweiz') {
                    brand = mailMap.United_Media_Schweiz;
                }
                const sender_label = document.querySelector(selectors.sender_label);
                sender_label.click();
                waitForElm(`${selectors.sender_select} [data-id="${brand}"] > div`).then((elm) => {
                    elm.click();
                });
            }

            customerMail();
            waitForElm('#TicketCustomerContentToCustomer > div > input[name="CustomerSelected"]').then((elm) => {
                document.querySelector(selectors.to_customer_label).classList.remove('confLabel');
                setTimeout(() => {
                    customerId();
                }, '600');
            });
            customerId();
            subjectFill();
            dest();
            setTimeout(() => {
                next_state();
            }, '200');
            setTimeout(() => {
                sender();
            }, '550');
            waitForElm(`.InputField_InputContainer:has(${selectors.sender_search}) > .InputField_Selection > .Text`).then((elm) => {
                setTimeout(() => {
                    template();
                }, '550'); // +1000
            });
            setTimeout(() => {
                if (!popup_open) {
                    endScriptLoading();
                }
                loading = false;
            }, '3000');

        })
    }
})();
