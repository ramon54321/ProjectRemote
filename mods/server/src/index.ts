import 'module-alias/register'
import * as _ from 'lodash'
import { StateMachine } from '@state-machine'
import { StateStartup, StateLobby, StatePlay, StateShutdown } from './states'

const stateMachine = new StateMachine({
  Startup: StateStartup,
  Lobby: StateLobby,
  Play: StatePlay,
  Shutdown: StateShutdown,
})
stateMachine.open('Startup')
