import { UICtx } from './UICtx'
import { Callbacks } from './Callbacks'
import { Vec2 } from '@shared'

type ToolbarTag = 'Main' | 'Build' | 'Entity'
type CheckboxTag = 'WorldSurface' | 'Heat' | 'Entities'

export class Toolbar {
  private readonly uiCtx: UICtx
  private currentToolbarTag!: ToolbarTag
  private readonly toolbarMap: Record<ToolbarTag, { text: string; onClick: () => void }[]> = {
    Main: [
      {
        text: 'Build',
        onClick: () => this.setToolbar('Build'),
      },
    ],
    Entity: [
      {
        text: 'Move',
        onClick: () =>
          this.uiCtx.callbacks.pushClick('TileSelect', (tilePosition: Vec2) =>
            this.uiCtx.sendRequest({
              type: 'move',
              payload: {
                entityId: this.uiCtx.getSelectedEntity()?.id!,
                target: tilePosition,
              },
            }),
          ),
      },
    ],
    Build: [
      {
        text: 'Barracks',
        onClick: () =>
          this.uiCtx.sendRequest({
            type: 'build',
            payload: {
              building: 'Barracks',
            },
          }),
      },
      {
        text: 'House',
        onClick: () =>
          this.uiCtx.sendRequest({
            type: 'build',
            payload: {
              building: 'House',
            },
          }),
      },
      {
        text: 'Back',
        onClick: () => this.setToolbar('Main'),
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
    this.uiCtx.dom.toolbarDiv.appendChild(this.buttonsDiv)
    this.uiCtx.dom.toolbarDiv.appendChild(this.settingsDiv)
    this.initInfoDiv()
    this.initPromptDiv()
    this.checkboxMap = {
      WorldSurface: this.createCheckbox('WorldSurface', true),
      Heat: this.createCheckbox('Heat'),
      Entities: this.createCheckbox('Entities', true),
    }
  }
  isChecked(checkbox: CheckboxTag): boolean {
    return this.checkboxMap[checkbox].checked
  }
  private initPromptDiv() {
    this.setToolbar('Main')
    this.uiCtx.events.on('promptEntity', () => (this.currentToolbarTag !== 'Entity' ? this.setToolbar('Entity') : this.setToolbar('Main')))
  }
  private initInfoDiv() {
    const infoDiv = document.createElement('div')
    this.uiCtx.dom.toolbarDiv.appendChild(infoDiv)
    const mousePositionPxDiv = document.createElement('div')
    const mousePositionTileDiv = document.createElement('div')
    const selectedDiv = document.createElement('div')
    infoDiv.appendChild(mousePositionPxDiv)
    infoDiv.appendChild(mousePositionTileDiv)
    infoDiv.appendChild(selectedDiv)
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
    const checkbox = document.createElement('input') as HTMLInputElement
    checkbox.type = 'checkbox'
    if (checked) checkbox.checked = true
    checkbox.onclick = () => this.uiCtx.flagRedraw()
    const textElement = document.createElement('span')
    textElement.innerText = text
    this.settingsDiv.appendChild(checkbox)
    this.settingsDiv.appendChild(textElement)
    return checkbox
  }
  private setToolbar(tag: ToolbarTag) {
    this.currentToolbarTag = tag
    this.setToolbarActions(this.toolbarMap[tag])
  }
  private setToolbarActions(actions: { text: string; onClick: () => void }[]) {
    clearElement(this.buttonsDiv)
    const buttons = actions.map(action => createButton(action.text, action.onClick))
    buttons.forEach(button => this.buttonsDiv.appendChild(button))
  }
}

function createButton(text: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button')
  button.textContent = text
  button.onclick = onClick
  return button
}

function clearElement(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
