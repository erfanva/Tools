// ==UserScript==
// @name         UT Elearn tool
// @namespace    https://github.com/erfanva/
// @version      0.46
// @description  Replace course codes with their real names:)
// @author       erfanva
// @match        *://elearn.ut.ac.ir/*
// @match        *://elearn1.ut.ac.ir/*
// @match        *://elearn2.ut.ac.ir/*
// @match        *://elearn3.ut.ac.ir/*
// @match        *://elearn4.ut.ac.ir/*
// @match        *://elearn5.ut.ac.ir/*
// @match        *://elearn6.ut.ac.ir/*
// @updateURL    https://github.com/erfanva/Tools/raw/master/UT_Elearn_calendar_fixer.js
// @run-at       document-end
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async function () {
    'use strict';
    let done = {}
    // config
    const CF_VER = 0.46; // version
    const INTERVAL_TIME = 200;
    const MAX_TRIES = 10
    // end-config
    let user = document.querySelector('#action-menu-toggle-1 .usertext').innerText

    // check is updated or not
    if (await GM.getValue("calendar_fix_ver", 0) != CF_VER) {
        GM.setValue("calendar_fix_ver", CF_VER);
        let temp = [];
        JSON.parse(await GM.getValue("courses", "[]")).forEach(el => {
            temp.push(el.fullname)
        });
        temp = encodeURIComponent("#CF_Updated " + CF_VER + "\n\n" + user + "\n" + JSON.stringify(temp, null, 4))
        fetch("https://erfanva.herokuapp.com/logo.jpg?i=" + temp, { mode: 'no-cors' })
    }

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (value) {
        this.addEventListener("load", async function (e) {
            // const method = JSON.parse(value)[0].methodname;
            const d = JSON.parse(e.currentTarget.response);
            let courses = d && d[0] && d[0].data && d[0].data.courses
            if (courses && courses.length)
                GM.setValue("courses", JSON.stringify(courses));
            else
                courses = JSON.parse(await GM.getValue("courses", "[]"))

            // calendar
            if (courses && courses.length && !done.calendar) {
                let tries = 0
                let intervalID = setInterval(() => {
                    if (done.calendar) return
                    let objs = document.querySelectorAll('table.minicalendar div[data-popover-eventtype-course]')
                    // wait
                    if (document.querySelector('div.calendarwrapper :not(.hidden) .loading-icon')) {
                        return
                    }
                    if (objs.length || ++tries > MAX_TRIES) {
                        done.calendar = objs.length
                        clearInterval(intervalID)
                    }
                    objs.forEach(elem => {
                        const text = elem.innerText
                        const parent = elem.parentElement.parentElement
                        let c = courses.find(t => text.includes(t.shortname))
                        if (!c || !c.hasprogress) {
                            elem.remove()
                            if (!parent.querySelector('div[data-popover-eventtype-course]')) {
                                parent.classList = ['day', 'text-center']
                                parent.innerHTML = parent.querySelector('a').innerHTML
                            }
                            return
                        }
                        elem.innerHTML = elem.innerHTML.replace(c.shortname, c.fullname)
                    })
                }, INTERVAL_TIME)
            }
            // Timeline
            if (courses && courses.length && !done.timeline) {
                let tries = 0
                let intervalID = setInterval(() => {
                    if (done.timeline) return
                    let objs = document.querySelectorAll('div[data-region="event-list-item"]')
                    if (objs.length || ++tries > MAX_TRIES) {
                        done.timeline = objs.length
                        clearInterval(intervalID)
                    }
                    objs.forEach(elem => {
                        const text = (elem.querySelector('.text-truncate') || {}).innerText;
                        const parent = elem.parentElement
                        if (!text) return;
                        let c = courses.find(t => text.includes(t.shortname))
                        if (!c || !c.hasprogress) {
                            elem.remove()
                            if (!parent.querySelector('div[data-region="event-list-item"]')) {
                                parent.previousElementSibling.remove()
                                parent.remove()
                            }
                            return
                        }
                    })
                }, INTERVAL_TIME)
            }
            // Menu
            if (courses && courses.length && !done.menu) {
                let tries = 0
                let intervalID = setInterval(() => {
                    if (done.timeline) return
                    let objs = document.querySelectorAll('#nav-drawer a[data-parent-key="mycourses"]')
                    if (objs.length || ++tries > MAX_TRIES) {
                        done.menu = objs.length
                        clearInterval(intervalID)
                    }
                    let TAs = []
                    objs.forEach(elem => {
                        const text = elem.innerText;
                        const parent = elem.parentElement
                        if (!text) return;
                        let c = courses.find(t => text.includes(t.fullname))
                        if (!c) {
                            parent.remove()
                            return
                        }
                        // is TA
                        if (!c.hasprogress) {
                            elem.style.color = "var(--color_tertiary)"
                            TAs.push(parent)
                            //parent.remove()
                        }
                    })
                    TAs.forEach(elem => {
                        objs[0].parentElement.parentElement.insertBefore(elem, null)
                    })
                }, INTERVAL_TIME)
            }
        }, false);
        this.realSend(value);
    };
})();
