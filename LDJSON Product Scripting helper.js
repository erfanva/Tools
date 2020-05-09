// ==UserScript==
// @name         LDJSON Product Scripting helper
// @namespace    https://github.com/erfanva/
// @version      0.1
// @description  try to take over the world!
// @author       erfanva
// @match        *://*/*
// @grant        none
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
