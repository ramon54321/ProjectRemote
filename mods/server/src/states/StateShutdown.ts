import { State, ExtendedStates } from '@state-machine'
import { States } from './States'
import process from 'process'

export class StateShutdown extends State<States> {
  readonly name = 'Shutdown'
  async onEnter(): Promise<ExtendedStates<States>> {
    console.log('Shutting down')
    ;console.log('Requests', (process as any)._getActiveRequests())
    ;console.log('Handles', (process as any)._getActiveRequests())
    return 'Done'
  }
}
