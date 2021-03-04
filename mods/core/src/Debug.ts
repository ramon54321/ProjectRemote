export class Debug {
  private static readonly logicModuleTickTimeMap = {} as any
  static logModuleTickTime(moduleId: string, tickTime: number) {
    this.logicModuleTickTimeMap[moduleId] = tickTime
  }
  static print() {
    console.log(this.logicModuleTickTimeMap)
  }
}