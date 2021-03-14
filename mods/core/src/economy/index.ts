import { ClientAction } from '@shared'
import { LogicModule } from '../LogicModule'

export class EconomyLogic extends LogicModule {
  protected moduleId: string = 'Economy'
  onStart() {}
  onTick(tickNumber: number, delta: number) {}
  onRequestAction(clientAction: ClientAction) {}
}

export class EconomyState {}
