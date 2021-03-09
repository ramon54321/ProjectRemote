import { State, Pushable } from '@sync'
import { Serializable } from '@serialization'
import { WorldState } from './world'
import { Tile } from './utils/Grid'
import { HeatAttributes } from './world/heat'
import { EconomyState } from './economy'

@Serializable()
export class NetworkState extends State {
  readonly worldState: WorldState = new WorldState(40, 40)
  readonly economyState: EconomyState = new EconomyState()
  @Pushable()
  setWorldHeatGridHeats(heat: number[]) {
    this.worldState.heatGrid.getTiles().forEach((tile, i) => tile.attributes.setHeat(heat[i]))
  }
  getWorldHeatGridTiles(): Tile<HeatAttributes>[] {
    return this.worldState.heatGrid.getTiles()
  }
}
