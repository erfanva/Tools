// ==UserScript==
// @name         UT Elearn calendar fixer
// @namespace    https://github.com/erfanva/
// @version      0.22
// @description  Replace course codes with their real names:)
// @author       erfanva
// @match        *://elearn.ut.ac.ir/*
// @match        *://elearn1.ut.ac.ir/*
// @match        *://elearn2.ut.ac.ir/*
// @match        *://elearn3.ut.ac.ir/*
// @match        *://elearn4.ut.ac.ir/*
// @updateURL    https://github.com/erfanva/Tools/raw/master/UT_Elearn_calendar_fixer.js
// @run-at document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function extractTextWithoutTags(elem) {
        if (!elem) {
            return null;
        }
        return Array.prototype.reduce.call(elem.childNodes, function (a, b) {
            return a + (b.nodeType === 3 ? b.textContent : '');
        }, '').trim();
    }
    let done = {}

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (value) {
        this.addEventListener("load", function (e) {
            // const method = JSON.parse(value)[0].methodname;
            const d = JSON.parse(e.currentTarget.response);
            let courses = d && d[0] && d[0].data && d[0].data.courses
            if (courses && courses.length)
                localStorage.setItem("courses", JSON.stringify(courses))
            else
                courses = JSON.parse(localStorage.getItem("courses"))

            // calendar
            if (courses && courses.length && !done.calendar) {
                let tries = 0
                let intervalID = setInterval(() => {
                    let objs = document.querySelectorAll('table.minicalendar div[data-popover-eventtype-course]')
                    if (document.querySelector('div.calendarwrapper .loading-icon')) {
                        return
                    }
                    objs.forEach(elem => {
                        const text = elem.innerText
                        const parent = elem.parentElement.parentElement
                        let c = courses.find(t => text.includes(t.shortname))
                        if (!c) {
                            console.log(text)
                            elem.remove()
                            if (!parent.querySelector('div[data-popover-eventtype-course]')) {
                                parent.classList = ['day', 'text-center']
                                parent.innerHTML = parent.querySelector('a').innerHTML
                            }
                            return
                        }
                        elem.innerHTML = elem.innerHTML.replace(c.shortname, c.fullname)
                    })
                    if (objs.length || ++tries > 60) {
                        done.calendar = objs.length
                        clearInterval(intervalID)
                    }
                })
            }
            // Timeline
            if (courses && courses.length && !done.timeline) {
                let tries = 0
                let intervalID = setInterval(() => {
                    let objs = document.querySelectorAll('div[data-region="event-list-item"]')
                    objs.forEach(elem => {
                        const text = (elem.querySelector('.text-truncate') || {}).innerText;
                        const parent = elem.parentElement
                        if (!text) return;
                        let c = courses.find(t => text.includes(t.shortname))
                        if (!c) {
                            elem.remove()
                            if (!parent.querySelector('div[data-region="event-list-item"]')) {
                                parent.previousElementSibling.remove()
                                parent.remove()
                            }
                            return
                        }
                    })
                    if (objs.length || ++tries > 60) {
                        done.timeline = objs.length
                        clearInterval(intervalID)
                    }
                }, 500)
            }
        }, false);
        this.realSend(value);
    };
})();
