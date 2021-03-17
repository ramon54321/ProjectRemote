import { UICtx } from './UICtx'
import { Vec2 } from '@shared'

type ToolbarTag = 'Entity'
type CheckboxTag = 'WorldSurface' | 'Heat' | 'Entities'
type ToolbarAction = { text: string, hotkey: string, action: () => void, condition?: () => boolean}

export class Toolbar {
  private readonly uiCtx: UICtx
  private currentToolbarTag?: ToolbarTag
  private readonly toolbarMap: Record<ToolbarTag, ToolbarAction[]> = {
    Entity: [
      {
        text: 'Move',
        hotkey: 'm',
        action: () =>
          this.uiCtx.callbacks.pushClick('TileSelect', (tilePosition: Vec2) =>
            this.uiCtx.sendRequest({
              type: 'Move',
              payload: {
                entityId: this.uiCtx.getSelectedEntity()?.id!,
                target: tilePosition,
              },
            }),
          ),
        condition: () => {
          return this.uiCtx.getSelectedEntity()?.components['Move']
        }
      },
    ],
  }
  private readonly buttonsDiv: HTMLDivElement
  private readonly settingsDiv: HTMLDivElement
  private readonly checkboxMap: Record<CheckboxTag, HTMLInputElement>
  constructor(uiCtx: UICtx) {
    this.uiCtx = uiCtx
    this.buttonsDiv = document.createElement('div')
    this.settingsDiv = document.createElement('div')
    this.registerAsDebugElement(this.settingsDiv)
    this.uiCtx.dom.toolbar.appendChild(this.buttonsDiv)
    this.uiCtx.dom.toolbar.appendChild(this.settingsDiv)
    this.initInfoDiv()
    this.checkboxMap = {
      WorldSurface: this.createCheckbox('WorldSurface', true),
      Heat: this.createCheckbox('Heat'),
      Entities: this.createCheckbox('Entities', true),
    }
    this.uiCtx.events.on('selectEntity', () => this.setToolbar('Entity'))
    this.uiCtx.events.on('selectTile', () => this.setToolbar())
  }
  isChecked(checkbox: CheckboxTag): boolean {
    return this.checkboxMap[checkbox].checked
  }
  getActiveActions(): ToolbarAction[] | undefined {
    return this.currentToolbarTag && this.toolbarMap[this.currentToolbarTag]
  }
  private initInfoDiv() {
    const infoDiv = document.createElement('div')
    this.registerAsDebugElement(infoDiv)
    this.uiCtx.dom.toolbar.appendChild(infoDiv)
    const secDrawDiv = document.createElement('div')
    const mousePositionPxDiv = document.createElement('div')
    const mousePositionTileDiv = document.createElement('div')
    const selectedDiv = document.createElement('div')
    infoDiv.appendChild(secDrawDiv)
    infoDiv.appendChild(mousePositionPxDiv)
    infoDiv.appendChild(mousePositionTileDiv)
    infoDiv.appendChild(selectedDiv)
    this.uiCtx.events.on('slowTick', () => {
      secDrawDiv.innerHTML = this.uiCtx.getDrawsPerSecond().toFixed(0)
    })
    this.uiCtx.events.on('mousePositionPxUpdate', (mousePositionPx: any) => {
      mousePositionPxDiv.innerHTML = JSON.stringify(mousePositionPx)
    })
    this.uiCtx.events.on('mousePositionTileUpdate', (mousePositionTile: any) => {
      mousePositionTileDiv.innerHTML = JSON.stringify(mousePositionTile)
    })
    const updateSelectedDivTile = () => (selectedDiv.innerHTML = 'Tile: ' + JSON.stringify(this.uiCtx.getSelectedTile()))
    const updateSelectedDivEntity = () => (selectedDiv.innerHTML = 'Entity: ' + JSON.stringify(this.uiCtx.getSelectedEntity()))
    this.uiCtx.events.on('selectTile', updateSelectedDivTile)
    this.uiCtx.events.on('selectEntity', updateSelectedDivEntity)
    this.uiCtx.events.on('networkStateUpdate', () => {
      if (this.uiCtx.getSelectedTile()) {
        updateSelectedDivTile()
      } else {
        updateSelectedDivEntity()
      }
    })
  }
  private createCheckbox(text: string, checked?: boolean): HTMLInputElement {
    const checkboxContainer = document.createElement('div')
    const checkbox = document.createElement('input') as HTMLInputElement
    checkbox.type = 'checkbox'
    if (checked) checkbox.checked = true
    checkbox.onclick = () => this.uiCtx.flagRedraw()
    const textElement = document.createElement('span')
    textElement.innerText = text
    checkboxContainer.appendChild(checkbox)
    checkboxContainer.appendChild(textElement)
    this.settingsDiv.appendChild(checkboxContainer)
    return checkbox
  }
  private registerAsDebugElement(element: HTMLElement) {
    this.uiCtx.events.on('debugToggle', isDebugMode => {
      if (isDebugMode) {
        element.style.display = 'block'
      } else {
        element.style.display = 'none'
      }
    })
  }
  private setToolbar(tag?: ToolbarTag) {
    this.currentToolbarTag = tag
    if (this.currentToolbarTag) {
      this.setToolbarActions(this.toolbarMap[this.currentToolbarTag])
    } else {
      this.clearToolbarActions()
    }
  }
  private clearToolbarActions() {
    clearElement(this.buttonsDiv)
  }
  private setToolbarActions(actions: ToolbarAction[]) {
    this.clearToolbarActions()
    const hints = actions.filter(action => !action.condition || action.condition()).map(action => createActionHint(`${action.hotkey.toUpperCase()} - ${action.text}`))
    hints.forEach(hint => this.buttonsDiv.appendChild(hint))
  }
}

function createActionHint(text: string): HTMLElement {
  const hint = document.createElement('div')
  hint.classList.add('action-hint')
  hint.textContent = text
  return hint
}

function clearElement(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
