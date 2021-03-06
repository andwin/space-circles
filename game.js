import './style.css'
import * as colors from './colors'

let circles
let score
let lives
let nextExtraLifeAt
let highscore
let newHighscore
const highScoreCookieName = 'highscore'
const extraLiveStep = 10
const mobileBreakpoint = 490
const bigTextSize = window.innerWidth < mobileBreakpoint ? 42 : 64
const smallTextSize = window.innerWidth < mobileBreakpoint ? 22 : 34
let timeAtLastUpdate
let timeSinceStart
let timeToAddNextCircle

const setup = () => {
  resetGameVariables()

  createCanvas(window.innerWidth, window.innerHeight)
  textFont('Rubik Moonrocks')
}

const resetGameVariables = () => {
  score = 0
  lives = 10
  nextExtraLifeAt = 10
  timeSinceStart = 0
  timeAtLastUpdate = (new Date()).getTime()
  timeToAddNextCircle = 1000
  highscore = getCookie(highScoreCookieName) || 0
  newHighscore = false
  circles = []
}

const draw = () => {
  background(colors.background)

  if (lives === 0) {
    drawText()
    gameOver()
    return
  }

  drawCircles()
  drawText()
}

const drawCircles = () => {
  strokeWeight(2)
  stroke(0)
  for (const c of circles) {
    fill(c.color)
    circle(c.x, c.y, c.size)
  }
}

const click = (e) => {
  e.preventDefault()

  if (lives < 1) {
    resetGameVariables()
    return
  }

  checkCirclesForClick()
}

const checkCirclesForClick = () => {
  let hit = false

  for (const c of circles) {
    if (dist(mouseX, mouseY, c.x, c.y) * 2 < c.size) {
      c.clicked = true
      hit = true
    }
  }

  if (!hit) lives--
}

const update = () => {
  if (document.visibilityState !== 'visible') return
  if (lives < 1) return

  // Update time
  const now = (new Date()).getTime()
  timeSinceStart += now - timeAtLastUpdate
  timeAtLastUpdate = (new Date()).getTime()

  createCircle()

  // Remove clicked circles
  const countBeforeRemovingClicked = circles.length
  circles = circles.filter(c => !c.clicked)
  const clickedCircles = countBeforeRemovingClicked - circles.length
  score += clickedCircles

  // Update highscore
  if (score > highscore) {
    highscore = score
    newHighscore = true
  }

  // Add extralife if next level is reached
  if (score >= nextExtraLifeAt) {
    lives++
    nextExtraLifeAt += extraLiveStep
  }

  // Reduce size of all circles
  for (const c of circles) {
    c.size--
  }

  // Remove circles that are smaller than then min size
  const minSize = 5
  const circleCountBefore = circles.length
  circles = circles.filter(c => c.size > minSize)
  const removedCircles = circleCountBefore - circles.length
  lives -= removedCircles
}
setInterval(update, 20)

const createCircle = () => {
  if (timeSinceStart < timeToAddNextCircle) return
  timeToAddNextCircle += timeToNextCircle()

  const size = circleSize()
  const margin = size / 2 + 10
  const x = random(margin, width - margin)
  const y = random(margin, height - margin)
  const color = random(colors.circleColors)

  circles.push({
    x,
    y,
    size,
    color,
  })
}

const circleSize = () => Math.floor(250 - 50 * Math.log10(score + 1))
const timeToNextCircle = () => Math.floor(2000 - 700 * Math.log10(score * 0.5 + 1))

const drawText = () => {
  const textPadding = width < mobileBreakpoint ? 40 : 60
  const extraPadding = 10

  fill(colors.text)

  textAlign(CENTER)
  textSize(bigTextSize)
  text('Space Circles', width / 2, textPadding + extraPadding)

  textAlign(LEFT)
  textSize(smallTextSize)
  text('Score', extraPadding, height - textPadding - extraPadding)
  textSize(bigTextSize)
  text(score, extraPadding, height - extraPadding)

  textAlign(RIGHT)
  textSize(smallTextSize)
  text('Lives', width - extraPadding, height - textPadding - extraPadding)
  textSize(bigTextSize)
  text(lives, width - extraPadding, height - extraPadding)

  if (newHighscore) {
    fill(colors.highscore)
  }
  textAlign(CENTER)
  textSize(smallTextSize)
  text('Highscore', width / 2, height - textPadding - extraPadding)
  textSize(bigTextSize)
  text(highscore, width / 2, height - extraPadding)
}

const gameOver = () => {
  const extraPadding = width < mobileBreakpoint ? 20 : 35

  if (newHighscore) {
    setCookie(highScoreCookieName, highscore)
  }

  fill(colors.gameOverText)
  textSize(bigTextSize)
  textAlign(CENTER)
  text('Game Over!', width / 2, height / 2 - extraPadding)

  let scoreText = `Score ${score}`
  if (newHighscore) {
    scoreText = `New highscore! ${score}`
    fill(colors.highscoreColor)
  }
  text(scoreText, width / 2, height / 2 + extraPadding)

  fill(colors.gameOverText)
  textSize(smallTextSize)
  text('Click to restart', width / 2, height / 2 + extraPadding * 3)
}

const getCookie = (name) => {
  const cookieArr = document.cookie.split(';')

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=')

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1])
    }
  }

  return null
}
const setCookie = (name, value) => { document.cookie = `${name}=${value}` }

window.setup = setup
window.draw = draw
window.touchStarted = click
