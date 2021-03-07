import { ClientActions } from './ClientActions'

export interface Vec2 {
  x: number
  y: number
}

export type ClientAction = {
  type: keyof ClientActions
  payload: ClientActions[keyof ClientActions]
}

export interface ClientEvents {
  'request.action': {
    action: ClientAction
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
  tick(tickNumber: number, delta: number): void
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

export function shuffleArray<T>(arr: T[]) {
  let currentIndex = arr.length
  let temporaryValue
  let randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }
  return arr
}
