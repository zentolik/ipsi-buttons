// ==UserScript==
// @name         Copy-Buttons (OTRS-Extension)
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Funktioniert nur mit Copy-Buttons Version 0.82 oder neuer!
// @author       Zentolik
// @match        https://otrs.euroweb.net/index.pl?Action=AgentTicketEmail*
// @match        https://ipsi.securewebsystems.net/project/detailed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otrs.euroweb.net
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

        const style = document.createElement('style');
        const settingStyles = () => {
            style.textContent = `
                @keyframes loading-ani {
                    100% {transform: rotate(1turn)}
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
                body.scriptLoading #AppWrapper {
                    position: relative;
                }
                body.scriptLoading #AppWrapper::before {
                    position: absolute;
                    content: '';
                    z-index: 999998;
                    touch-action: none;
                    background: rgb(0 0 0 / 75%);
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: calc(100% + 10px);
                }
                body.scriptLoading #AppWrapper::after {
                    position: fixed;
                    content: '';
                    z-index: 999999;
                    top: 50%;
                    left: 50%;
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
                    left: 50%;
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
                    // event.preventDefault();
                    console.log("Input confirmed:", this.value);
                }
            });
        }

        const ke = new KeyboardEvent('keydown', {
            bubbles: true, cancelable: true, keyCode: 13
        });

        window.addEventListener('load', function () {
            function dest() { // function zum füllen des Feldes "Aus Queue"
                const dest_search = document.querySelector(selectors.dest_search);
                dest_search.focus();
                const dest_select = document.querySelector(selectors.dest_select);
                waitForElm('[data-id="183||Team Aktualisierung Berlin"] > div').then((elm) => {
                    // elm.focus();
                    elm.click();
                });
            }
            // mailData.client_email = 'kaan.98@live.de';
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
                if (mailData.project_type === 'Korrektur') {
                    mailData.project_type = 'Korrektur';
                } else {
                    mailData.project_type = 'Aktualisierung';
                }
                subject.value = `${mailData.client_id} | Fertigstellung Ihrer ${mailData.project_type}`
            }

            function template() { // function zum füllen des Feldes "Textvorlage" und der leichten anpassung des textes
                const brandMap = {
                    Euroweb: 504,
                    Internet_Media: 505, // IOM
                    Stuttgarter_Zeitung: 508, // STZ
                    United_Media: 509, // UMAG
                    United_Media_Schweiz: 510, // UMAG_CH
                    WESTFALEN_BLATT511: 511, // WB
                    WN_OnlineService: 512, // WN
                }
                let brand = brandMap[mailData.project_brand.replace(/ /g, '_')] || '504';
                if (mailData.project_brand === 'United Media' && mailData.project_company === 'um united media Switzerland AG Schweiz') {
                    brand = brandMap.United_Media_Schweiz;
                }
                const template_label = document.querySelector(selectors.template_label);
                template_label.click();
                waitForElm(`${selectors.template_select} [data-id="${brand}"] > div`).then((elm) => {
                    // elm.focus();
                    elm.click();
                });
                waitForElm(`.InputField_InputContainer:has(${selectors.template_search}) > .InputField_Selection > .Text`).then((elm) => {
                    const iframeText = document.querySelector('#RichTextField iframe');
                    const domainLink = `<a data-cke-saved-href="https://${mailData.client_domain}/" href="https://${mailData.client_domain}/">${mailData.client_domain}</a>`;
                    setTimeout(() => {
                        const pElements = iframeText.contentWindow.document.querySelectorAll('p');
                        const salutationText = iframeText.contentWindow.document.querySelectorAll('p > span');
                        const domainText = iframeText.contentWindow.document.querySelectorAll('p > strong');
                        salutationText[0].innerHTML = salutationText[0].innerHTML.replaceAll('XXX',mailData.client_name);
                        domainText[0].innerHTML = domainLink;
                        const ulElement = document.createElement('ul');
                        const liElement = document.createElement('li');
                        const brElement = document.createElement('br');
                        liElement.appendChild(brElement);
                        ulElement.appendChild(liElement);
                        pElements[2].replaceWith(ulElement);
                        endScriptLoading();
                    }, '750');
                });
            }

            function next_state() { // function zum füllen des Feldes "Nächster Status des Tickets"
                const next_state_search = document.querySelector(selectors.next_state_search);
                next_state_search.focus();
                waitForElm(`${selectors.next_state_select} [data-id="2"] > div`).then((elm) => {
                    // elm.focus();
                    elm.click();
                });
            }

            function sender() { // function zum füllen des Feldes "Sender"
                const brandMap = {
                    Euroweb: 'info@euroweb.de',
                    Internet_Media: 'info@internet-media.at', // IOM
                    Stuttgarter_Zeitung: 'info@stz-onlineservice.de', // STZ
                    United_Media: 'info@united-media.ch', // UMAG
                    United_Media_Schweiz: 'info@united-media.de', // UMAG_CH
                    WESTFALEN_BLATT511: 'info@westfalen-blatt-onlineservice.de', // WB
                    WN_OnlineService: 'info@wn-onlineservice.de', // WN
                }
                let brand = brandMap[mailData.project_brand.replace(/ /g, '_')] || 'info@euroweb.de';
                if (mailData.project_brand === 'United Media' && mailData.project_company === 'um united media Switzerland AG Schweiz') {
                    brand = brandMap.United_Media_Schweiz;
                }
                const sender_label = document.querySelector(selectors.sender_label);
                sender_label.click();
                waitForElm(`${selectors.sender_select} [data-id="${brand}"] > div`).then((elm) => {
                    // elm.focus();
                    elm.click();
                });
            }

            customerMail();
            waitForElm('#TicketCustomerContentToCustomer > div > input[name="CustomerSelected"]').then((elm) => {
                document.querySelector(selectors.to_customer_label).classList.remove('confLabel');
                setTimeout(() => {
                    customerId();
                }, '500');
            });
            customerId();
            subjectFill();
            dest();
            // waitForElm(`.InputField_InputContainer:has(${selectors.dest_search}) > .InputField_Selection > .Text`).then((elm) => {
            //     template();
            //     waitForElm(`.InputField_InputContainer:has(${selectors.next_state_search}) > .InputField_Selection > .Text`).then((elm) => {
            //         sender();
            //         waitForElm(`.InputField_InputContainer:has(${selectors.sender_search}) > .InputField_Selection > .Text`).then((elm) => {
            //             next_state();
            //             setTimeout(() => {
            //                 document.body.classList.remove('scriptLoading');
            //             }, '500');
            //         });
            //     });
            // });
            // setTimeout(() => {
            //     customerMail();
            // }, '250');
            // setTimeout(() => {
            //     customerId();
            // }, '500');
            // setTimeout(() => {
            //     subjectFill();
            // }, '750');
            setTimeout(() => {
                next_state();
            }, '100');
            setTimeout(() => {
                sender();
            }, '350');
            waitForElm(`.InputField_InputContainer:has(${selectors.sender_search}) > .InputField_Selection > .Text`).then((elm) => {
                setTimeout(() => {
                    template();
                }, '350'); // +1000
            });
            setTimeout(() => {
                endScriptLoading();
            }, '2250');

        })
    }
})();
