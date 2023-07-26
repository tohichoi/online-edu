// var txtClinic = searchFrame('IFRAME_ID').document.getElementById('clinicFlag');

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

    console.log(`Checking ${current_time.innerText} / ${total_time.innerText}`);

    let ct = current_time.innerText.split(':');
    let tt = total_time.innerText.split(':');

    if (ct[0] == tt[0] && ct[1] == tt[1]) {
        console.log('To next')
        next_button.click();
    }
}

interval_id = setInterval(auto_click, 1000);
