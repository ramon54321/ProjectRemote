import { NetworkState } from '@core'
import { DrawInfo } from '../types'
import { drawTile } from '.'

export function drawHeat(drawInfo: DrawInfo, state: NetworkState) {
  const heatGridTiles = state.getWorldHeatGridTiles()

  const tileWidthPx = drawInfo.canvasWidthPx / state.worldState.heatGrid.width
  const tileHeightPx = drawInfo.canvasHeightPx / state.worldState.heatGrid.height

  const heatTileCount = heatGridTiles.length
  const totalHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, b) => a + b)
  const maxHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, c) => (c > a ? c : a), Number.MIN_VALUE)
  const minHeat = heatGridTiles.map(tile => tile.attributes.getHeat()).reduce((a, c) => (c < a ? c : a), Number.MAX_VALUE)

  drawInfo.dom.infoDiv.innerHTML = JSON.stringify({ heatTileCount, totalHeat, maxHeat, minHeat }, null, 2)
  drawInfo.dom.stateDiv.innerHTML = JSON.stringify(state, null, 2)

  const heatMaxDraw = 305
  const heatMinDraw = 294
  const heatDiff = heatMaxDraw - heatMinDraw
  heatGridTiles.forEach(tile => {
    const coef = (1 / heatDiff) * (tile.attributes.getHeat() - heatMinDraw)
    const color = 255 - coef * 255
    drawTile(drawInfo, tile.x, tile.y, tileWidthPx, tileHeightPx, `rgb(255, ${color}, ${color})`)
  })
}
