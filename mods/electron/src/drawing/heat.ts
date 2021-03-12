import { NetworkState } from '@core'
import { UICtx } from '../UICtx'
import { drawText, drawTile } from '.'

export function drawHeat(uiCtx: UICtx, state: NetworkState) {
  const heatGridTiles = state.getWorldHeatGridTiles()

  const heatTileCount = heatGridTiles.length
  const totalHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, b) => a + b)
  const maxHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, c) => (c > a ? c : a), Number.MIN_VALUE)
  const minHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, c) => (c < a ? c : a), Number.MAX_VALUE)

  uiCtx.dom.infoDiv.innerHTML = JSON.stringify({ heatTileCount, totalHeat, maxHeat, minHeat }, null, 2)
  uiCtx.dom.stateDiv.innerHTML = JSON.stringify(state, null, 2)

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
