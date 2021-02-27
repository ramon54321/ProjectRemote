import { NetServer, NetClient } from '.'
import { EventEmitter } from 'events'

export interface ServerEvents {
  tick: {
    count: number
  }
}

export interface ClientEvents {
  'request.move': {
    entityId: string
    target: [number, number]
  }
}

describe('NetServer', () => {
  let network: NetServer<ClientEvents, ServerEvents>
  beforeAll(() => {
    network = NetServer<ClientEvents, ServerEvents>(8081)
  })
  it('should be an instance of EventEmitter', () => {
    expect(network).toBeInstanceOf(EventEmitter)
  })
  it('should have functions', () => {
    expect(network.on).toBeDefined()
    expect(network.emitOnClient).toBeDefined()
    expect(network.emitOnAllClients).toBeDefined()
  })
  afterAll(() => {
    network.shutDown()
  })
})

describe('NetClient', () => {
  let network: NetClient<ServerEvents, ClientEvents>
  beforeAll(() => {
    network = NetClient<ServerEvents, ClientEvents>('localhost', 8082)
  })
  it('should be an instance of EventEmitter', () => {
    expect(network).toBeInstanceOf(EventEmitter)
  })
  it('should have functions', () => {
    expect(network.on).toBeDefined()
    expect(network.emitOnServer).toBeDefined()
  })
  afterAll(() => {
    network.close()
  })
})
