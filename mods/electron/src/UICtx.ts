import { NetworkState } from '@core'
import { EventEmitter, StrictEventEmitter } from '@events'
import { ClientAction, Vec2, NetworkEntity, replaceObject } from '@shared'
import { open } from '@client'
import { Toolbar } from './Toolbar'
import { EntityManager } from './EntityManager'
import { Callbacks } from './Callbacks'

interface UIEvents {
  moveCamera: void
  networkStateUpdate: NetworkState
  selectEntity: void
  selectTile: void
  mousePositionPxUpdate: Vec2
  mousePositionTileUpdate: Vec2
  promptEntity: void
}

type ActionState = 'Select' | 'Entity'

export class UICtx {
  private isInitDone = false
  readonly canvasWidthPx: number
  readonly canvasHeightPx: number
  readonly tilePx: number
  private readonly cameraPositionPx: Vec2
  private readonly keyDown: Record<string, boolean>
  private readonly keyOnce: Record<string, boolean>
  readonly dom: {
    readonly canvas: HTMLCanvasElement
    readonly context: CanvasRenderingContext2D
    readonly toolbarDiv: HTMLDivElement
    readonly infoDiv: HTMLDivElement
    readonly stateDiv: HTMLDivElement
  }
  readonly events: StrictEventEmitter<EventEmitter, UIEvents>
  private readonly triggerDraw: () => void
  private readonly mousePositionPx: Vec2
  private readonly mousePositionTile: Vec2
  private readonly mousePositionTileLast: Vec2
  private readonly playState: {
    actionState: ActionState
    selectedTile?: Vec2
    selectedEntity?: NetworkEntity
  }
  private networkState: NetworkState
  private needsRedraw: boolean = true
  readonly sendRequest: <T extends 'build' | 'move'>(clientAction: ClientAction<T>) => void
  readonly callbacks: Callbacks
  readonly toolbar: Toolbar
  readonly entityManager: EntityManager

  isActionState(actionState: ActionState): boolean {
    return this.playState.actionState === actionState
  }
  getActionState(): ActionState {
    return this.playState.actionState
  }
  setActionState(actionState: ActionState) {
    this.playState.actionState = actionState
  }

  getSelectedTile(): Vec2 | undefined {
    if (this.playState.selectedTile) {
      return { x: this.playState.selectedTile.x, y: this.playState.selectedTile.y }
    }
  }
  setSelectedTile(tilePosition: Vec2) {
    this.playState.selectedTile = { x: tilePosition.x, y: tilePosition.y }
    this.events.emit('selectTile')
  }
  clearSelectedTile() {
    this.playState.selectedTile = undefined
  }

  getSelectedEntity(): NetworkEntity | undefined {
    return this.playState.selectedEntity
  }
  setSelectedEntity(entity: NetworkEntity) {
    this.playState.selectedEntity = entity
    this.events.emit('selectEntity')
  }
  clearSelectedEntity() {
    this.playState.selectedEntity = undefined
  }

  getMousePositionTile(): Vec2 {
    return { x: this.mousePositionTile.x, y: this.mousePositionTile.y }
  }

  getKeyDown(key: string): boolean {
    return this.keyDown[key]
  }
  getKeyOnce(key: string): boolean {
    return this.keyOnce[key]
  }

  getCameraPosition(): Vec2 {
    return { x: this.cameraPositionPx.x, y: this.cameraPositionPx.y }
  }
  moveCameraX(x: number, delta: number) {
    this.cameraPositionPx.x += x * delta
    this.events.emit('moveCamera')
    this.flagRedraw()
  }
  moveCameraY(y: number, delta: number) {
    this.cameraPositionPx.y += y * delta
    this.events.emit('moveCamera')
    this.flagRedraw()
  }

  getNetworkState(): NetworkState {
    return this.networkState
  }

  flagRedraw() {
    this.needsRedraw = true
  }

  constructor(canvasWidthPx: number, canvasHeightPx: number, update: (delta: number) => void, draw: (networkState: NetworkState) => void) {
    this.canvasWidthPx = canvasWidthPx
    this.canvasHeightPx = canvasHeightPx

    const body = document.body

    const containerDiv = document.createElement('div')
    containerDiv.style.padding = '20px'
    containerDiv.style.display = 'flex'
    containerDiv.style.justifyContent = 'center'
    body.appendChild(containerDiv)

    const toolbarDiv = document.createElement('div')
    toolbarDiv.classList.add('toolbar')
    containerDiv.appendChild(toolbarDiv)

    const canvas = document.createElement('canvas')
    containerDiv.appendChild(canvas)
    canvas.width = canvasWidthPx * 2
    canvas.height = canvasHeightPx * 2
    canvas.style.width = `${canvasWidthPx}px`
    canvas.style.height = `${canvasHeightPx}px`
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.scale(2, 2)

    const infoDiv = document.createElement('div')
    body.appendChild(infoDiv)

    const stateDiv = document.createElement('div')
    body.appendChild(stateDiv)

    this.dom = {
      canvas,
      context,
      toolbarDiv,
      infoDiv,
      stateDiv,
    }

    this.keyDown = {}
    this.keyOnce = {}

    this.cameraPositionPx = {
      x: 0,
      y: 0,
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keyDown[e.key] = true
      this.keyOnce[e.key] = true
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keyDown[e.key] = false
    })
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.keyDown['click'] = true
      this.keyOnce['click'] = true
    })
    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      this.keyDown['click'] = false
    })

    this.mousePositionPx = {
      x: 0,
      y: 0,
    }
    this.mousePositionTile = {
      x: 0,
      y: 0,
    }
    this.mousePositionTileLast = {
      x: 0,
      y: 0,
    }

    this.tilePx = canvasWidthPx / 20

    this.events = new EventEmitter()

    this.playState = {
      selectedTile: {
        x: 0,
        y: 0,
      },
      actionState: 'Select',
    }

    const updateMouseTilePosition = () => {
      this.mousePositionTile.x = Math.floor((this.mousePositionPx.x + this.cameraPositionPx.x) / this.tilePx)
      this.mousePositionTile.y = Math.floor((canvasHeightPx - (this.mousePositionPx.y + this.cameraPositionPx.y)) / this.tilePx)
      this.events.emit('mousePositionTileUpdate', this.mousePositionTile)
    }

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      this.mousePositionPx.x = event.clientX - rect.left
      this.mousePositionPx.y = event.clientY - rect.top
      this.events.emit('mousePositionPxUpdate', this.mousePositionPx)
      updateMouseTilePosition()
    }

    this.events.on('moveCamera', () => updateMouseTilePosition())

    canvas.onmousemove = onMouseMove

    this.callbacks = new Callbacks()
    this.toolbar = new Toolbar(this)
    this.entityManager = new EntityManager(this)

    const updateDelta = 1 / 60
    setInterval(() => {
      if (!this.isInitDone) return

      if (this.mousePositionTile.x !== this.mousePositionTileLast.x || this.mousePositionTile.y !== this.mousePositionTileLast.y) {
        this.flagRedraw()
      }
      update(updateDelta)
      if (this.needsRedraw) {
        this.triggerDraw()
        this.needsRedraw = false
      }
      for (var key in this.keyOnce) this.keyOnce[key] = false
      replaceObject(this.mousePositionTileLast, this.mousePositionTile)
    }, 1000 / 60)

    this.networkState = {} as NetworkState
    const drawWrapper = (state: NetworkState) => {
      this.networkState = state
      this.events.emit('networkStateUpdate', state)
      this.dom.context.clearRect(0, 0, this.canvasWidthPx, this.canvasHeightPx)
      draw(state)
      this.isInitDone = true
    }
    this.triggerDraw = () => drawWrapper(this.networkState)
    const { sendRequest } = open(drawWrapper)
    this.sendRequest = sendRequest
  }
}
