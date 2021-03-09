import './register'
import { open } from '@client'
import { NetworkState } from '@core'
import { DrawInfo, Hub } from './types'
import { drawHeat } from './drawing/heat'
import Toolbar from './Toolbar'
import { EventEmitter } from 'events'

const drawInfo: DrawInfo = setupDrawInfo(800, 800)
const hub: Hub = setupHub()
const toolbar = new Toolbar(drawInfo.dom.toolbarDiv, hub)

function draw(state: NetworkState) {
  drawInfo.dom.context.clearRect(0, 0, drawInfo.canvasWidthPx, drawInfo.canvasHeightPx)
  if (toolbar.isChecked('Heat')) drawHeat(drawInfo, state)
}

function setupHub(): Hub {
  const hubEvents = new EventEmitter()
  let lastState: NetworkState
  const drawWrapper = (state: NetworkState) => {
    lastState = state
    hubEvents.emit('render')
    draw(state)
  }
  return {
    ...open(drawWrapper),
    triggerDraw: () => drawWrapper(lastState),
  }
}

function setupDrawInfo(canvasWidthPx: number, canvasHeightPx: number): DrawInfo {
  const body = document.body

  const containerDiv = document.createElement('div')
  containerDiv.style.padding = '20px'
  containerDiv.style.display = 'flex'
  containerDiv.style.justifyContent = 'center'
  body.appendChild(containerDiv)

  const toolbarDiv = document.createElement('div')
  toolbarDiv.classList.add('toolbar')
  containerDiv.appendChild(toolbarDiv)

  const canvas = document.createElement('canvas')
  containerDiv.appendChild(canvas)
  canvas.width = canvasWidthPx
  canvas.height = canvasHeightPx
  canvas.style.width = `${canvasWidthPx}px`
  canvas.style.height = `${canvasHeightPx}px`
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  const infoDiv = document.createElement('div')
  body.appendChild(infoDiv)

  const stateDiv = document.createElement('div')
  body.appendChild(stateDiv)

  return {
    canvasWidthPx: canvasWidthPx,
    canvasHeightPx: canvasHeightPx,
    dom: {
      canvas,
      context,
      toolbarDiv,
      infoDiv,
      stateDiv,
    },
  }
}
