const bgpage = chrome.extension.getBackgroundPage()
const popupData = bgpage.jsonData

// async function loadData() {
//   popupData = await bgpage.jsonData
console.log(`Testing: ${JSON.stringify(popupData, null, 4)}`)
// }

console.log(JSON.stringify(popupData, null, 4))

//-----------------------------------
function Branch(begin, end, position) {
  this.begin = begin
  this.end = end
  this.finished = false
  this.position = position

  //this.position = map(this.position, 0, 1000, 2, 10);

  this.jitter = function () {
    this.end.x += random(-0.01, 0.01)
    this.end.y += random(-0.1, 0.0001)
  }

  this.show = function (index) {
    //console.log(index);
    stroke(35, 31, 32)
    strokeWeight(5)
    line(this.begin.x, this.begin.y, this.end.x, this.end.y)
  }

  this.branchA = function (x) {
    var dir = p5.Vector.sub(this.end, this.begin)
    dir.rotate(PI / random(6, 10))
    dir.mult(0.67)
    var newEnd = p5.Vector.add(this.end, dir)
    var b = new Branch(this.end, newEnd, x)
    return b
  }
  this.branchB = function (x) {
    var dir = p5.Vector.sub(this.end, this.begin)
    dir.rotate(-PI / random(6, 10))
    dir.mult(0.67)
    var newEnd = p5.Vector.add(this.end, dir)
    var b = new Branch(this.end, newEnd, x)
    //console.log(x)
    return b
  }
}
//-------------------------------
let entityNumber
let leavesColor

function setup() {
  createCanvas(200, 300)

  entityNumber = Object.keys(popupData.entitySentiment).length
  console.log("Sentiment: ", popupData.analysis.score);
  leavesColor = {
    r: map(popupData.analysis.score, -1, 1, 255, 0),
    g: map(popupData.analysis.score, -1, 1, 0, 255)
  }
  let a = createVector(width / 2, height)
  let b = createVector(width / 2, height - 50)
  let w = 10
  let root = new Branch(a, b, w)

  tree[0] = root

  entityNumber = Math.floor(map(entityNumber, 0, 500, 1, 12))
  console.log(entityNumber)
  for (var i = entityNumber; i >= 0; i--) {
    createTree()
    imageTree()
  }
  //loadData()
}
function draw() {
  textAlign(LEFT)
  textSize(20)
  text(`Magnitude: ${popupData.analysis.magnitude}`, 0, 60)
  text(popupData.classification[0].name, 0, 20)
  if (typeof popupData.classification[1].name == 'undefined') {
  } else {
    text(popupData.classification[1].name, 0, 40)
  }
}

let tree = []
let leaves = []
let count = 0
let pressed = false

function createTree() {
  for (var i = tree.length - 1; i >= 0; i--) {
    if (!tree[i].finished) {
      x = i
      tree.push(tree[i].branchA(x))
      tree.push(tree[i].branchB(x))
    }
    tree[i].finished = true
  }
  count++

  if (count === entityNumber) {
    for (var i = 0; i < tree.length; i++) {
      if (!tree[i].finished) {
        var leaf = tree[i].end.copy()
        leaves.push(leaf)
      }
    }
  }
}

function imageTree() {
  background(255)

  for (var i = 0; i < tree.length; i++) {
    tree[i].show(i)
    //tree[i].jitter();
  }
  for (var j = 0; j < leaves.length; j++) {
    let c = random(8, 20)
    fill(leavesColor['r'] + random(-5, 5), leavesColor['g'] + random(-5, 5), random(-5, 5));
    noStroke()
    ellipse(leaves[j].x, leaves[j].y, c, c)
    leaves[j].y += random(0, 2)
    if (pressed) {
      leaves[j].y += random(0, 2)
      leaves[j].x += random(-1, 1)
    }
  }
}

function mousePressed() {
  pressed = true
}
