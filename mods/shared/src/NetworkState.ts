import { State, Pushable } from '@sync'
import { Serializable } from '@serialization'

@Serializable()
export class NetworkState extends State {
  private name: string = ''
  private age: number = 0
  @Pushable()
  setName(name: string) {
    this.name = name
  }
  @Pushable()
  setAge(age: number) {
    this.age = age
  }
}