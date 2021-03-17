import { UICtx } from '../UICtx'
import { drawTileWithBorder } from '.'

export function drawHoverTile(uiCtx: UICtx) {
  const color = uiCtx.callbacks.isDirtyClick() ? '#49A28EEE' : '#20639BDD'
  const hoverTile = uiCtx.getMousePositionTile()
  drawTileWithBorder(uiCtx, hoverTile.x, hoverTile.y, color)
}
