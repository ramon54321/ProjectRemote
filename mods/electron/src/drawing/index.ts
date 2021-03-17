import { UICtx } from '../UICtx'

export function drawTile(uiCtx: UICtx, x: number, y: number, color: string) {
  const xp = x * uiCtx.tilePx - uiCtx.getCameraPosition().x + uiCtx.canvasWidthPx / 2
  const yp = uiCtx.canvasHeightPx / 2 - (y + 1) * uiCtx.tilePx - uiCtx.getCameraPosition().y
  uiCtx.dom.context.fillStyle = color
  uiCtx.dom.context.fillRect(xp, yp, uiCtx.tilePx, uiCtx.tilePx)
}

export function drawTileWithBorder(uiCtx: UICtx, x: number, y: number, color: string) {
  const xp = x * uiCtx.tilePx - uiCtx.getCameraPosition().x + uiCtx.canvasWidthPx / 2
  const yp = uiCtx.canvasHeightPx / 2 - (y + 1) * uiCtx.tilePx - uiCtx.getCameraPosition().y
  uiCtx.dom.context.fillStyle = color
  uiCtx.dom.context.fillRect(xp + 1, yp + 1, uiCtx.tilePx - 2, uiCtx.tilePx - 2)
}

export function drawText(uiCtx: UICtx, x: number, y: number, color: string, text: string) {
  const verticalOffsetPx = 4
  const xp = (x * uiCtx.tilePx + uiCtx.tilePx / 2 - uiCtx.getCameraPosition().x) + uiCtx.canvasWidthPx / 2
  const yp = uiCtx.canvasHeightPx / 2 - (y + 1) * uiCtx.tilePx + uiCtx.tilePx / 2 + verticalOffsetPx - uiCtx.getCameraPosition().y
  uiCtx.dom.context.font = '12px Arial'
  uiCtx.dom.context.textAlign = 'center'
  uiCtx.dom.context.fillStyle = color
  uiCtx.dom.context.fillText(text, xp, yp)
}
