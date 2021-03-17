import { Vec2, NetworkEntity } from '@shared'
import { UICtx } from './UICtx'

export type CallbackTag = 'TileSelect'
export type Callback = { tag: string; func: (tilePosition: Vec2, entity?: NetworkEntity) => void }
export class Callbacks {
  private callbacksClick: Callback[] = []
  private uiCtx: UICtx
  constructor(uiCtx: UICtx) {
    this.uiCtx = uiCtx
  }
  pushClick(tag: CallbackTag, func: Callback['func']) {
    this.callbacksClick.push({ tag: tag, func: func })
    this.uiCtx.flagRedraw()
  }
  popClick(): Callback | undefined {
    return this.callbacksClick.pop()
  }
  isDirtyClick(): boolean {
    return this.callbacksClick.length > 0
  }
}
