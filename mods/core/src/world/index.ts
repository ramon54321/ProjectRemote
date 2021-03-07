import { Vec2, shuffleArray } from '@shared'
import { LogicModule } from '../LogicModule'
import { NetworkState } from '../NetworkState'

function spreadHeat(delta: number, state: NetworkState) {
  for (let i = 0; i < 2; i++) {
    const shuffledWorldTiles = shuffleArray([...state.getWorldTiles()])
    shuffledWorldTiles.forEach(tile => {
      const borderTiles = shuffleArray([...tile.getTilesAdjacent()]).slice(0, 4)
      borderTiles.forEach(borderTile => {
        const diffToBorderTile = borderTile.condition.temperature - tile.condition.temperature
        tile.condition.addTemperature(diffToBorderTile / 16)
        borderTile.condition.addTemperature(-diffToBorderTile / 16)
      })
    })
  }
  state.getWorldTiles().forEach(tile => state.setWorldTileCondition(tile.x, tile.y, 'temperature', tile.condition.temperature))
}

export class WorldLogic extends LogicModule {
  protected moduleId: string = 'World'
  onTick(tickNumber: number, delta: number) {
    this.state.setWorldTileCondition(10, 10, 'heatEmissionTemperature', 24)
    this.state.setWorldTileCondition(10, 11, 'heatEmissionTemperature', 76)
    this.state.setWorldTileCondition(11, 10, 'heatEmissionTemperature', 24)
    this.state.setWorldTileCondition(11, 11, 'heatEmissionTemperature', 24)
    this.state.setWorldTileCondition(3, 3, 'isHeatSink', true)
    this.state.setWorldTileCondition(3, 3, 'heatSinkTemperature', 6)
    spreadHeat(delta, this.state)
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
  getTiles(): Tile[] {
    return this.tiles
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
  temperature: number = 12
  heatEmissionTemperature: number = 0
  isHeatSink: boolean = false
  heatSinkTemperature: number = 0
  setTemperature(temperature: number) {
    this.temperature = temperature
    if (this.temperature < this.heatEmissionTemperature) {
      this.temperature = this.heatEmissionTemperature
    }
    if (this.isHeatSink && this.temperature > this.heatSinkTemperature) {
      this.temperature = this.heatSinkTemperature
    }
  }
  addTemperature(temperature: number) {
    this.setTemperature(this.temperature + temperature)
  }
}

export class Tile {
  readonly condition: TileCondition = new TileCondition()
  readonly #worldState: WorldState
  readonly x: number
  readonly y: number
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
