// let testing = true
var dataTest1 = {}

let popupDataBg = chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    console.log('1: ', JSON.stringify(msg, null, 4))
    return msg
  })
})

window.jsonData = 'BGData'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(' ')
  console.log('2: ', request)
  jsonData = request
  // popup(request)
})

// console.log(`test: ${JSON.stringify(jasonDatatest, null, 4)}`)
// chrome.runtime.onMessage.addListener(receiver);

// function receiver(request, sender, sendResponse) {
//   console.log(request);
//   json = request.text;
// }

chrome.browserAction.onClicked.addListener(tab => {
  console.log('click')
})

function buttonClicked(tab) {
  // The user clicked the button!
  // 'tab' is an object with information about the current open tab

  console.log(tab)
  console.log(popupDataBg)
}
// chrome.extension.onConnect.addListener(function(port) {
//   console.log('Connected .....')
//   port.postMessage(msg)
//   port.onMessage.addListener(function(hi) {
//     console.log('message recieved: ' + hi)
//     //port.postMessage(msg)
//   })
// })

// function popup(tab) {
//   let pop = 'popup.html'

//   chrome.browserAction.setPopup({ html: pop })
// }

// var myPromise = new Promise(function(resolve, reject) {
//   setTimeout(resolve, 10000)
// })
// let start = false
// async function setup() {
//   createCanvas(200, 300)
//   // await blocks until the promise is resolved
//   // await myPromise
//   await popupDataBg
//   console.log(JSON.stringify(popupDataBg, null, 4))
//   textAlign(LEFT)
//   textSize(40)
//   text(popupDataBg.analysis.magnitude, 0, 40)
//   start = true
// }
// function draw() {
//   if (start) {
//     return
//   }
// }
