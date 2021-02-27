import { State, ExtendedStates } from '@state-machine'
import { States } from './States'

export class StateLobby extends State<States> {
  readonly name = 'Lobby'
  async onEnter(): Promise<ExtendedStates<States>> {
    console.log('Entering the lobby')
    return 'Play'
  }
  onExit() {
    console.log('Exiting the lobby')
  }
}
