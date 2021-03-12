import { Vec2, NetworkEntity } from '@shared'

export type CallbackTag = 'TileSelect'
export type Callback = { tag: string; func: (tilePosition: Vec2, entity?: NetworkEntity) => void }
export class Callbacks {
  private callbacksClick: Callback[] = []
  pushClick(tag: CallbackTag, func: Callback['func']) {
    this.callbacksClick.push({ tag: tag, func: func })
  }
  popClick(): Callback | undefined {
    return this.callbacksClick.pop()
  }
  isDirtyClick(): boolean {
    return this.callbacksClick.length > 0
  }
}
