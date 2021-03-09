import { NetworkState } from './NetworkState'
import { Debug } from './Debug'

export abstract class LogicModule {
  protected abstract readonly moduleId: string
  protected readonly state: NetworkState
  constructor(state: NetworkState) {
    this.state = state
  }
  start() {
    this.onStart()
  }
  abstract onStart(): void
  tick(tickNumber: number, delta: number): void {
    const startTime = Date.now()
    this.onTick(tickNumber, delta)
    const endTime = Date.now()
    const tickTime = endTime - startTime
    Debug.logModuleTickTime(this.moduleId, tickTime)
  }
  abstract onTick(tickNumber: number, delta: number): void
}
