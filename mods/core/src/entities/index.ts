import { ClientAction, NetworkEntity, Vec2 } from '@shared'
import { LogicModule } from '../LogicModule'
import { Component, ECS, Entity, System, TaggedComponent } from '@ecs'

type NetifyComponent<CT, T extends keyof CT> = Component<CT, T> & INetify

interface INetify {
  getNetworkState(): any
}

function isINetify<CT, T extends keyof CT>(component: Component<CT, T>): component is NetifyComponent<CT, T> {
  return (component as NetifyComponent<CT, T>).getNetworkState !== undefined
}

export class EntitiesLogic extends LogicModule {
  protected moduleId: string = 'Entities'
  private ecs!: ECS<ComponentTags, Components>
  private entitiesState!: EntitiesState
  onStart() {
    this.ecs = new ECS<ComponentTags, Components>(components).addSystem(Debug).addSystem(Movement)
    this.entitiesState = new EntitiesState(this.ecs)
    this.entitiesState.spawnEntity().addComponent(new Transform()).addComponent(new Move())
    this.ecs.start()
  }
  onTick(tickNumber: number, delta: number) {
    this.ecs.tick()
    this.ecs.getEntities().forEach(entity => this.state.setEntity(this.mapEntityToNetworkEntity(entity)))
  }
  onRequestAction(clientAction: ClientAction) {
    if (clientAction.type === 'Move') {
      const entity = this.entitiesState.getEntityById(clientAction.payload.entityId)
      entity?.getComponent('Move').moveTo(clientAction.payload.target)
    }
  }
  private mapEntityToNetworkEntity(entity: Entity<ComponentTags, Components>): NetworkEntity {
    const id = entity.getComponent('Identity').getId()
    return {
      id: id,
      components: Array.from(entity.getComponents())
        .filter(isINetify)
        .reduce((networkStateComponents, component) => {
          // TODO: Create function for this
          networkStateComponents[component.getTag()] = component.getNetworkState()
          return networkStateComponents
        }, {} as any),
    }
  }
}

export class EntitiesState {
  private readonly ecs: ECS<ComponentTags, Components>
  private readonly entitiesById: Map<number, Entity<ComponentTags, Components>> = new Map()
  constructor(ecs: ECS<ComponentTags, Components>) {
    this.ecs = ecs
  }
  getEntityById(id: number): Entity<ComponentTags, Components> | undefined {
    return this.entitiesById.get(id)
  }
  spawnEntity(): Entity<ComponentTags, Components> {
    const entity = this.ecs.createEntity().addComponent(new Identity())
    const id = entity.getComponent('Identity').getId()
    this.entitiesById.set(id, entity)
    return entity
  }
}

const components = ['Identity', 'Transform', 'Move'] as const
type ComponentTags = {
  Identity: Identity
  Transform: Transform
  Move: Move
}

type Components = typeof components[number]

function generateId(): number {
  return Math.floor(Math.random() * 1000000)
}

class Identity extends TaggedComponent<ComponentTags, Components>('Identity') {
  readonly id: number
  constructor() {
    super()
    this.id = generateId()
  }
  getId(): number {
    return this.id
  }
}
class Transform extends TaggedComponent<ComponentTags, Components>('Transform') implements INetify {
  private readonly position: Vec2 = { x: 0, y: 0 }
  private readonly rotation: number = 0
  getPosition(): Vec2 {
    return { x: this.position.x, y: this.position.y }
  }
  setPosition(position: Vec2) {
    this.position.x = position.x
    this.position.y = position.y
  }
  getRotation(): number {
    return this.rotation
  }
  getNetworkState() {
    return {
      position: this.getPosition(),
      rotation: this.getRotation(),
    }
  }
}
class Move extends TaggedComponent<ComponentTags, Components>('Move') implements INetify {
  move(movement: Vec2) {
    const currentPosition = this.entity.getComponent('Transform').getPosition()
    const newPosition = { x: currentPosition.x + movement.x, y: currentPosition.y + movement.y }
    this.entity.getComponent('Transform').setPosition(newPosition)
  }
  moveTo(target: Vec2) {
    this.entity.getComponent('Transform').setPosition(target)
  }
  getNetworkState() {
    return {}
  }
}

class Debug extends System<ComponentTags, Components> {
  protected readonly dependentComponentTags = ['Identity'] as const
  onTick(entity: Entity<ComponentTags, Components>): void {}
}

function clamp(x: number, a: number, b: number): number {
  return Math.min(Math.max(x, a), b)
}

class Movement extends System<ComponentTags, Components> {
  protected readonly dependentComponentTags = ['Transform'] as const
  onTick(entity: Entity<ComponentTags, Components>): void {}
}
