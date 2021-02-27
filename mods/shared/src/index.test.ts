import { replaceObject } from '.'

describe('Replace Object', () => {
  it('should change reference if not used', () => {
    let a = {
      age: 2
    }
    const b = {
      age: 4
    }
    a = b
    expect(a.age).toBe(4)
    expect(a).toBe(b)
    expect(b).toBe(a)
  })
  it('should not change reference', () => {
    const a = {
      age: 2
    }
    const b = {
      age: 4
    }
    replaceObject(a, b)
    expect(a.age).toBe(4)
    expect(a).not.toBe(b)
    expect(b).not.toBe(a)
  })
  it('should not change nested reference', () => {
    const a = {
      engine: {
        capacity: 5000
      }
    }
    const b = {
      engine: {
        capacity: 2000
      }
    }
    replaceObject(a, b)
    expect(a.engine).not.toBe(b.engine)
    expect(a).not.toBe(b)
    expect(b).not.toBe(a)
    expect(a.engine.capacity).toBe(2000)
  })
})