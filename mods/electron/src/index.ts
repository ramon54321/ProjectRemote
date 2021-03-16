import './register'
import { NetworkState } from '@core'
import { UICtx } from './UICtx'
import { drawWorldSurface } from './drawing/world'
import { drawHeat } from './drawing/heat'
import { drawEntities } from './drawing/entities'
import { drawHoverTile } from './drawing/hover'
import * as Utils from './utils'

const uiCtx = new UICtx(start, update, draw)

function start() {
  uiCtx.setIsDebugMode(false)
}

function update(delta: number) {
  handleDebugMode(uiCtx)
  handleSetActionStateToEntity(uiCtx)
  handleToolbarHotkeys(uiCtx)
  handleClick(uiCtx)
  handleSpacebar(uiCtx)
  handleCamera(delta, uiCtx)
}

function draw(state: NetworkState) {
  if (!uiCtx.getIsDebugMode() || uiCtx.toolbar.isChecked('WorldSurface')) drawWorldSurface(uiCtx, state)
  drawHoverTile(uiCtx)
  if (uiCtx.getIsDebugMode() && uiCtx.toolbar.isChecked('Heat')) drawHeat(uiCtx, state)
  if (!uiCtx.getIsDebugMode() || uiCtx.toolbar.isChecked('Entities')) drawEntities(uiCtx, state)
}

function handleDebugMode(uiCtx: UICtx) {
  if (uiCtx.getKeyOnce('`')) {
    uiCtx.toggleIsDebugMode()
    uiCtx.flagRedraw()
  }
}

function handleSetActionStateToEntity(uiCtx: UICtx) {
  if (uiCtx.isActionState('Select') && uiCtx.getSelectedEntity()) {
    uiCtx.setActionState('Entity')
  }
}

function handleToolbarHotkeys(uiCtx: UICtx) {
  const activeActions = uiCtx.toolbar.getActiveActions()
  activeActions.forEach((action) => {
    if ((!action.condition || action.condition()) && uiCtx.getKeyDown(action.hotkey)) {
      action.action()
    }
  })
}

function handleClick(uiCtx: UICtx) {
  if (uiCtx.getKeyDown('click')) {
    if (uiCtx.callbacks.isDirtyClick()) {
      const hover = Utils.getHover(uiCtx)
      uiCtx.callbacks.popClick()!.func(uiCtx.getMousePositionTile(), hover.entity)
    } else if (uiCtx.isActionState('Select') || uiCtx.isActionState('Entity')) {
      const hover = Utils.getHover(uiCtx)
      if (hover.entity) {
        uiCtx.setSelectedEntity(hover.entity)
        uiCtx.clearSelectedTile()
      } else {
        uiCtx.setSelectedTile(hover.tile)
        uiCtx.clearSelectedEntity()
      }
      uiCtx.flagRedraw()
    }
  }
}

function handleSpacebar(uiCtx: UICtx) {
  if (uiCtx.getKeyOnce(' ') && uiCtx.isActionState('Entity')) {
    uiCtx.events.emit('promptEntity')
  }
}

function handleCamera(delta: number, uiCtx: UICtx) {
  if (uiCtx.getKeyDown('a')) {
    uiCtx.moveCameraX(-500, delta)
  }
  if (uiCtx.getKeyDown('d')) {
    uiCtx.moveCameraX(500, delta)
  }
  if (uiCtx.getKeyDown('w')) {
    uiCtx.moveCameraY(-500, delta)
  }
  if (uiCtx.getKeyDown('s')) {
    uiCtx.moveCameraY(500, delta)
  }
}
