import { ECS, Entity, System, TaggedComponent } from '.'

class Identity extends TaggedComponent<ComponentTags, Components>('Identity') {}
class Position extends TaggedComponent<ComponentTags, Components>('Position') {
  getPosition(): {x: number, y: number} {
    return {x: 1, y: 2}
  }
}
class PositionAdv extends Position {
  getPosition(): {x: number, y: number} {
    return {x: 4, y: 5}
  }
}

class Movement extends System<ComponentTags, Components> {
  protected readonly dependentComponentTags = ['Position'] as const
  onTick(entity: Entity<ComponentTags, Components>): void {
    console.log(entity.getComponent('Position').getPosition())
  }
}

const components = ['Position', 'Identity'] as const
type ComponentTags = {
  Position: Position
  Identity: Identity
}

type Components = typeof components[number]

const ecs = new ECS<ComponentTags, Components>(components)
              .addSystem(Movement)

const andy = ecs.createEntity()
              .addComponent(new Position())
              .addComponent(new Identity())

const bob = ecs.createEntity()
              .addComponent(new PositionAdv())

ecs.tick()
