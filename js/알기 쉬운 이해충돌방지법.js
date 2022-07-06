// ==UserScript==
// @name         알기 쉬운 이해충돌방지법
// @namespace    http://mnd.nhi.go.kr/
// @version      0.1
// @description  Tested on 4대 폭력 예방
// @author       You
// @match        http*://*.nhi.go.kr/study/*
// @icon         https://www.google.com/s2/favicons?domain=go.kr
// @grant        @grant window.onurlchange
// @run-at       document-start
// ==/UserScript==


// 답안
// https://blog.naver.com/zzaok/222745628252
// https://blog.naver.com/kimht0609/222798228156
// https://blog.naver.com/jssunny72/222771265115


function main(event) {
    function get_doc() {
        //let doc = document.querySelector('#sub-frame-contents').contentDocument;
        //let doc = window.frames[0].document;
        //let doc = window.document;
        //let doc = document.querySelector('#learning').contentDocument.querySelector('#sub-frame-contents').contentDocument.querySelector('#contentFrame').contentDocument;
    
        //let doc = window.frames[0].document.querySelector('#contentFrame').contentDocument;
        let doc = window.frames[0].document.querySelector('#sub-frame-contents').contentDocument.querySelector('#contentFrame').contentDocument;
        
        return doc;
    }

    let doc = get_doc();
    // next
    let next_button = doc.querySelector('#nextBubble');

    // progress
    let time_str = doc.querySelector('#time');
    let times = /(\d{2}):(\d{2})[ /]+(\d{2}):(\d{2})/;
    let match = times.exec(time_str.textContent);
    let current_time = parseInt(match[1]) * 60 + parseInt(match[2]);
    let total_time = parseInt(match[3]) * 60 + parseInt(match[4]);

    console.log(`Polling : ${current_time} / ${total_time}`);
    if (current_time >= total_time) {
        // click
        next_button.click();
    }
}


main_interval = window.setInterval(main, 5000);
