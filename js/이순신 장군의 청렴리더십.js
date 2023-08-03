// ==UserScript==
// @name         알기 쉬운 이해충돌방지법
// @namespace    http://mnd.nhi.go.kr/
// @version      2023
// @description  알기 쉬운 이해충돌방지법
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


function searchFrame(id) {                                     // id = the id of the wanted (i)frame
    var result = null,                                         // Stores the result
        search = function (iframes) {                          // Recursively called function
            var n;                                             // General loop counter
            for (n = 0; n < iframes.length; n++) {             // Iterate through all passed windows in (i)frames
                if (iframes[n].frameElement.id === id) {       // Check the id of the (i)frame
                    result = iframes[n];                       // If found the wanted id, store the window to result
                }
                if (!result && iframes[n].frames.length > 0) { // Check if result not found and current window has (i)frames
                    search(iframes[n].frames);                 // Call search again, pass the windows in current window
                }
            }
        };
    search(window.top.frames);                                  // Start searching from the topmost window
    return result;                                              // Returns the wanted window if found, null otherwise
}

function main(event) {
    var doc = searchFrame('contentFrame').document;
    // next
    let next_button = doc.querySelector('.nextBtn');
    let voice_speed = doc.querySelector('.speedUp');
    if (voice_speed) {
        let current_voice_speed = doc.querySelector('.vod-speed').innerText;
        // if (current_voice_speed != '1.5 x') {
        //     console.log('Speeding up play speed to x1.5');
        //     voice_speed.children[0].click();
        // }
    }
    
    // progress
    let current_time = doc.querySelector('.curTimer').innerText;
    let total_time = doc.querySelector('.totalTimer').innerText;

    console.log(`Checking : ${current_time} / ${total_time}`);
    if (current_time == total_time) {
        let page_info = doc.querySelector('.pageNum').innerText;
        let tokens = page_info.split('/');
        let cp = tokens[0].trim();
        let tp = tokens[1].trim();
        console.log(`Page : ${cp} / ${tp}`);
        if (cp != tp)
            next_button.children[0].click();
        else
            window.top.close();
    }
}


window.setInterval(main, 1000);
// window.clearInterval(main_interval)
