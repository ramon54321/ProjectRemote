import { LogicCoreBase } from './LogicCoreBase'

export class LogicCoreMain extends LogicCoreBase {
  tick(tickNumber: number): void {
    console.log('Ticking from logic core 2')
  }
}
