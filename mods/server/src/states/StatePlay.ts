import { ServerEvents, ClientEvents, LogicCore } from '@shared'
import { NetServer, Connection, NetServerNotifications } from '@networking'
import { State, ExtendedStates } from '@state-machine'
import { NetworkState, LogicCore as LogicCoreImpl } from '@core'
import { Events } from '@events'
import { States } from './States'

interface PlayEvents {
  gameover: () => void
}

export class StatePlay extends State<States> {
  readonly name = 'Play'
  private state!: NetworkState
  private network!: NetServer<ClientEvents, ServerEvents>
  private networkNotificationEvents!: Events<NetServerNotifications>
  private playEvents!: Events<PlayEvents>
  private logicCore!: LogicCore
  private tickHandle: any
  private tickDeltaSeconds: number = 1
  async onEnter(): Promise<ExtendedStates<States>> {
    console.log('Entering play')
    this.state = new NetworkState('WRITER')
    this.network = NetServer<ClientEvents, ServerEvents>(8081)
    this.networkNotificationEvents = new Events(this.network.notifications, {
      connect: connection => this.onConnect(connection),
    })
    this.networkNotificationEvents.open()
    this.playEvents = new Events<PlayEvents>()
    this.logicCore = new LogicCoreImpl(this.state, this.network)
    this.logicCore.open()
    this.tickHandle = setInterval(() => this.onTick(this.tickDeltaSeconds), this.tickDeltaSeconds * 1000)
    await this.playEvents.for('gameover')
    return 'Shutdown'
  }
  onExit() {
    console.log('Exiting play')
    clearInterval(this.tickHandle)
    this.logicCore.close()
    this.network.shutDown()
    this.networkNotificationEvents.close()
  }
  private onConnect(connection: Connection) {
    sendSetState(this.network, connection, this.state)
  }
  private tickNumber = 0
  private onTick(delta: number) {
    this.logicCore.tick(this.tickNumber, delta)
    sendDeltaState(this.network, this.state)
    this.tickNumber++
  }
}

function sendSetState(network: NetServer<ClientEvents, ServerEvents>, connection: Connection, state: NetworkState) {
  const message = {
    tag: 'setState' as const,
    payload: {
      state: state,
    },
  }
  network.emitOnClient(connection, message)
}

function sendDeltaState(network: NetServer<ClientEvents, ServerEvents>, state: NetworkState) {
  const message = {
    tag: 'deltaState' as const,
    payload: {
      actions: state.popActions(),
    },
  }
  network.emitOnAllClients(message)
}
