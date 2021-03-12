import { LogicCoreBase } from './LogicCoreBase'
import { Debug } from './Debug'
import { WorldLogic } from './world'
import { EconomyLogic } from './economy'
import { EntitiesLogic } from './entities'

export class LogicCore extends LogicCoreBase {
  private readonly worldLogic = new WorldLogic(this.state)
  private readonly economyLogic = new EconomyLogic(this.state)
  private readonly entitiesLogic = new EntitiesLogic(this.state)
  start() {
    console.log('Start')
    this.worldLogic.start()
    this.economyLogic.start()
    this.entitiesLogic.start()
  }
  tick(tickNumber: number, delta: number): void {
    if (tickNumber === 0) this.start()
    console.log('Tick', tickNumber)
    this.worldLogic.tick(tickNumber, delta)
    this.economyLogic.tick(tickNumber, delta)
    this.entitiesLogic.tick(tickNumber, delta)
    Debug.print()
  }
}
