import { LogicCoreBase } from './LogicCoreBase'



export class LogicCore extends LogicCoreBase {
  tick(tickNumber: number): void {
    console.log('Tick', tickNumber)
    
  }
}
