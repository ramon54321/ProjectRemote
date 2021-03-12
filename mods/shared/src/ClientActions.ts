import { Vec2 } from "."

export interface ClientActions {
  build: {
    building: 'Barracks' | 'House'
  }
  move: {
    entityId: number
    target: Vec2
  }
}
