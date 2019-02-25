let cx, cy
let timeAliveSlider, timeAliveSliderLabel
let sketchCanvas, strokeColorPicker, strokeColorPickerLabel
let globalStrokeColor
let chooseHeadButton, chooseHorizontalLineButton, chooseVerticalLineButton
let saveButton, clearButton
let globalTimeAlive = 500
const canvasWidth = 750
const heads = []
const verticalLines = []
const horizontalLines = []
const HORIZONTAL_LINE = "Horizontal Line"
const VERTICAL_LINE = "Vertical Line"
const HEAD = "Head"
const maxAliveShapes = 5
let globalDrawingShape = HEAD
let globalDrawingShapeLabel

function setup() {
  sketchCanvas = createCanvas(canvasWidth, windowHeight)
  background(235)
  initializeDOM()
  cx = width / 2
  cy = 300
}

function draw() {
  noFill()
  stroke(globalStrokeColor)
  drawShapes()
  // updateTimeAlive()
}

function clearSketch() {
  sketchCanvas.background(235)
  heads.length = 0
  verticalLines.length = 0
  horizontalLines.length = 0
}

function setStrokeColor() {
  globalStrokeColor = strokeColorPicker.color()
  globalStrokeColor.setAlpha(3)
}

function saveSketch() {
  save()
}

function calculateMaxAliveShapes() {
  let allShapes = heads.concat(verticalLines).concat(horizontalLines)
  let aliveShapesCount = 0
  for (let i = 0; i < allShapes.length; i++) {
    if (!allShapes[i].isDone) {
      aliveShapesCount++
    }
  }
  return aliveShapesCount
}

function drawShapes() {
  heads.forEach(h => {
    if (h.timeAlive < h.maxTimeAlive && !h.isDone) {
      drawHead(h.cx, h.cy, 80, 175, 0.05, h.scale)
      increaseScale(h, h.scale)
      increaseTimeAlive(h, h.timeAlive)
    } else {
      h.isDone = true
    }
  })

  verticalLines.forEach(vl => {
    if (vl.timeAlive < vl.maxTimeAlive && !vl.isDone) {
      drawVerticalLine(vl.cx, vl.cy, 100, vl.scale)
      increaseScale(vl, vl.scale)
      increaseTimeAlive(vl, vl.timeAlive)
    } else {
      vl.isDone = true
    }
  })

  horizontalLines.forEach(hl => {
    if (hl.timeAlive < hl.maxTimeAlive && !hl.isDone) {
      drawHorizontalLine(hl.cx, hl.cy, 100, hl.scale)
      increaseScale(hl, hl.scale)
      increaseTimeAlive(hl, hl.timeAlive)
    } else {
      hl.isDone = true
    }
  })
}

function chooseDrawingShape(shape) {
  switch (shape) {
    case HEAD:
      globalDrawingShape = HEAD
      globalDrawingShapeLabel.html(`Chosen Shape: ${globalDrawingShape}`)
      break
    case HORIZONTAL_LINE:
      globalDrawingShape = HORIZONTAL_LINE
      globalDrawingShapeLabel.html(`Chosen Shape: ${globalDrawingShape}`)
      break
    case VERTICAL_LINE:
      globalDrawingShape = VERTICAL_LINE
      globalDrawingShapeLabel.html(`Chosen Shape: ${globalDrawingShape}`)
      break
  }
}

function updateTimeAlive() {
  globalTimeAlive = timeAliveSlider.value()
  timeAliveSliderLabel.html(`Time Alive: ${globalTimeAlive}ms`)
}

function mousePressed() {
  if (calculateMaxAliveShapes() > maxAliveShapes) return
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= height) {
    const defaultObj = {
      cx: mouseX,
      cy: mouseY,
      scale: 0,
      timeAlive: 0,
      isDone: false,
      maxTimeAlive: globalTimeAlive,
    }

    switch (globalDrawingShape) {
      case HEAD:
        heads.push(defaultObj)
        break
      case VERTICAL_LINE:
        verticalLines.push(defaultObj)
        break
      case HORIZONTAL_LINE:
        horizontalLines.push(defaultObj)
        break
    }
  }
}

function drawHorizontalLine(cx, cy, r, scale) {
  beginShape()
  const slow = 1.5
  for (let i = 0; i < r; i += 10) {
    let x = cx + generateNoiseShift(i / slow, scale / slow, null) + i
    let y = cy + generateNoiseShift(i / slow, scale / slow, x / slow)
    vertex(x, y)
  }
  endShape()
}

function drawVerticalLine(cx, cy, r, scale) {
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

function initializeDOM() {
  timeAliveSlider = createSlider(100, 1000, 500)
  timeAliveSlider.position(canvasWidth + 50, windowHeight / 2)
  timeAliveSlider.changed(updateTimeAlive)
  timeAliveSliderLabel = createP(`Time Alive: ${globalTimeAlive}ms`)
  timeAliveSliderLabel.position(timeAliveSlider.x + timeAliveSlider.width + 20, (windowHeight / 2) - timeAliveSlider.height)

  globalDrawingShapeLabel = createP(`Chosen Shape: ${globalDrawingShape}`)
  globalDrawingShapeLabel.position(canvasWidth + 50, 50)

  chooseHeadButton = createButton(HEAD)
  chooseHeadButton.position(canvasWidth + 50, 100)
  chooseHeadButton.mousePressed(() => chooseDrawingShape(HEAD))
  chooseHorizontalLineButton = createButton(HORIZONTAL_LINE)
  chooseHorizontalLineButton.position(canvasWidth + 75 + chooseHeadButton.width, 100)
  chooseHorizontalLineButton.mousePressed(() => chooseDrawingShape(HORIZONTAL_LINE))
  chooseVerticalLineButton = createButton(VERTICAL_LINE)
  chooseVerticalLineButton.position(canvasWidth + 100 + chooseHeadButton.width + chooseHorizontalLineButton.width, 100)
  chooseVerticalLineButton.mousePressed(() => chooseDrawingShape(VERTICAL_LINE))

  saveButton = createButton("Save")
  saveButton.position(canvasWidth + 50, (windowHeight / 2) + 50)
  saveButton.mousePressed(saveSketch)

  clearButton = createButton("Clear")
  clearButton.position(canvasWidth + 75 + saveButton.width, (windowHeight / 2) + 50)
  clearButton.mousePressed(clearSketch)

  strokeColorPicker = createColorPicker("#010101")
  strokeColorPicker.position(canvasWidth + 50, 200)
  strokeColorPicker.input(setStrokeColor)
  strokeColorPickerLabel = createP("Stroke Color")
  strokeColorPickerLabel.position(canvasWidth + 75 + strokeColorPicker.width, 200 - (strokeColorPicker.height / 2))
  globalStrokeColor = color(strokeColorPicker.value())
  globalStrokeColor.setAlpha(3)

}