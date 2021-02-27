import { NetServer, NetClient } from '.'

const netServer = NetServer<ClientEvents, ServerEvents>(8081)
netServer.notifications.on('connect', connection => console.log(connection.remoteAddress))
netServer.on('request.move', payload => console.log(payload))
netServer.emitOnAllClients({
  tag: 'tick',
  payload: {
    count: 3,
  },
})

const netClient = NetClient<ServerEvents, ClientEvents>('localhost', 8081)
setTimeout(
  () =>
  netClient.emitOnServer({
      tag: 'request.move',
      payload: {
        entityId: 'abcd',
        target: [4, 5],
      },
    }),
  1000,
)

interface ServerEvents {
  'tick': {
    count: number
  }
}

interface ClientEvents {
  'request.move': {
    entityId: string
    target: [number, number]
  }
}