// ==UserScript==
// @name         이순신장군의 청렴리더십
// @namespace    http://mnd.nhi.go.kr/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://mnd.nhi.go.kr/study/*
// @icon         https://www.google.com/s2/favicons?domain=go.kr
// @grant        @grant window.onurlchange
// ==/UserScript==

(function() {
    'use strict';

    function check_complete(doc) {
        //console.log("clicker started");

        let total_time = doc.querySelector("span.totalTimer.notranslate");
        let current_time = doc.querySelector('#mediaControl > div.timer.fl > span.curTimer.notranslate');
        let tt_tokens = total_time.innerText.split(':');
        let ct_tokens = current_time.innerText.split(':');
        let current_sec = parseInt(ct_tokens[0])*60 + parseInt(ct_tokens[1]);
        let total_sec = parseInt(tt_tokens[0])*60 + parseInt(tt_tokens[1]);
        let next = doc.querySelector("#mediaControl > div.addControl > div.nextBtn > a");
        //window.setInterval(check_time.bind(null, current_sec, total_sec, next), 1000);
        console.log('checking time : ' + current_sec + '/' + total_sec);
        if (current_sec >= total_sec) {
            try {
                let tok = doc.querySelector("#mediaControl > div.addControl > div.pageNum.notranslate").innerText.split('/');
                if (parseInt(tok[0].trim()) < parseInt(tok[1].trim())) {
                    next.click();
                }
            } catch (err) {
                return;
            }
            //window.clearInterval(this);
        }
    }

    function main() {
        let doc = null;
        try {
            var frame1=window[0].document.getElementsByTagName('iframe')['sub-frame-contents'];
            var frame2=frame1.contentDocument.getElementById("contentFrame");
            doc = frame2.contentDocument;
        } catch (err) {
            //console.log(err);
            //console.log("Cannot find elements");
            return;
        }

        check_complete(doc);
    }

    window.setInterval(main, 5000);

    // 다음 차시로 넘어갈 때 event 발생되지 않음
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOMContentLoaded');
        //window.setInterval(main, 1000);
        main();
    });
})();
