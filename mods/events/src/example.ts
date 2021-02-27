import { Events, EventEmitter, StrictEventEmitter } from '.' 

type MyEvents = {
  tick: () => void
  join: (player: number) => void
}

class Phase {
  private readonly name = 'Lobby'
  private readonly events: Events<MyEvents>
  constructor(emitter: EventEmitter) {
    this.events = new Events<MyEvents>(emitter, {
      join: (player) => this.onJoin(player),
      tick: () => this.onTick(),
    })
  }
  open() {
    this.events.open()
    this.events.emit('join', 5)
  }
  close() {
    this.events.close()
  }
  async onTick() {
    console.log(this.name, 'Tick')
    console.log('Waiting for join')
    const join = await this.events.for('join')
    console.log('Joining happened and tick continuned', join)
  }
  onJoin(player: number) {
    console.log(this.name, 'Join', player)
  }
}

const events: StrictEventEmitter<EventEmitter, MyEvents> = new EventEmitter()

const lobby = new Phase(events)

lobby.open()

setTimeout(() => events.emit('tick'), 0)
setTimeout(() => events.emit('tick'), 500)

setTimeout(() => events.emit('join', 10), 2000)
setTimeout(() => events.emit('join', 20), 2500)

setTimeout(() => lobby.close(), 5000)