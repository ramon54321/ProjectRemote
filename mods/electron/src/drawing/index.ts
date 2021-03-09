import { DrawInfo } from '../types'

export function drawTile(drawInfo: DrawInfo, x: number, y: number, tileWidthPx: number, tileHeightPx: number, color: string) {
  const xp = x * tileWidthPx
  const yp = drawInfo.canvasHeightPx - (y + 1) * tileHeightPx
  drawInfo.dom.context.fillStyle = color
  drawInfo.dom.context.fillRect(xp, yp, tileWidthPx, tileHeightPx)
}
