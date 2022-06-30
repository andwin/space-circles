import './style.css'

let circles = []
let score = 0
let lives = 10
let createCirclesInterval
let updateCirclesInterval

const setup = () => {
  const w = document.body.clientWidth
  const h = document.body.clientHeight
  createCanvas(w, h)
  textFont('Rubik Moonrocks')

  createCirclesInterval = setInterval(createCircle, 5000)
  updateCirclesInterval = setInterval(updateCircles, 20)
}

const draw = () => {
  background(5, 66, 135)
  drawText()

  if (lives === 0) {
    return gameOver()
  }

  for (const c of circles) {
    noStroke()
    fill(200, 66, 135)
    circle(c.x, c.y, c.size)
  }
}

const mouseClicked = () => {
  for (const c of circles) {
    if (dist(mouseX, mouseY, c.x, c.y) * 2 < c.size) {
      c.clicked = true
    }
  }
}

const createCircle = () => {
  const margin = 125
  const x = random(margin, width - margin)
  const y = random(margin, height - margin)
  const size = 250

  circles.push({
    x,
    y,
    size,
  })
}

const updateCircles = () => {
  const minSize = 5

  const countBeforeRemovingClicked = circles.length
  circles = circles.filter(c => !c.clicked)
  const clickedCircles = countBeforeRemovingClicked - circles.length
  score += clickedCircles

  for (const c of circles) {
    c.size--
  }

  const circleCountBefore = circles.length
  circles = circles.filter(c => c.size > minSize)
  const removedCircles = circleCountBefore - circles.length
  lives -= removedCircles
}

const drawText = () => {
  const titleBreakpoint = 490
  const bigSize = width < titleBreakpoint ? 42 : 64
  const smallSize = width < titleBreakpoint ? 22 : 34
  const textPadding = width < titleBreakpoint ? 40 : 60
  const extraPadding = 10

  textSize(bigSize)
  textAlign(CENTER)
  fill(5, 200, 135)
  text('Space Circles', width / 2, textPadding + extraPadding)

  textAlign(LEFT)
  textSize(smallSize)
  text('Score', extraPadding, height - textPadding - extraPadding)
  textSize(bigSize)
  text(score, extraPadding, height - extraPadding)

  textAlign(RIGHT)
  textSize(smallSize)
  text('Lives', width - extraPadding, height - textPadding - extraPadding)
  textSize(bigSize)
  text(lives, width - extraPadding, height - extraPadding)
}

const gameOver = () => {
  clearInterval(createCirclesInterval)
  clearInterval(updateCirclesInterval)

  const titleBreakpoint = 490
  const bigSize = width < titleBreakpoint ? 42 : 64
  const extraPadding = width < titleBreakpoint ? 20 : 35

  fill(5, 200, 235)
  textSize(bigSize)
  textAlign(CENTER)
  text('Game Over!', width / 2, height / 2 - extraPadding)
  text(`Score ${score}`, width / 2, height / 2 + extraPadding)
}

window.setup = setup
window.draw = draw
window.mouseClicked = mouseClicked
