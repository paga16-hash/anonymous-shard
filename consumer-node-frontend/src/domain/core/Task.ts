export interface Task {
    readonly pk: string,
    readonly id: {
        readonly value: string
        readonly type: number
        readonly publicKey: string
    },
    readonly status: string,
    readonly details: {
        readonly value: number[]
    }
}