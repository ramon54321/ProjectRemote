import { NetworkState } from './NetworkState'
import { ClientActions } from './ClientActions'

type ClientAction<T extends keyof ClientActions> = {
  type: T
  payload: ClientActions[T]
}

export interface ClientEvents {
  'request.action': {
    action: ClientAction<keyof ClientActions>
  }
  'request.bob': {
    entityId: string
    target: [number, number]
  }
}

export interface ServerEvents {
  deltaState: {
    actions: any[]
  }
  setState: {
    state: any
  }
  tick: {
    count: number
  }
}

export interface LogicCore {
  open(): void
  close(): void
  tick(tickNumber: number, state: NetworkState): void
}

export type Actions<O> = {
  [P in keyof O]: (payload: O[P]) => void
}

export function replaceObject(target: object, value: object) {
  for (const key in value) {
    const newTarget = (target as any)[key]
    const newValue = (value as any)[key]
    if (typeof newTarget === 'object') {
      replaceObject(newTarget, newValue)
    } else {
      ;(target as any)[key] = newValue
    }
  }
}

export { NetworkState }
