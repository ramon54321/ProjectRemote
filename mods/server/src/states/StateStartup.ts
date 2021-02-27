import { State, ExtendedStates } from '@state-machine'
import { States } from './States'

export class StateStartup extends State<States> {
  readonly name = 'Startup'
  async onEnter(): Promise<ExtendedStates<States>> {
    return 'Lobby'
  }
}
