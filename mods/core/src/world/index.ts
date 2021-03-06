import { LogicModule } from '../LogicModule'
import { startHeat, tickHeat, HeatAttributes } from './heat'
import { Grid } from '../utils/Grid'
import { ClientAction } from '@shared'

export class WorldLogic extends LogicModule {
  protected moduleId: string = 'World'
  onStart() {
    startHeat(this.state)
  }
  onTick(tickNumber: number, delta: number) {
    tickHeat(delta, this.state)
  }
  onRequestAction(clientAction: ClientAction) {
    
  }
}

export class WorldState {
  readonly heatGrid: Grid<HeatAttributes>
  constructor(width: number, height: number) {
    this.heatGrid = new Grid<HeatAttributes>(width, height, () => new HeatAttributes())
  }
}
