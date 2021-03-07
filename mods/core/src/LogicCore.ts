import { LogicCoreBase } from './LogicCoreBase'
import { Debug } from './Debug'
import { WorldLogic } from './world'
import { EconomyLogic } from './economy'

export class LogicCore extends LogicCoreBase {
  private readonly worldLogic = new WorldLogic(this.state)
  private readonly economyLogic = new EconomyLogic(this.state)
  tick(tickNumber: number, delta: number): void {
    console.log('Tick', tickNumber)
    this.worldLogic.tick(tickNumber, delta)
    this.economyLogic.tick(tickNumber, delta)
    Debug.print()
  }
}
