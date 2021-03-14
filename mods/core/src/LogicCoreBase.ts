import { Events, EventEmitter } from '@events'
import { ClientEvents, LogicCore as ILogicCore, Actions, ClientAction } from '@shared'
import { NetworkState } from './NetworkState'

export abstract class LogicCoreBase implements ILogicCore {
  protected state: NetworkState
  protected events: Events<Partial<Actions<ClientEvents>>>
  constructor(networkState: NetworkState, emitter: EventEmitter) {
    this.state = networkState
    this.events = new Events(emitter, {
      'request.action': body => this.onRequestAction(body.action),
    })
  }
  protected onRequestAction(clientAction: ClientAction) {
    console.log('Action', clientAction)
  }
  open() {
    this.events.open()
  }
  close() {
    this.events.close()
  }
  abstract tick(tickNumber: number, delta: number): void
}
