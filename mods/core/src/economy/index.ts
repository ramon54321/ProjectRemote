import { LogicModule } from '../LogicModule'

export class EconomyLogic extends LogicModule {
  protected moduleId: string = 'Economy'
  onTick(tickNumber: number, delta: number) {}
}

export class EconomyState {}
