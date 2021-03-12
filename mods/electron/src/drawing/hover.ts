import { UICtx } from '../UICtx'
import { drawTileWithBorder } from '.'

export function drawHoverTile(uiCtx: UICtx) {
  const hoverTile = uiCtx.getMousePositionTile()
  drawTileWithBorder(uiCtx, hoverTile.x, hoverTile.y, `#20639B`)
}
