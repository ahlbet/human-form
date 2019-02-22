let cx, cy, timeAliveSlider, timeAliveSliderLabel
let chooseHeadButton
let globalDrawingShape
let globalTimeAlive
const canvasWidth = 750
const centers = []
const bodies = []
const HORIZONTAL_LINE = "Horizontal Line"
const VERTICAL_LINE = "Vertical Line"
const HEAD = "Head"

function setup() {
  createCanvas(canvasWidth, windowHeight)
  background(235)

  timeAliveSlider = createSlider(100, 1000, 500)
  timeAliveSlider.position(canvasWidth + 50, windowHeight / 2)
  timeAliveSlider.touchMoved(updateTimeAlive)
  timeAliveSliderLabel = createP(`Time Alive: ${timeAliveSlider.value()}ms`)
  timeAliveSliderLabel.position(timeAliveSlider.x + timeAliveSlider.width + 20, (windowHeight / 2) - timeAliveSlider.height)

  chooseHeadButton = createButton(HEAD)
  chooseHeadButton.position(canvasWidth + 50, (windowHeight / 2) - 50)
  chooseHeadButton.mousePressed(() => chooseDrawingShape(HEAD))

  cx = width / 2
  cy = 300
}

function draw() {
  noFill()
  stroke(33, 3)
  centers.forEach(c => {
    if (c.timeAlive < c.maxTimeAlive && !c.isDone) {
      drawHuman(c.cx, c.cy, c.scale, c.timeAlive)
      increaseScale(c, c.scale)
      increaseTimeAlive(c, c.timeAlive)
    } else {
      c.isDone = true
    }
  })

  bodies.forEach(b => {
    if (b.timeAlive < b.maxTimeAlive && !b.isDone) {
      drawBody(b.cx, b.cy, 100, b.scale)
      increaseScale(b, b.scale)
      increaseTimeAlive(b, b.timeAlive)
    } else {
      b.isDone = true
    }
  })
}

function chooseDrawingShape(shape) {
  switch (shape) {
    case HEAD:
      globalDrawingShape = HEAD
      break
    case HORIZONTAL_LINE:
      globalDrawingShape = HORIZONTAL_LINE
      break
    case VERTICAL_LINE:
      globalDrawingShape = VERTICAL_LINE
      break
  }
}

function updateTimeAlive() {
  globalTimeAlive = timeAliveSlider.value()
  timeAliveSliderLabel.html(`Time Alive: ${globalTimeAlive}ms`)
}

function mousePressed(event) {
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= height) {
    const defaultObj = {
      cx: mouseX,
      cy: mouseY,
      scale: 0,
      timeAlive: 0,
      isDone: false,
      maxTimeAlive: globalTimeAlive,
    }
    if (event.shiftKey) {
      bodies.push(defaultObj)
    } else {
      centers.push(defaultObj)
    }
  }
}

function drawHuman(cx, cy, scale) {
  drawHead(cx, cy, 80, 175, 0.05, scale)
  // drawBody(cx - 20, cy, 300)
  // drawBody(cx + 20, cy, 300)
  // drawBody(cx, cy, 300)
}

function drawBody(cx, cy, r, scale) {
  beginShape()
  const slow = 1.5
  for (let i = 0; i < r; i += 10) {
    let x = cx + generateNoiseShift(i / slow, scale / slow, null)
    let y = cy + generateNoiseShift(i / slow, scale / slow, x / slow) + i
    vertex(x, y)
  }
  endShape()
}

function drawNose(cx, cy, scale) {
  const top = 4
  const bottom = 2
  beginShape()
  for (let i = 0; i < top; i += 0.5) {
    vertex(cx + generateNoiseShift(i * random(), scale * 2, null), generateNoiseShift(i + random(), scale * 2, null) + cy - (i * 10))
  }
  endShape()
  beginShape()
  for (let i = 0; i < bottom; i += 0.5) {
    vertex(generateNoiseShift(i * random(), scale * 2, null) + cx + (i * 10), generateNoiseShift(i - random(), scale * 2, null) + cy)
  }
  endShape()
}

function drawMouth(cx, cy, xR, yR, n, scale) {
  beginShape()
  for (let a = 0; a < TWO_PI; a += n * 4) {
    let x = generateNoiseShift(a, scale, null) + xR * cos(a) + cx
    let y = generateNoiseShift(a, scale, x) + yR * sin(a) + cy
    vertex(x, y)
  }
  endShape()
}

function drawEye(cx, cy, xR, yR, n, scale) {
  beginShape()
  for (let a = 0; a < TWO_PI; a += n * 4) {
    let x = generateNoiseShift(a, scale, null) + xR * cos(a) + cx
    let y = generateNoiseShift(a, scale, x) + yR * sin(a) + cy
    vertex(x, y)
  }
  endShape()
}

function drawFace(cx, cy, xR, yR, n, scale) {
  drawMouth(cx, cy + 100, 30, 13, n, scale)
  drawEye(cx - 33, cy, 15, 8, n, scale)
  drawEye(cx + 33, cy, 15, 8, n, scale)
  drawNose(cx - 10, cy + 50, scale)
}

function drawHead(cx, cy, xR, yR, n, scale) {
  beginShape()
  for (let a = 0; a < TWO_PI; a += n) {
    let x, y
    (a >= 0 && a < PI) ? y = generateNoiseShift(a, scale, null) + yR * sin(a) + cy : y = generateNoiseShift(a, scale, null) + xR * sin(a) + cy
    x = generateNoiseShift(a, scale, y) + xR * cos(a) + cx
    vertex(x, y)
  }
  endShape(CLOSE)
  drawFace(cx, cy, 50, 90, n, scale)
}

function increaseTimeAlive(c, time) {
  return c.timeAlive = time + 1
}

function increaseScale(c, scale) {
  return c.scale = scale + 0.1
}

function generateNoiseShift(a, scale, o) {
  return o ? map(noise(o / 10, a, a * ((frameCount / 100) + 1)), 0, 1, -scale, scale) : map(noise(PI, a, a * ((frameCount / 100) + 1)), 0, 1, -scale, scale)
}