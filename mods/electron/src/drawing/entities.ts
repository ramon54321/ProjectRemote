import { NetworkState } from '@core'
import { UICtx } from '../UICtx'
import { drawText, drawTileWithBorder } from '.'

export function drawEntities(uiCtx: UICtx, state: NetworkState) {
  const entities = state.getEntityState()

  const selectedEntity = uiCtx.getSelectedEntity()
  if (selectedEntity) {
    const position = selectedEntity.components['Transform']?.position
    drawTileWithBorder(uiCtx, position.x, position.y, `#AE87D0`)
  }

  entities.forEach((entity, entityId) => {
    const position = entity.components['Transform']?.position
    if (!position) console.log('Entity without Transform component')
    drawText(uiCtx, position.x, position.y, `rgb(64, 64, 182)`, 'E')
  })
}
