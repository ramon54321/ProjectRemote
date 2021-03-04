import { Events, EventEmitter } from '@events'
import { ClientEvents, LogicCore as ILogicCore, Actions } from '@shared'
import { NetworkState } from './NetworkState'

export abstract class LogicCoreBase implements ILogicCore {
  protected state: NetworkState
  protected events: Events<Partial<Actions<ClientEvents>>>
  constructor(networkState: NetworkState, emitter: EventEmitter) {
    this.state = networkState
    this.events = new Events(emitter, {
      'request.action': action => console.log('Action', action.action.payload.building),
    })
  }
  open() {
    this.events.open()
  }
  close() {
    this.events.close()
  }
  abstract tick(tickNumber: number): void
}

import { LogicCore } from './LogicCore'

export { LogicCore, NetworkState }
