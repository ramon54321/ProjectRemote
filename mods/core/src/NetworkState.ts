import { NetworkEntity, replaceObject } from '@shared'
import { State, Pushable } from '@sync'
import { Serializable } from '@serialization'
import { WorldState } from './world'
import { Tile } from './utils/Grid'
import { HeatAttributes } from './world/heat'
import { EconomyState } from './economy'
import { Debug } from './Debug'

@Serializable()
export class NetworkState extends State {
  readonly worldState: WorldState = new WorldState(20, 20)
  readonly economyState: EconomyState = new EconomyState()
  readonly entityState: Map<number, NetworkEntity> = new Map()
  @Pushable()
  setWorldHeatGridHeats(heat: number[]) {
    Debug.logPushableData('heat', heat)
    this.worldState.heatGrid.getTiles().forEach((tile, i) => tile.attributes.setHeat(heat[i]))
  }
  @Pushable()
  setEntity(networkEntity: NetworkEntity) {
    Debug.logPushableData('entities', networkEntity)
    if (this.entityState.has(networkEntity.id)) {
      replaceObject(this.entityState.get(networkEntity.id)!, networkEntity)
    } else {
      this.entityState.set(networkEntity.id, networkEntity)
    }
  }
  getWorldHeatGridTiles(): Tile<HeatAttributes>[] {
    return this.worldState.heatGrid.getTiles()
  }
  getEntityState(): Map<number, NetworkEntity> {
    return this.entityState
  }
}
