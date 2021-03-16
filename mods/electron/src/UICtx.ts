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
  debugToggle: boolean
}

type ActionState = 'Select' | 'Entity'

export class UICtx {
  private isInitDone = false
  private isDebugMode = false
  canvasWidthPx!: number
  canvasHeightPx!: number
  readonly tilePx: number
  private readonly cameraPositionPx: Vec2
  private readonly keyDown: Record<string, boolean>
  private readonly keyOnce: Record<string, boolean>
  readonly dom: {
    readonly canvas: HTMLCanvasElement
    readonly context: CanvasRenderingContext2D
    readonly toolbar: HTMLDivElement
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
  readonly sendRequest: (clientAction: ClientAction) => void
  readonly callbacks: Callbacks
  readonly toolbar: Toolbar
  readonly entityManager: EntityManager

  getIsDebugMode(): boolean {
    return this.isDebugMode
  }
  setIsDebugMode(value: boolean) {
    this.isDebugMode = value
    this.events.emit('debugToggle', this.isDebugMode)
  }
  toggleIsDebugMode() {
    this.setIsDebugMode(!this.isDebugMode)
  }

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

  private setCanvasDimensions(canvas: HTMLCanvasElement) {
    this.canvasWidthPx = window.innerWidth
    this.canvasHeightPx = window.innerHeight
    canvas.width = this.canvasWidthPx * 2
    canvas.height = this.canvasHeightPx * 2
    canvas.style.width = `${this.canvasWidthPx}px`
    canvas.style.height = `${this.canvasHeightPx}px`
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.scale(2, 2)
  }

  constructor(start: () => void, update: (delta: number) => void, draw: (networkState: NetworkState) => void) {
    const body = document.body
    const canvas = document.createElement('canvas')
    canvas.id = 'canvas'
    this.setCanvasDimensions(canvas)
    window.addEventListener('resize', () => this.setCanvasDimensions(canvas))
    
    body.appendChild(canvas)

    const leftTopContainer = document.createElement('div')
    leftTopContainer.id = 'leftTopContainer'
    leftTopContainer.style.position = 'fixed'
    leftTopContainer.style.left = '0'
    leftTopContainer.style.top = '0'
    body.appendChild(leftTopContainer)
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    const toolbar = document.createElement('div')
    toolbar.id = 'toolbar'
    leftTopContainer.appendChild(toolbar)
    
    this.dom = {
      canvas,
      context,
      toolbar,
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

    this.tilePx = 40

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
      this.mousePositionTile.y = Math.floor((this.canvasHeightPx - (this.mousePositionPx.y + this.cameraPositionPx.y)) / this.tilePx)
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

    let hasRunOnce = false
    const updateDelta = 1 / 60
    setInterval(() => {
      if (!this.isInitDone) return
      if (!hasRunOnce) {
        start()
        hasRunOnce = true
        return
      }

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
