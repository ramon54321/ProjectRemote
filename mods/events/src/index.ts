import { EventEmitter, once } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

type ListenerType<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [void] ? [] : [T]

export class Events<EM> {
  private readonly emitter: StrictEventEmitter<EventEmitter, EM>
  private readonly eventMap: Partial<EM>
  constructor(emitter?: StrictEventEmitter<EventEmitter, EM>, eventMap?: Partial<EM>) {
    this.emitter = emitter ? emitter : (new EventEmitter() as StrictEventEmitter<EventEmitter, EM>)
    this.eventMap = eventMap ? eventMap : {}
  }
  emit<E extends keyof EM>(event: E, ...args: ListenerType<EM[E]>) {
    this.emitter.emit(event, ...args)
  }
  async for<E extends keyof EM>(event: E): Promise<any> {
    return await once(this.emitter, event as any)
  }
  open() {
    for (const event in this.eventMap) {
      const func = this.eventMap[event]
      this.emitter.on(event as any, func as any)
    }
  }
  close() {
    for (const event in this.eventMap) {
      const func = (this.eventMap as any)[event]
      this.emitter.off(event, func)
    }
  }
}

export { EventEmitter, StrictEventEmitter }
