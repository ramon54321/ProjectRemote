import * as WebSocket from 'websocket'
import * as http from 'http'
import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

type NetMessageBase<E, P> = {
  tag: E
  payload: P
}

type NetClientMessage<E, P> = {} & NetMessageBase<E, P>

type NetServerMessage<E, P> = {} & NetMessageBase<E, P>

type EventCallbackSignature<EP> = {
  [P in keyof EP]: (payload: EP[P]) => void
}

export interface NetServerNotifications extends Record<string, Function> {
  connect: (connection: WebSocket.connection) => void
}

export interface NetServer<REP, EEP> extends StrictEventEmitter<EventEmitter, EventCallbackSignature<REP>> {
  notifications: StrictEventEmitter<EventEmitter, NetServerNotifications>
  emitOnClient<E extends keyof EEP>(connection: WebSocket.connection, netServerMessage: NetServerMessage<E, EEP[E]>): void
  emitOnAllClients<E extends keyof EEP>(netServerMessage: NetServerMessage<E, EEP[E]>): void
  shutDown(): void
}

export function NetServer<REP, EEP>(port: number): NetServer<REP, EEP> {
  return new (class extends (EventEmitter as { new (): StrictEventEmitter<EventEmitter, EventCallbackSignature<REP>> }) {
    private readonly httpServer: http.Server
    private readonly server: WebSocket.server
    readonly notifications: StrictEventEmitter<EventEmitter, NetServerNotifications> = new EventEmitter()
    constructor(port: number) {
      super()
      this.httpServer = http.createServer()
      this.httpServer.listen(port)
      this.server = new WebSocket.server({
        httpServer: this.httpServer,
        autoAcceptConnections: true,
      })
      this.server.on('connect', connection => {
        connection.on('message', messageJSON => {
          const message = JSON.parse(messageJSON.utf8Data!) as NetClientMessage<any, any>
          const eventName = `${message.tag}`
          this.emit(eventName as any, message.payload, connection)
        })
        this.notifications.emit('connect', connection)
      })
    }
    emitOnClient<E extends keyof EEP>(connection: WebSocket.connection, netServerMessage: NetServerMessage<E, EEP[E]>) {
      connection.sendUTF(JSON.stringify(netServerMessage))
    }
    emitOnAllClients<E extends keyof EEP>(netServerMessage: NetServerMessage<E, EEP[E]>) {
      this.server.broadcastUTF(JSON.stringify(netServerMessage))
    }
    shutDown() {
      this.server.shutDown()
      this.httpServer.close()
    }
  })(port)
}

type Connection = WebSocket.connection

import { NetClient } from './NetClient'

export { Connection, NetClient }
