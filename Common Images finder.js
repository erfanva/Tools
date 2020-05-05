// ==UserScript==
// @name         Common Images finder
// @namespace    https://github.com/erfanva/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var image = document.querySelector('[property="og:image"]')
    if(image && image.content) {
        document.querySelector('body').innerHTML = "<input id='jhvasdhjvvjh' value='"+'[property="og:image"]'+"'><img src="+image.content+">" + document.querySelector('body').innerHTML
    } else {
        image = document.querySelector('[name="twitter:image"]')
        if(image && image.content) {
            document.querySelector('body').innerHTML = "<input id='jhvasdhjvvjh' value='"+'[name="twitter:image"]'+"'><img src="+image.content+">" + document.querySelector('body').innerHTML
        } else {
            image = document.querySelector('[name="og:image"]')
            if(image && image.content) {
                document.querySelector('body').innerHTML = "<input id='jhvasdhjvvjh' value='"+'[name="twitter:image"]'+"'><img src="+image.content+">" + document.querySelector('body').innerHTML
            }else {
                image = document.querySelector('.img-responsive-news')
                if(image && image.src) {
                    document.querySelector('body').innerHTML = "<input id='jhvasdhjvvjh' value='"+'.img-responsive-news'+"'><img src="+image.src+">" + document.querySelector('body').innerHTML
                }
            }
        }
    }
    if(image && (image.content || image.src)) {
        console.log(image)
        var copyText = document.getElementById("jhvasdhjvvjh");

        /* Select the text field */
        copyText.select();
        document.execCommand("copy");
    }

    // Your code here...
})();
