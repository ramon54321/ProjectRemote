import { NetworkState } from '@core'
import { UICtx } from '../UICtx'
import { drawTileWithBorder } from '.'

export function drawWorldSurface(uiCtx: UICtx, state: NetworkState) {
  const surfaceGridTiles = state.getWorldHeatGridTiles()

  surfaceGridTiles.forEach(tile => {
    drawTileWithBorder(uiCtx, tile.x, tile.y, '#D2E190')
  })
}
