import 'module-alias/register'
import * as _ from 'lodash'
import { ServerEvents, ClientEvents, replaceObject } from '@shared'
import { NetworkState } from '@core'
import { NetClient } from '@networking'

function draw(state: NetworkState) {}

const state = new NetworkState('READER')
const network = NetClient<ServerEvents, ClientEvents>('localhost', 8081)
network.on('deltaState', payload => {
  payload.actions.forEach(action => state.applyAction(action))
  draw(state)
  console.log('After Delta - State Client', state)
})
network.on('setState', payload => {
  replaceObject(state, payload.state)
  draw(state)
  console.log('After Set - State Client', state)
})
setTimeout(() => {
  network.emitOnServer({
    tag: 'request.action',
    payload: {
      action: {
        type: 'build',
        payload: {
          building: 'House',
        },
      },
    },
  })
}, 3000)
