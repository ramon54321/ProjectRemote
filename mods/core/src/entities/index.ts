import { NetworkEntity } from '@shared'
import { LogicModule } from '../LogicModule'
import { Vec2 } from '@shared'
import { ECS, Entity, System, TaggedComponent } from '@ecs'

interface INetify {
  getNetworkState(): any
}

export class EntitiesLogic extends LogicModule {
  protected moduleId: string = 'Entities'
  private ecs!: ECS<ComponentTags, Components>
  onStart() {
    this.ecs = new ECS<ComponentTags, Components>(components).addSystem(Debug).addSystem(Movement)
    this.ecs.createEntity().addComponent(new Identity()).addComponent(new Transform())
    this.ecs.start()
  }
  onTick(tickNumber: number, delta: number) {
    this.ecs.tick()
    this.ecs.getEntities().forEach(entity => this.state.setEntity(this.mapEntityToNetworkEntity(entity)))
  }
  private mapEntityToNetworkEntity(entity: Entity<ComponentTags, Components>): NetworkEntity {
    const id = entity.getComponent('Identity').getId()
    const networkStateComponents = {} as any
    const componentsWithNetworkState = Array.from(entity.getComponents())
      .map(component => {
        if ((component as any).getNetworkState) {
          return { tag: component.getTag(), networkState: (component as any).getNetworkState() }
        }
      })
      .filter(component => component !== undefined) as any[]
    componentsWithNetworkState.forEach(component => (networkStateComponents[component.tag] = component.networkState))
    return {
      id: id,
      components: networkStateComponents,
    }
  }
}
const components = ['Identity', 'Transform'] as const
type ComponentTags = {
  Identity: Identity
  Transform: Transform
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

class Debug extends System<ComponentTags, Components> {
  protected readonly dependentComponentTags = ['Identity'] as const
  onTick(entity: Entity<ComponentTags, Components>): void {
    // console.log(entity.getComponent('Identity').getId())
  }
}

function clamp(x: number, a: number, b: number): number {
  return Math.min(Math.max(x, a), b)
}

class Movement extends System<ComponentTags, Components> {
  protected readonly dependentComponentTags = ['Transform'] as const
  onTick(entity: Entity<ComponentTags, Components>): void {
    const movement = {
      x: Math.floor(-4 + Math.random() * 8),
      y: Math.floor(-4 + Math.random() * 8),
    }
    const currentPosition = entity.getComponent('Transform').getPosition()
    const newPosition = { x: currentPosition.x + movement.x, y: currentPosition.y + movement.y }
    const newPositionConstrained = { 
      x: clamp(newPosition.x, 0, 20),
      y: clamp(newPosition.y, 0, 20),
    }
    entity.getComponent('Transform').setPosition(newPositionConstrained)
  }
}
