import './register'
import { open } from '@client'
import { NetworkState } from '@core'

const canvasWidthPx = 800
const canvasHeightPx = 800
const tileWidthPx = canvasWidthPx / 20
const tileHeightPx = canvasHeightPx / 20

const dom = setupDOM()
const hub = open(draw)

function draw(state: NetworkState) {
  dom.stateDiv.innerHTML = JSON.stringify(state, null, 2)

  dom.context.clearRect(0, 0, canvasWidthPx, canvasHeightPx)

  const tiles = state.getWorldTiles()
  const maxTemperature = 25 //tiles.map(tile => tile.condition.temperature).reduce((a, c) => c > a ? c : a, Number.MIN_VALUE)
  const minTemperature = 10 //tiles.map(tile => tile.condition.temperature).reduce((a, c) => c < a ? c : a, Number.MAX_VALUE)
  const diffTemperature = maxTemperature - minTemperature
  tiles.forEach(tile => {
    const coef = (1 / diffTemperature) * (tile.condition.temperature - minTemperature)
    const color = 255 - (coef * 255)
    drawTile(dom.context, tile.x, tile.y, `rgb(255, ${color}, ${color})`)
  })
}

function drawTile(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const xp = x * tileWidthPx
  const yp = canvasHeightPx - (y + 1) * tileHeightPx
  context.fillStyle = color
  context.fillRect(xp, yp, tileWidthPx, tileHeightPx)
}

function setupDOM() {
  const body = document.body
  const { canvas, context } = setupCanvas()
  const button = document.createElement('button')
  document.body.appendChild(button)
  button.textContent = 'Build Barracks'
  button.onclick = () =>
    hub.sendRequest({
      type: 'build',
      payload: {
        building: 'Barracks',
      },
    })
  const stateDiv = document.createElement('div')
  document.body.appendChild(stateDiv)
  return {
    body,
    canvas,
    context,
    button,
    stateDiv,
  }
}

function setupCanvas() {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = canvasWidthPx
  canvas.height = canvasHeightPx
  canvas.style.width = '800px'
  canvas.style.height = '800px'

  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  return { canvas, context }
}
