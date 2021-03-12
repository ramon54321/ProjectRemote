import { UICtx } from './UICtx'

export function getHover(uiCtx: UICtx) {
  return {
    tile: { ...uiCtx.getMousePositionTile() },
    entity: uiCtx.entityManager.getEntityOnTile(uiCtx.getMousePositionTile()),
  }
}