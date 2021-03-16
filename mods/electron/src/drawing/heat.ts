import { NetworkState } from '@core'
import { UICtx } from '../UICtx'
import { drawText, drawTile } from '.'

export function drawHeat(uiCtx: UICtx, state: NetworkState) {
  const heatGridTiles = state.getWorldHeatGridTiles()
  const heatMaxDraw = 305
  const heatMinDraw = 294
  const heatDiff = heatMaxDraw - heatMinDraw
  heatGridTiles.forEach(tile => {
    const tileHeat = tile.attributes.getHeat()
    const coef = (1 / heatDiff) * (tileHeat - heatMinDraw)
    const color = 255 - coef * 255
    drawTile(uiCtx, tile.x, tile.y, `rgba(255, ${color}, ${color}, ${0.75 + coef / 2})`)
  })
  heatGridTiles.forEach(tile => {
    const tileHeat = tile.attributes.getHeat()
    drawText(uiCtx, tile.x, tile.y, `rgb(128, 128, 128)`, (tileHeat - 273.15).toFixed(1))
  })
}
