import { State, Pushable } from '@sync'
import { Serializable } from '@serialization'
import { WorldState, TileCondition } from './world'
import { EconomyState } from './economy'

@Serializable()
export class NetworkState extends State {
  private readonly worldState: WorldState = new WorldState(20, 20)
  private readonly economyState: EconomyState = new EconomyState()
  @Pushable()
  setWorldTileCondition<K extends keyof TileCondition>(x: number, y: number, key: K, value: TileCondition[K]) {
    ;(this.worldState.getTile(x, y)?.condition)![key] = value
  }
}
