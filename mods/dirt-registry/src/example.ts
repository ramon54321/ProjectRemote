import { DirtRegistry } from '.'

interface Entity {
  id: string
  name: string
}

const extState = {
  entities: [
    {
      id: 'A',
      name: 'Andy',
    },
    {
      id: 'B',
      name: 'Brody',
    },
    {
      id: 'C',
      name: 'Charley',
    },
  ],
}

const drawState = {} as any

function createEntity(entity: Entity) {
  console.log('Creating entity', entity.id)
  drawState[entity.id] = {
    ...entity,
  }
}

function destroyEntity(id: string | number) {
  console.log('Destroying entity', id)
  delete drawState[id]
}

function updateEntity(entity: Entity) {
  console.log('Updating entity', entity.id)
  drawState[entity.id].name = entity.name
}

const entitiesRegistry = new DirtRegistry()

function draw(state: typeof extState) {
  entitiesRegistry.update(state.entities, createEntity, destroyEntity, updateEntity)
}

draw(extState)
console.log('drawState', drawState)
console.log()
;(extState.entities.find(e => e.id === 'B') as any).name = 'Devon'
draw(extState)
console.log('drawState', drawState)
console.log()

extState.entities.splice(1, 1)
draw(extState)
console.log('drawState', drawState)
console.log()
