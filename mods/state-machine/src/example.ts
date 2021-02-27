import { State, StateMachine, ExtendedStates } from '.'

type States = 'Lobby' | 'Play'

class StateLobby extends State<States> {
  readonly name = 'Lobby'
  async onEnter(): Promise<ExtendedStates<States>> {
    console.log('Entering the lobby')
    return 'Play'
  }
  onExit() {
    console.log('Exiting the lobby')
  }
}

class StatePlay extends State<States> {
  readonly name = 'Play'
  async onEnter(): Promise<ExtendedStates<States>> {
    console.log('Entering the play')
    return 'Done'
  }
  onExit() {
    console.log('Exiting the play')
  }
}

const stateMachine = new StateMachine({
  Lobby: StateLobby,
  Play: StatePlay,
})
stateMachine.open('Lobby')

console.log(stateMachine.getStateName())
