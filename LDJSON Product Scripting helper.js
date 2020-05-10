// ==UserScript==
// @name         LDJSON Product Scripting helper
// @namespace    https://github.com/erfanva/
// @version      0.2
// @description  try to take over the world!
// @author       erfanva
// @match        *://*/*
// @grant        none
// @updateURL    https://github.com/erfanva/Tools/raw/master/LDJSON%20Product%20Scripting%20helper.js
// ==/UserScript==

(function() {
    'use strict';

    // search ldJsons for Product
    var ldJsons = document.querySelectorAll(
    'script[type="application/ld+json"]'
    );
    var data = null;
    ldJsons.forEach(function (item) {
        try {
            item = JSON.parse(item.innerText);
            if (item['@type'] == 'Product') data = item;
            else if (item['@graph']) {
                item = item['@graph']
            }
            if(Array.isArray(item)) {
                item.forEach(function (graph) {
                    if (graph['@type'] == 'Product') data = graph;
                });
            }  
        } catch (e) {
            return null;
        }
    });
    console.log(data || ldJsons);
})();
