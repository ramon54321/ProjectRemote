import { Vec2 } from '@shared'
import { LogicModule } from '../LogicModule'

export class WorldLogic extends LogicModule {
  protected moduleId: string = 'World'
  onTick(tickNumber: number) {
    this.state.setWorldTileCondition(7, 1, 'temperature', 19)
  }
}

export class WorldState {
  readonly width: number
  readonly height: number
  readonly tileCount: number
  private readonly tiles: Tile[] = []
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.tileCount = width * height
    this.generateTiles()
  }
  generateTiles() {
    this.tiles.length = 0
    for (let i = 0; i < this.tileCount; i++) {
      const position = this.indexToPosition(i)
      this.tiles.push(new Tile(this, position.x, position.y))
    }
  }
  getTile(x: number, y: number): Tile | undefined {
    return this.tiles[this.width * y + x]
  }
  indexToPosition(i: number): Vec2 {
    const x = i % this.width
    const y = Math.floor(i / this.width)
    return {
      x,
      y,
    }
  }
}

export class TileCondition {
  temperature: number = 24
}

class Tile {
  readonly condition: TileCondition = new TileCondition()
  readonly #worldState: WorldState
  private readonly x: number
  private readonly y: number
  constructor(worldState: WorldState, x: number, y: number) {
    this.#worldState = worldState
    this.x = x
    this.y = y
  }
  getTileNorth(): Tile | undefined {
    return this.#worldState.getTile(this.x, this.y + 1)
  }
  getTileEast(): Tile | undefined {
    return this.#worldState.getTile(this.x + 1, this.y)
  }
  getTileSouth(): Tile | undefined {
    return this.#worldState.getTile(this.x, this.y - 1)
  }
  getTileWest(): Tile | undefined {
    return this.#worldState.getTile(this.x - 1, this.y)
  }
  getTileNorthEast(): Tile | undefined {
    return this.#worldState.getTile(this.x + 1, this.y + 1)
  }
  getTileSouthEast(): Tile | undefined {
    return this.#worldState.getTile(this.x + 1, this.y - 1)
  }
  getTileNorthWest(): Tile | undefined {
    return this.#worldState.getTile(this.x - 1, this.y + 1)
  }
  getTileSouthWest(): Tile | undefined {
    return this.#worldState.getTile(this.x - 1, this.y - 1)
  }
  getTilesAdjacent(): Tile[] {
    return [
      this.getTileNorth(),
      this.getTileEast(),
      this.getTileSouth(),
      this.getTileWest(),
      this.getTileNorthEast(),
      this.getTileSouthEast(),
      this.getTileNorthWest(),
      this.getTileSouthWest(),
    ].filter(tile => tile !== undefined) as Tile[]
  }
}
