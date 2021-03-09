import { Hub } from './types'

type ToolbarTag = 'Main' | 'Build'
type CheckboxTag = 'Heat'

export default class Toolbar {
  private readonly toolbarDiv: HTMLDivElement
  private readonly hub: Hub
  private readonly toolbarMap: Record<ToolbarTag, { text: string; onClick: () => void }[]> = {
    Main: [
      {
        text: 'Build',
        onClick: () => this.setToolbar('Build'),
      },
    ],
    Build: [
      {
        text: 'Barracks',
        onClick: () =>
          this.hub.sendRequest({
            type: 'build',
            payload: {
              building: 'Barracks',
            },
          }),
      },
      {
        text: 'House',
        onClick: () =>
          this.hub.sendRequest({
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
  constructor(toolbarDiv: HTMLDivElement, hub: Hub) {
    this.toolbarDiv = toolbarDiv
    this.hub = hub
    this.buttonsDiv = document.createElement('div')
    this.settingsDiv = document.createElement('div')
    this.toolbarDiv.appendChild(this.buttonsDiv)
    this.toolbarDiv.appendChild(this.settingsDiv)
    this.setToolbar('Main')
    this.checkboxMap = {
      Heat: this.createCheckbox('Heat'),
    }
  }
  isChecked(checkbox: CheckboxTag): boolean {
    return this.checkboxMap[checkbox].checked
  }
  private createCheckbox(text: string): HTMLInputElement {
    const checkbox = document.createElement('input') as HTMLInputElement
    checkbox.type = 'checkbox'
    checkbox.onclick = () => this.hub.triggerDraw()
    const textElement = document.createElement('span')
    textElement.innerText = text
    this.settingsDiv.appendChild(checkbox)
    this.settingsDiv.appendChild(textElement)
    return checkbox
  }
  private setToolbar(name: ToolbarTag) {
    this.setToolbarActions(this.toolbarMap[name])
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
