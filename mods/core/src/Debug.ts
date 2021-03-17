export class Debug {
  private static readonly pushableDataMap: Map<string, any[]> = new Map()
  private static readonly logicModuleTickTimeMap = {} as any
  static logModuleTickTime(moduleId: string, tickTime: number) {
    this.logicModuleTickTimeMap[moduleId] = tickTime
  }
  static logPushableData(tag: string, data: any) {
    if (!this.pushableDataMap.has(tag)) {
      return this.pushableDataMap.set(tag, [data])
    }
    return this.pushableDataMap.get(tag)!.push(data)
  }
  static print() {
    console.log(this.logicModuleTickTimeMap)
    const pushableSizes = [] as any[]
    this.pushableDataMap.forEach((value, key) => {
      pushableSizes.push({
        key,
        size: value.map(obj => JSON.stringify(obj).length).reduce((a, b) => a + b),
        callCount: value.length,
      })
    })
    console.log(pushableSizes)
    this.pushableDataMap.clear()
  }
}