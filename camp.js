
var oda_queue = [];
let isUpdating = false;



function setOdaSmall(data, index) {

    oda = data.oda;
    number = data.number;


    const elements = Array.from(document.querySelectorAll(".mx-6.flex.flex-col.pt-24 div div div div img.duration-500"));
    if (index >= 0 && index < elements.length) {
        const parent = elements[index].parentNode;
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.display = 'flex';
        div.style.top = '60px';
        div.style.width = '100%';
        
        if (data.Ability1) {
            const img1 = document.createElement('img');
            img1.src = data.Ability1;
            img1.style.width = '30px'; // Adjust the width as needed
            div.appendChild(img1);
        }
        
        if (data.Ability2) {
            const img2 = document.createElement('img');
            img2.src = data.Ability2;
            img2.style.width = '30px'; // Adjust the width as needed
            img2.style.marginLeft = 'auto';
            div.appendChild(img2);
        }
        
        isUpdating = true;
        parent.appendChild(div);
//        console.log("parent: ", parent);

/*        if (data.WeaponType) {
            const span2 = document.createElement('span');
            span2.style.fontSize = 'smaller';
            span2.style.marginTop = '5px';
            span2.title = data.WeaponDescription;
            span2.innerText = data.WeaponType;
            parent.appendChild(span2);
        }*/
        isUpdating = false;
    } else {
        console.error("index out of bounds: ", index);
    }

}
function setOda(data, index) {
    oda = data.oda;
    number = data.id;
    if (index == -1) {
        // if data.Ability2 is null then it's a mara otherwise it's a koda
        // we need to get the mara by setting UPPERCASE MARA/KODA #NUMBER 
        const searchMara = data.Ability2 ? "Koda #"+number : "Mara #"+number;
        let element = Array.from(document.querySelectorAll("#__next div.grid > div > div.cursor-pointer > div > span"))
                      .filter(el => el.textContent.includes(searchMara));
        if (element.length === 0) {
            console.error("element not found: ", searchMara);
            return;
        } else {
            let div = document.createElement('div');
            div.className = "absolute flex w-full items-center justify-evenly";
            div.style.bottom = '65%';
            div.style.padding = '5px';
            div.style.backgroundColor = '#0004';
            

            if (data.Ability1) {
                let img = document.createElement('img');
                img.src = data.Ability1;
                img.style.width = '40px';
                div.appendChild(img);
            }
            if (data.Ability2) {
                let img = document.createElement('img');
                img.src = data.Ability2;
                img.style.width = '40px';
                div.appendChild(img);
            }
            isUpdating = true;
            element[0].parentNode.appendChild(div);
            if (data.WeaponType) {
                let div2 = document.createElement('div');
                div2.className = "absolute flex w-full items-center justify-evenly";
                div2.style.bottom = '35%';
                div2.style.padding = '5px';
                div2.style.backgroundColor = '#0004';
                let span2 = document.createElement('span');
                span2.style.fontSize = 'smaller';
                span2.style.marginTop = '5px';
                span2.title = data.weaponDescription ? data.weaponDescription : 'Unknown';
                span2.innerText = data.WeaponType ? data.WeaponType : 'Unknown';
                div2.appendChild(span2);
                element[0].parentNode.appendChild(div2);
            }
            isUpdating = false;
        }
    } else {
        let elements = Array.from(document.querySelectorAll("#__next main div > div > div > a > div"));
        if (index >= 0 && index < elements.length) {
            let parent = elements[index];

            let span = document.createElement('span');
            span.style.display = 'flex';
            if (data.Ability1) {
                let img1 = document.createElement('img');
                img1.src = data.Ability1;
                img1.style.width = '40px';
                span.appendChild(img1);
            }
            if (data.Ability2) {
                let img2 = document.createElement('img');
                img2.src = data.Ability2;
                img2.style.width = '40px';
                span.appendChild(img2);
            }
            isUpdating = true;
            parent.appendChild(span);

            if (data.WeaponType) {
                let span2 = document.createElement('span');
                span2.style.fontSize = 'smaller';
                span2.style.marginTop = '5px';
                span2.title = data.weaponDescription ? data.weaponDescription : 'Unknown';
                span2.innerText = data.WeaponType;
                parent.appendChild(span2);
            }
            isUpdating = false;
        }
    }
}


// Helper function to send message and set data
function sendMessageAndSetData(el, index, oda, number, callback) {
    chrome.runtime.sendMessage({oda: oda, number: number, position: index}, function(response) {
      callback(response.data, response.position);
    });
    el.setAttribute('data-castiel-done', 'true');
}
  
  // Function to be called when the span becomes visible
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let el = entry.target;
        // if el is img, get the parent div
        if (el.tagName === "IMG") {
            let pel = el.parentNode;
            // if we have 2 children, it's the one with the abilities
            if (pel.children.length === 3) {
                el = pel;
                // if we have 3 children, it's all goot return
                return;
            } else {
                // take element after parent
                el = el.parentNode.nextElementSibling
                // extract koda/mara and number
                // check if innerText defined
                if (el.innerText === undefined) {
                    return;
                }
                const tokenId = el.innerText;
                let [oda, number] = tokenId.split(" ");
                // check if number undefined
                if (number === undefined) {
                    console.log("number is undefined: ", tokenId);
                } else if (number.includes("#")) {
                    number = number.replace("#", "");
                    if (oda === "KODA" || oda === "MARA") {
                        sendMessageAndSetData(el, -1, oda, number, setOda);
                    }
                    observer.unobserve(el);
                } else {
                    console.log("number does not contain #: ", number);
                }

            }
        }
        if (el.getAttribute('data-castiel-done') !== 'true') {
          const tokenId = el.innerText;
          let [oda, number] = tokenId.split(" ");
          // check if number undefined
            if (number === undefined) {
                console.error("number is undefined: ", tokenId);
            } else if (number.includes("#")) {
              number = number.replace("#", "");
              if (oda === "KODA" || oda === "MARA") {
                const index = [...el.parentNode.parentNode.parentNode.children].indexOf(el.parentNode.parentNode);
                sendMessageAndSetData(el, index, oda, number, setOda);
              }
              observer.unobserve(el);
            } else {
                console.log("number does not contain #: ", number);
          }
        }
      }
    });
  }

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

const observer = new IntersectionObserver(handleIntersection, options);

let observerTimeout = null;

// Set up a MutationObserver to react to changes in the DOM
last_update = Date.now();
let last_update_url = null;
const Mutationobserver = new MutationObserver((mutations) => {
    if (isUpdating) return;
    let shouldUpdate = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length || mutation.attributeFilter && mutation.attributeFilter.includes('data-token-id')) {
            shouldUpdate = true;
            break;
        }
    }
    if (last_update && Date.now() - last_update < 1000) {
        shouldUpdate = false;
    }
    if (shouldUpdate) {

        clearTimeout(observerTimeout); // Clear any previously set timeout to avoid multiple triggers
        observerTimeout = setTimeout(() => {

            const spansToDoSmall = document.querySelectorAll(".mx-6.flex.flex-col.pt-24 div div div div img.duration-500");
            // foreach if data-castiel-done !== true, call sendMessageAndSetDataSmall
            spansToDoSmall.forEach((el, index) => {
                if (el.getAttribute('data-castiel-done') !== 'true') {
                    // look up the parent div and get the data-token-id, tha's the number
                    number = el.parentNode.getAttribute('data-token-id');
                    // we can get oda from src of the image, if it contains koda it's koda, otherwise it's mara
                    oda = el.src.includes('koda') ? 'koda' : 'mara';
                    sendMessageAndSetData(el, index, oda, number, setOdaSmall);
                }
            });



            const spansToObserve = document.querySelectorAll("#__next div.grid > div > div > span");

            spansToObserve.forEach(span => {
                if (span.getAttribute('data-castiel-done') !== 'true') {
                    observer.observe(span);
                }
            });

            
            const ActiveImgToObserve = document.querySelectorAll("#__next div.grid > div > div.cursor-pointer > div > div > img");
            ActiveImgToObserve.forEach(img => {
                if (img.getAttribute('data-castiel-done') !== 'true') {
                    observer.observe(img);
                }
            });


            last_update_url = window.location.href;
            last_update = Date.now(); // Update the last update timestamp after setting up the observer
        }, 1000);


    }
});



// Start observing the body for changes
Mutationobserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-token-id']
});


// content.js
function sortDivs() {
    // todo :)
}
