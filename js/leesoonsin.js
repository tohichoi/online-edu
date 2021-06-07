// ==UserScript==
// @name         이순신장군의 청렴리더십
// @namespace    http://mnd.nhi.go.kr/
// @version      0.1
// @description  Tested on 이순신장군의 청렴리더십, 공직자를 위한 신목민심서 in 나라배움터
// @author       You
// @match        http://mnd.nhi.go.kr/study/*
// @icon         https://www.google.com/s2/favicons?domain=go.kr
// @grant        @grant window.onurlchange
// @run-at       document-start
// ==/UserScript==


// 공직자를 위한 신목민심서 평가
// https://m.blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=aesis100&logNo=221020051885&categoryNo=25&proxyReferer=
(function() {
    'use strict';
    var frame1 = null;
    var frame2 = null;

    // 윈도우 confirm 클릭
    // https://newbedev.com/how-to-override-the-alert-function-with-a-userscript
    function set_confirm_scope() {
        var confirmScope;
        if (typeof unsafeWindow === "undefined") {
            confirmScope = window;
        } else {
            confirmScope = unsafeWindow;
        }

        confirmScope.confirm = function (str) {
            console.log ("Intercepted confirm: ", str);
            return true;
        }
    }

    function get_document() {
        for (let i=0; i<frames.length; i++) {
            if (frames[i].window.name === "learning") {
                frame1=frames[i].document.getElementsByTagName('iframe')['sub-frame-contents'];
                frame2=frame1.contentDocument.getElementById("contentFrame");
                return frame2.contentDocument;
            }
        }
        return null;
    }


    function check_complete(doc) {
        if (doc == null)
            return;

        set_confirm_scope();

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
                } else {
                    //let re = new RegExp('ab+c');
                    let current_chapter = parseInt(document.getElementById("turnHeader").innerText.match(/^[0-9]+/));
                    let last_chapter = document.getElementById("turnList").children.length;
                    //let doc = get_document();
                    window.document.getElementById(`list-group-item-${current_chapter+1}`).click();
                    setTimeout(function() {
                        window.document.querySelector("div.toggle").click();
                    }, 2000);
                }
            } catch (err) {
                return;
            }
            //window.clearInterval(this);
        }
    }

    function main() {
        try {
            check_complete(get_document());
        } catch (err) {
            return;
        }
    }

    window.setInterval(main, 5000);

    // 다음 차시로 넘어갈 때 event 발생되지 않음
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOMContentLoaded');
        //window.setInterval(main, 1000);
        main();
    });
})();