// ==UserScript==
// @name         UT Elearn calendar fixer
// @namespace    https://github.com/erfanva/
// @version      0.1
// @description  Replace course codes with their real names:)
// @author       erfanva
// @match        http://elearn.ut.ac.ir/*
// @match        http://elearn1.ut.ac.ir/*
// @match        http://elearn2.ut.ac.ir/*
// @updateURL    https://github.com/erfanva/Tools/raw/master/UT_Elearn_calendar_fixer.js
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (value) {
        this.addEventListener("load", function (e) {
         // const method = JSON.parse(value)[0].methodname;
            const d = JSON.parse(e.currentTarget.response);
            let courses = d && d[0] && d[0].data && d[0].data.courses
            if(courses && courses.length)
                localStorage.setItem("courses", JSON.stringify(courses))
            else
                courses = JSON.parse(localStorage.getItem("courses"))

            if(courses && courses.length) {
                let tries = 0
                let intervalID = setInterval(()=>{
                    let objs = document.querySelectorAll('table.minicalendar div[data-popover-eventtype-course]')
                    if(objs.length || ++tries > 60) {
                        clearInterval(intervalID)
                        objs.forEach(elem => {
                            courses.forEach(c => {
                                elem.innerHTML = elem.innerHTML.replace(c.shortname, c.fullname)
                            })
                        })
                    }
                }, 500)
            }
        }, false);
        this.realSend(value);
    };
})();
