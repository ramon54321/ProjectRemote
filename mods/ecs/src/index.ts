export class ECS<CT, T extends keyof CT> {
  private readonly entites: Set<Entity<CT, T>> = new Set()
  private readonly entityComponentMap: Record<T, Set<Entity<CT, T>>>
  private readonly systems: System<CT, T>[] = []
  constructor(componentTags: readonly T[]) {
    this.entityComponentMap = {} as any
    componentTags.forEach(componentTag => {
      this.entityComponentMap[componentTag] = new Set<Entity<CT, T>>()
    })
  }
  start() {
    this.entites.forEach(entity => entity.getComponents().forEach(component => component.start()))
  }
  tick() {
    this.systems.forEach(system => system.tick())
  }
  createEntity(): Entity<CT, T> {
    const entity = new Entity<CT, T>(this)
    this.entites.add(entity)
    return entity
  }
  addSystem<S extends System<CT, T>>(systemClass: new (ecs: ECS<CT, T>) => S): ECS<CT, T> {
    this.systems.push(new systemClass(this))
    return this
  }
  getEntitiesWithComponents(componentTags: readonly T[]): Set<Entity<CT, T>> {
    const entitySets = componentTags.map(tag => this.entityComponentMap[tag])
    const intersectionEntities = entitySets.reduce(intersection)
    return intersectionEntities
  }
  getEntities(): Set<Entity<CT, T>> {
    return this.entites
  }
  __addEntityToComponentSet(entity: Entity<CT, T>, componentTag: T) {
    this.entityComponentMap[componentTag].add(entity)
  }
}

export class Entity<CT, T extends keyof CT> {
  private readonly ecs: ECS<CT, T>
  private readonly components: Set<Component<CT, T>> = new Set()
  private readonly componentMap = new Map<T, Component<CT, T>>()
  constructor(ecs: ECS<CT, T>) {
    this.ecs = ecs
  }
  addComponent(component: Component<CT, T>): Entity<CT, T> {
    this.components.add(component)
    this.ecs.__addEntityToComponentSet(this, component.getTag())
    this.componentMap.set(component.getTag(), component)
    return this
  }
  getComponent<K extends T>(componentTag: K): CT[K] {
    return (this.componentMap.get(componentTag) as unknown) as CT[K]
  }
  getComponents(): Set<Component<CT, T>> {
    return this.components
  }
}

export abstract class Component<CT, T extends keyof CT> {
  start() {
    
  }
  getTag(): T {
    return this.constructor.prototype.tag
  }
}

export abstract class System<CT, T extends keyof CT> {
  private readonly ecs: ECS<CT, T>
  protected abstract readonly dependentComponentTags: readonly T[]
  protected abstract onTick(entity: Entity<CT, T>): void
  constructor(ecs: ECS<CT, T>) {
    this.ecs = ecs
  }
  tick() {
    this.ecs.getEntitiesWithComponents(this.dependentComponentTags).forEach(entity => this.onTick(entity))
  }
}

const usedComponentTags: any[] = []
export function TaggedComponent<CT, T extends keyof CT>(tag: T): { new (): Component<CT, T> } {
  if (usedComponentTags.includes(tag)) {
    throw new Error(`ECS: Tag '${tag}' used in multiple calls to 'TaggedComponent' function`)
  }
  usedComponentTags.push(tag)
  const cls = class extends Component<CT, T> {}
  ;(cls.prototype as any).tag = tag
  return cls
}

function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  const intersection = new Set<T>()
  b.forEach(elem => {
    if (a.has(elem)) {
      intersection.add(elem)
    }
  })
  return intersection
}
