// ==UserScript==
// @name         장애인인식개선교육
// @namespace    http://mnd.nhi.go.kr/
// @version      0.1
// @description  장애인인식개선교육
// @author       You
// @match        http*://*.nhi.go.kr/study/*
// @icon         https://www.google.com/s2/favicons?domain=go.kr
// @grant window.onurlchange
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function get_document() {
        let doc = window.top.frames[0].document.querySelector('#sub-frame-contents').contentDocument.querySelector('#contentFrame').contentDocument;

        return doc;
    }


    function wait_playbutton(event) {
        let playbutton = get_document().getElementById('play');
        if (playbutton) {
            playbutton.click();
        } else {
            console.log('Cannot find play button element');
        }
    }


    function main(event) {
        function get_second(s) {
            let times = /(\d{2}):(\d{2})/;
            let match = times.exec(s);
            let t = parseInt(match[1]) * 60 + parseInt(match[2]);
            return t;
        }

        let doc = get_document();
        let next_button = doc.getElementsByClassName('next arrow')[0];

        // progress
        let time_cur_str = doc.querySelector('.curTime').textContent;
        let time_total_str = doc.querySelector('.tolTime').textContent;

        let current_time = get_second(time_cur_str);
        let total_time = get_second(time_total_str);

        // click visible play button
        if (getComputedStyle(get_document().getElementById('play')).display == 'block') {
            window.setTimeout(wait_playbutton, 5000);
        }

        console.log(`Checking : ${current_time} / ${total_time}`);
        if (current_time >= total_time) {
            next_button.click();
            window.setTimeout(wait_playbutton, 5000);
        }
    }

    let main_interval = window.setInterval(main, 5000);
    // window.clearInterval(main_interval)

})();
