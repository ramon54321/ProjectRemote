import { Vec2 } from '@shared'

export class Grid<T> {
  readonly width: number
  readonly height: number
  readonly tileCount: number
  private readonly tiles: Tile<T>[] = []
  constructor(width: number, height: number, attributesConstructor: (x: number, y: number) => T) {
    this.width = width
    this.height = height
    this.tileCount = width * height
    this.generateTiles(attributesConstructor)
  }
  generateTiles(attributesConstructor: (x: number, y: number) => T) {
    this.tiles.length = 0
    for (let i = 0; i < this.tileCount; i++) {
      const position = this.indexToPosition(i)
      this.tiles.push(new Tile<T>(this, position.x, position.y, attributesConstructor))
    }
  }
  getTile(x: number, y: number): Tile<T> | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
    return this.tiles[this.width * y + x]
  }
  getTiles(): Tile<T>[] {
    return this.tiles
  }
  getEdgeTiles(): Tile<T>[] {
    const tiles = [] as any[]
    for (let y = 0; y < this.height; y++) {
      if (y !== 0 && y !== this.height - 1) {
        tiles.push(this.getTile(0, y))
        tiles.push(this.getTile(this.width - 1, y))
        continue
      }
      for (let x = 0; x < this.width; x++) {
        tiles.push(this.getTile(x, y))
      }
    }
    return tiles.filter(tile => tile !== undefined) as Tile<T>[]
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

export class Tile<T> {
  readonly attributes: T
  readonly #grid: Grid<T>
  readonly x: number
  readonly y: number
  constructor(grid: Grid<T>, x: number, y: number, attributesConstructor: (x: number, y: number) => T) {
    this.#grid = grid
    this.x = x
    this.y = y
    this.attributes = attributesConstructor(x, y)
  }
  getTileNorth(): Tile<T> | undefined {
    return this.#grid.getTile(this.x, this.y + 1)
  }
  getTileEast(): Tile<T> | undefined {
    return this.#grid.getTile(this.x + 1, this.y)
  }
  getTileSouth(): Tile<T> | undefined {
    return this.#grid.getTile(this.x, this.y - 1)
  }
  getTileWest(): Tile<T> | undefined {
    return this.#grid.getTile(this.x - 1, this.y)
  }
  getTileNorthEast(): Tile<T> | undefined {
    return this.#grid.getTile(this.x + 1, this.y + 1)
  }
  getTileSouthEast(): Tile<T> | undefined {
    return this.#grid.getTile(this.x + 1, this.y - 1)
  }
  getTileNorthWest(): Tile<T> | undefined {
    return this.#grid.getTile(this.x - 1, this.y + 1)
  }
  getTileSouthWest(): Tile<T> | undefined {
    return this.#grid.getTile(this.x - 1, this.y - 1)
  }
  getTilesAdjacent(): Tile<T>[] {
    return [
      this.getTileNorth(),
      this.getTileEast(),
      this.getTileSouth(),
      this.getTileWest(),
      this.getTileNorthEast(),
      this.getTileSouthEast(),
      this.getTileNorthWest(),
      this.getTileSouthWest(),
    ].filter(tile => tile !== undefined) as Tile<T>[]
  }
}
