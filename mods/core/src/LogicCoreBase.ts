import { Events, EventEmitter } from '@events'
import { ClientEvents, LogicCore, NetworkState, Actions } from '@shared'

export abstract class LogicCoreBase implements LogicCore {
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