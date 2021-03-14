import { Debug } from './Debug'
import { ClientAction } from '@shared'
import { LogicCoreBase } from './LogicCoreBase'
import { LogicModule } from './LogicModule'
import { WorldLogic } from './world'
import { EconomyLogic } from './economy'
import { EntitiesLogic } from './entities'

export class LogicCore extends LogicCoreBase {
  private readonly logicModules: LogicModule[] = [new WorldLogic(this.state), new EconomyLogic(this.state), new EntitiesLogic(this.state)]
  start() {
    console.log('Start')
    this.logicModules.forEach(module => module.start())
  }
  tick(tickNumber: number, delta: number): void {
    if (tickNumber === 0) this.start()
    console.log('Tick', tickNumber)
    this.tickActionRequests()
    this.logicModules.forEach(module => module.tick(tickNumber, delta))
    Debug.print()
  }
  private readonly clientActionRequests: ClientAction[] = []
  onRequestAction(clientAction: ClientAction) {
    this.clientActionRequests.push(clientAction)
  }
  tickActionRequests() {
    let actionRequest = this.clientActionRequests.shift()
    while (actionRequest !== undefined) {
      this.logicModules.forEach(module => module.onRequestAction(actionRequest!))
      actionRequest = this.clientActionRequests.shift()
    }
  }
}
