import { LogicCoreBase } from '.'
import { tickEconomy } from './economy'

export class LogicCore extends LogicCoreBase {
  tick(tickNumber: number): void {
    console.log('Tick', tickNumber)
    tickEconomy(this.state)
  }
}
