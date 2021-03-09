import { ClientAction } from '@shared'

export interface DrawInfo {
  canvasWidthPx: number
  canvasHeightPx: number
  dom: {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    toolbarDiv: HTMLDivElement
    infoDiv: HTMLDivElement
    stateDiv: HTMLDivElement
  }
}

export interface Hub {
  sendRequest: (clientAction: ClientAction) => void
  triggerDraw: () => void
}
