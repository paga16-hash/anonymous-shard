export interface Peer {
  readonly id: string
  metric?: {
    readonly memory: {
      readonly total: number
      readonly free: number
      readonly used: number
    }
    readonly cpu: {
      readonly model: string
      readonly load: number
      readonly cores: number
      readonly threads: number
      readonly speed: number
    }
    readonly gpu: {
      readonly model: string
      readonly memoryTotal: number
    }[]
  }
}
