// ==UserScript==
// @name         성인지 원격교육/4대 폭력 예방
// @namespace    http://mnd.nhi.go.kr/
// @version      0.1
// @description  Tested on 4대 폭력 예방
// @author       You
// @match        http*://*.nhi.go.kr/study/*
// @icon         https://www.google.com/s2/favicons?domain=go.kr
// @grant        window.onurlchange
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==


let prev_width = '';
let main_interval = null;
let playbutton_interval = null;


function get_document() {
    try {
        let doc = window.top.frames[0].document.querySelector('#sub-frame-contents').contentDocument.querySelector('#contentFrame').contentDocument;
        if (doc) {
            console.log('Found document : #contentFrame');
            return doc;
        }
    }
    catch (exception) {
        console.log('Cannot find document : #contentFrame');
        return null;
    }
}


function wait_playbutton(event) {
    let playbutton = get_document().getElementsByClassName('st-play')[0];
    if (playbutton) {
        playbutton.click();
    } else {
        console.log('Cannot find play button element');
    }
}


function main(event) {
    let doc = get_document();
    if (!doc) {
        return;
    }
    let progress = doc.querySelector(".progress-range");
    let pagecurrent = doc.getElementsByClassName('pageCurrent')[0];
    let pagetotal = doc.getElementsByClassName('pageTotal')[0];
    let button = doc.getElementById('nextBtn');

    // progress 값 구하기
    if (!progress) {
        console.log('Cannot find "progress-range" element');
        return;
    }
    //const style = getComputedStyle(progress);
    //let current_width = style.width; // in px
    let current_width = progress.style.width; // in percent
    let c = parseInt(pagecurrent.textContent);
    let t = parseInt(pagetotal.textContent);

    console.log(`Checking: ${c}/${t} : ${current_width}`);
    if (current_width == '100%') {
        button.click();
        window.setTimeout(wait_playbutton, 5000);
    } else {
        prev_width = current_width;
    }
}


main_interval = window.setInterval(main, 5000);
// window.clearInterval(main_interval)
