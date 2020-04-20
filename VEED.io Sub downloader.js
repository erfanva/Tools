// ==UserScript==
// @name         VEED.io Sub downloader
// @namespace    https://github.com/erfanva/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.veed.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // save file from console;
    (function (console) {

        console.save = function (data, filename) {

            if (!data) {
                console.error('Console.save: No data')
                return;
            }

            if (!filename) filename = 'console.json'

            if (typeof data === "object") {
                data = JSON.stringify(data, undefined, 4)
            }

            var blob = new Blob([data], { type: 'text/json' }),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')

            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        }
    })(console)


    let interval1, interval2
    function extract(container) {
        console.log('extract')
        return new Promise((resolve, reject) => {
            container.scroll(0, 0)
            // let subs = {}
            let haveIndex = {}
            let subStr = ''
            let count2 = 0
            interval2 = setInterval(() => {
                if (count2++ > 600 || container.scrollTop + container.clientHeight >= container.scrollHeight) {
                    clearInterval(interval2)
                    // resolve(subs)
                    console.save(subStr, 'sub.srt')
                    resolve(subStr)
                }
                const subsTemp = container.querySelectorAll('div[data-testid]')
                subsTemp.forEach(temp => {
                    try {
                        const index = temp.getAttribute('data-testid').split('subtitle-row-')[1]
                        const times = temp.querySelectorAll('input[data-testid]')
                        let from = times[0].value.replace('.', ',') + '00'
                        if (from.split(':').length < 3) {
                            from = '00:' + from
                        }
                        let to = times[1].value.split('.', ',') + '00'
                        if (to.split(':').length < 3) {
                            to = '00:' + to
                        }
                        const text = temp.querySelector('textarea').value
                        // subs[index] = { from, to, text }
                        if (!haveIndex[index]) {
                            subStr += `${index}\n`
                            subStr += `${from} --> ${to}\n`
                            subStr += `${text}\n\n`
                        }
                        haveIndex[index] = true
                    }
                    catch (e) {

                    }
                })
                container.scroll(0, container.scrollTop + container.clientHeight)
            }, 100)
        })
    }

    console.log('start')
    interval1 = setInterval(() => {
        let container = document.querySelector('div.subtitle-rows-list')
        if (container) {
            clearInterval(interval1)
            extract(container).then((subs) => {
                console.log(subs)
            })
        }
    }, 1000)
})();
