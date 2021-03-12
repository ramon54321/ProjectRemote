import { Vec2, NetworkEntity } from '@shared'
import { UICtx } from './UICtx'

export class EntityManager {
  private readonly uiCtx: UICtx
  constructor(uiCtx: UICtx) {
    this.uiCtx = uiCtx
    this.uiCtx.events.on('networkStateUpdate', this.onNetworkStateUpdate.bind(this))
  }
  private readonly xMap: Map<number, Map<number, NetworkEntity>> = new Map()
  private readonly idToPositionMap: Map<number, Vec2> = new Map()
  private setEntityPosition(entity: NetworkEntity, x: number, y: number) {
    const previousPosition = this.idToPositionMap.get(entity.id)!
    if (previousPosition) this.xMap.get(previousPosition.x)?.delete(previousPosition.y)
    this.idToPositionMap.set(entity.id, { x: x, y: y })
    const yMap = this.xMap.get(x) || this.xMap.set(x, new Map()).get(x)!
    yMap.set(y, entity)
  }
  private onNetworkStateUpdate() {
    this.uiCtx
      .getNetworkState()
      .getEntityState()
      .forEach(entity => {
        const position = entity.components['Transform'].position
        this.setEntityPosition(entity, position.x, position.y)
      })
  }
  getEntityOnTile(tilePosition: Vec2): NetworkEntity | undefined {
    return this.xMap.get(tilePosition.x)?.get(tilePosition.y)
  }
}
