import * as WebSocket from 'websocket'
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

export interface NetClient<REP, EEP> extends StrictEventEmitter<EventEmitter, EventCallbackSignature<REP>> {
  emitOnServer<E extends keyof EEP>(netClientMessage: NetClientMessage<E, EEP[E]>): void
  close(): void
}

export function NetClient<REP, EEP>(host: string, port: number): NetClient<REP, EEP> {
  return new (class extends (EventEmitter as { new (): StrictEventEmitter<EventEmitter, EventCallbackSignature<REP>> }) {
    private readonly socket: WebSocket.client
    private connection?: WebSocket.connection
    constructor(host: string, port: number) {
      super()
      this.socket = new WebSocket.client()
      this.socket.connect(`ws://${host}:${port}/`)
      this.socket.on('connect', connection => {
        this.connection = connection
        connection.on('message', messageJSON => {
          const message = JSON.parse(messageJSON.utf8Data!) as NetServerMessage<any, any>
          const eventName = `${message.tag}`
          this.emit(eventName as any, message.payload)
        })
      })
    }
    emitOnServer<E extends keyof EEP>(netClientMessage: NetClientMessage<E, EEP[E]>) {
      this.connection?.sendUTF(JSON.stringify(netClientMessage))
    }
    close() {
      this.connection?.close()
    }
  })(host, port)
}
