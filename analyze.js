//console.log('bla', chrome)

// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//   const { url } = tabs[0]
const windowUrl = document.location.href
console.log(windowUrl)

const wikiData = wikiSearch =>
  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=
  ${wikiSearch}`)
    .then(res => res.json())
    .then(wiki => (wiki.query.search[0] ? wiki.query.search[0].snippet : null))
    .then(snippet => {
      if (!snippet) return null
      //console.log(snippet)
      return fetch(`https://cc-api-tree.glitch.me/striptags?text=${snippet}`)
        .then(res => res.json())
        .then(api => {
          console.log(api.text)
          return api.text
        })
    })
//console.log(snippet)
//console.log(wiki)
//const search = wiki.query.search
//console.log(search[0].snippet)
const data = fetch(`https://cc-api-tree.glitch.me/google?url=${windowUrl}`)
  .then(res => res.json())
  .then(api => {
    return api
    const { magnitude, score } = api.analysis
    //const { name, confidence } = api.classification[0]
    //console.log(`name: ${name}, confidence: ${confidence}`)
    console.log(`score: ${score}, magnitude: ${magnitude}`)
    api.classification.forEach(category => {
      console.log(`Name: ${category.name}, Confidence: ${category.confidence}`)
    })
    api.entitySentiment.forEach(entity => {
      //console.log(`Name: ${entity.name}, Type: ${entity.type}`)
      if (
        (entity.type == 'PERSON' ||
          entity.type == 'LOCATION' ||
          entity.type == 'ORGANIZATION' ||
          entity.type == 'WORK_OF_ART' ||
          entity.type == 'DATE' ||
          entity.type == 'ADDRESS' ||
          entity.type == 'PHONE_NUMBER' ||
          entity.type == 'CONSUMER_GOOD' ||
          entity.type == 'EVENT') &&
        entity.salience >= 0.0009
      ) {
        console.log(
          `Name: ${entity.name}, Type: ${entity.type}, Salience: ${entity.salience}`
        )
        if (entity.type == 'ORGANIZATION') {
          wikiData(entity.name).then(wiki => {
            const text = `Name: ${entity.name}, Type: ${entity.type}, Salience: ${entity.salience}, Wiki: ${wiki}`
            console.log(text)
            //$('#popup').append(text)
          })
        }
      } else {
        return
      }
    })

    //console.log(api.classification.name)
    //$('#popup').text(JSON.stringify(results)
  })

function Branch(begin, end) {
  this.begin = begin
  this.end = end
  this.finished = false

  this.jitter = function () {
    this.end.x += random(-1, 1)
    this.end.y += random(-1, 1)
  }

  this.show = function () {
    stroke(255)
    line(this.begin.x, this.begin.y, this.end.x, this.end.y)
  }

  this.branchA = function () {
    var dir = p5.Vector.sub(this.end, this.begin)
    dir.rotate(PI / 6)
    dir.mult(0.67)
    var newEnd = p5.Vector.add(this.end, dir)
    var b = new Branch(this.end, newEnd)
    return b
  }
  this.branchB = function () {
    var dir = p5.Vector.sub(this.end, this.begin)
    dir.rotate(-PI / 4)
    dir.mult(0.67)
    var newEnd = p5.Vector.add(this.end, dir)
    var b = new Branch(this.end, newEnd)
    return b
  }
}

function sending(send) {
  chrome.runtime.sendMessage(send, response => {
    if (chrome.runtime.lastError) {
      setTimeout(sending, 1000)
      console.log('error')
    } else {
      console.log('sent!')
    }
  })
}

async function dataToBackground() {
  console.log('Sending Request')
  const sendData = await data
  console.log(`Testing: ${JSON.stringify(sendData, null, 4)}`)

  sending(sendData)
}

dataToBackground()

// chrome.runtime.onMessage.addListener(receiver)

// // Callback for when a message is received
// function receiver(request, sender, sendResponse) {
//   if (request.message === 'user clicked!') {
//     console.log(`recived: ${request.message}`)
//   }
// }
// chrome.runtime.onMessage.addListener(gotMessage => {
//   console.log(gotMessage.clicked)
//   if (gotMessage.clicked) {

//   } else {
//     return
//   }
// })

//ellipse(50, 50, 80, 80)
