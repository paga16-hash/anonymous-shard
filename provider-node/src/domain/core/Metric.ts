export interface Metric {
    readonly memory: {
        readonly total: number
        readonly free: number
        readonly used: number
    }

    readonly cpu: {
        readonly load: number
        readonly cores: number
    }
}
