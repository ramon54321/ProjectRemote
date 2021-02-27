type StateConstructorMap<T extends string> = Record<T, new (stateMachine: StateMachine<T>) => State<T>>

export type ExtendedStates<T extends string> = T | 'Done'

export class StateMachine<T extends string> {
  private isDone = false
  private state!: State<T>
  private readonly stateMap: Record<T, State<T>>
  constructor(stateConstructorMap: StateConstructorMap<T>) {
    const stateMap = {} as any
    for (const key in stateConstructorMap) {
      const stateConstructor = stateConstructorMap[key]
      const state = new stateConstructor(this)
      stateMap[key] = state
    }
    this.stateMap = stateMap
  }
  async open(stateName: T) {
    let nextStateName: ExtendedStates<T> = stateName
    while (true) {
      if (this.state) {
        await this.state.onExit()
      }
      if (nextStateName === 'Done') {
        this.isDone = true
        break
      }
      const state = this.stateMap[nextStateName]
      this.state = state
      nextStateName = await this.state.onEnter()
    }
  }
  getStateName(): ExtendedStates<T> {
    return this.isDone ? 'Done' : this.state.name
  }
}

export abstract class State<T extends string> {
  protected readonly stateMachine: StateMachine<T>
  abstract readonly name: T
  constructor(stateMachine: StateMachine<T>) {
    this.stateMachine = stateMachine
  }
  abstract onEnter(): Promise<ExtendedStates<T>>
  onExit(): void | Promise<any> {}
}
