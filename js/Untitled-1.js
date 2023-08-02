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


function auto_click() {
    let doc = searchFrame('html5Main').document;
    if (!doc) {
        console.log('Cannot find document object');
        return 
    }

    let current_time = doc.querySelector('.curTimer');
    let total_time = doc.querySelector('.totalTimer');
    let next_button = doc.querySelector('.nextBtn > a');
    let current_page = doc.querySelector('.pageNum');
    let total_page = doc.querySelector('.totalPageNum');
    let voice_speed = doc.querySelector('.vod-speed2');
    let current_voice_speed = doc.querySelector('.vod-speedTxt').innerText; 

    if (current_voice_speed != 'x1.5') {
        console.log('Speeding up play speed to x1.5')
        voice_speed.children[0].click();
    }

    console.log(`Checking ${current_time.innerText} / ${total_time.innerText}`);

    let ct = current_time.innerText.split(':');
    let tt = total_time.innerText.split(':');
    let cp = current_page.innerText;
    let tp = total_page.innerText;
    let icp = parseInt(cp);
    let itp = parseInt(tp);

    if (ct[0] == tt[0] && ct[1] == tt[1]) {
        if (cp != tp) {
            console.log('To next episode')
            next_button.click();
        }
        else {
            // 프레임내의 document element 가 아님
            let doc2 = document; 
            let chapter_list = doc2.querySelector('#turnList').children;
            let current_chapter = doc2.querySelector('#turnHeader');
            let icc = parseInt(current_chapter.innerText);
            let itc = chapter_list.length - 1;

            if (icc == itc) {
                console.log('To next chapter');
                chapter_list[icc - 1].children[1].click();
            } else {
                console.log('All finished');
                window.top.close();
            }

            // console.log('Chapter finished')
            // window.top.close();
        }
    }
}

interval_id = setInterval(auto_click, 1000);
