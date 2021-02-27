import { Serializable, deserialize } from '.'

@Serializable()
class State {
  version: string = '0.0.1'
  world: World = new World()
  setVersion(version: string) {
    this.version = version
  }
}

@Serializable()
class World {
  name: string = ''
  setName(name: string) {
    this.name = name
  }
}

const s1 = new State()

const json = JSON.stringify(s1)
console.log(json)

const s2 = deserialize<State>(json)
console.log(s2)

s2.world.setName('Hi')

