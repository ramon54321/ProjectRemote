import { Vec2 } from "."

export interface ClientActions {
  Build: {
    building: 'Barracks' | 'House'
  }
  Move: {
    entityId: number
    target: Vec2
  }
}
