import { shuffleArray } from '@shared'
import { NetworkState } from '../NetworkState'

const HEAT_TRANSFER_RATE = 2 // 0.1 -> 10
const HEAT_AMBIENT = 295

function addHeat(delta: number, state: NetworkState) {
  state.getWorldHeatGridTiles()[210].attributes.addHeat(2 * delta)
}

function spreadHeat(delta: number, state: NetworkState) {
  for (let i = 0; i < 1; i++) {
    const shuffledWorldTiles = shuffleArray([...state.getWorldHeatGridTiles()])
    shuffledWorldTiles.forEach(tile => {
      const borderTiles = shuffleArray([...tile.getTilesAdjacent()])
      borderTiles.forEach(borderTile => {
        const heatComparedToBorderTile = tile.attributes.getHeat() - borderTile.attributes.getHeat()
        if (heatComparedToBorderTile <= 0) {
          return
        }
        const transferHeat = (heatComparedToBorderTile / Math.max(1, 10 / HEAT_TRANSFER_RATE)) * delta
        borderTile.attributes.addHeat(transferHeat)
        tile.attributes.removeHeat(transferHeat)
      })
    })
    state.worldState.heatGrid.getEdgeTiles().forEach(tile => tile.attributes.setHeat(HEAT_AMBIENT))
  }
}

function submitHeat(state: NetworkState) {
  const tileHeats = state.getWorldHeatGridTiles().map(tile => tile.attributes.getHeat())
  state.setWorldHeatGridHeats(tileHeats)
}

export function startHeat(state: NetworkState) {
  state.getWorldHeatGridTiles().forEach(tile => tile.attributes.setHeat(HEAT_AMBIENT))
}

export function tickHeat(delta: number, state: NetworkState) {
  addHeat(delta, state)
  spreadHeat(delta, state)
  submitHeat(state)
}

export class HeatAttributes {
  private heat: number = 0
  getHeat(): number {
    return this.heat
  }
  setHeat(heat: number) {
    this.heat = heat
    if (this.heat < 0) {
      this.heat = 0
    }
  }
  addHeat(heat: number) {
    this.setHeat(this.heat + heat)
  }
  removeHeat(heat: number) {
    this.setHeat(this.heat - heat)
  }
}
