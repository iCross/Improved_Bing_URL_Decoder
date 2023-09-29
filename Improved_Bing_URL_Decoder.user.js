// ==UserScript==
// @name         Improved Bing URL Decoder
// @namespace    https://github.com/iCross
// @version      1.0
// @description  Decode Bing URLs to get the direct result page URL
// @author       https://github.com/iCross
// @match        *://*.bing.com/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function decodeBingURL(encodedURL) {
        let modifiedEncodedURL = encodedURL.replace('-', '+').replace('_', '/');
        let paddingNeeded = modifiedEncodedURL.length % 4;
        if (paddingNeeded) {
            modifiedEncodedURL += '='.repeat(4 - paddingNeeded);
        }
        return atob(modifiedEncodedURL);
    }

    function processLinks(links) {
        links.forEach(link => {
            const urlMatch = link.href.match(/u=([^&]+)/);
            if (urlMatch && urlMatch[1]) {
                const decodedURL = decodeBingURL(urlMatch[1].slice(2));
                link.href = decodedURL;
                link.title = "Decoded URL: " + decodedURL;
            }
        });
    }

    function processAllLinks() {
        const links = document.querySelectorAll('a[href*="bing.com/ck/"]');
        processLinks(links);
    }

    processAllLinks();
    new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const newLinks = mutation.addedNodes;
                processLinks(newLinks);
            }
        });
    }).observe(document.body, { childList: true, subtree: true });

})();
