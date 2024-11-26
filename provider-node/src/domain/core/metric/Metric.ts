export interface Metric {
    readonly memory: {
        readonly total: number
        readonly free: number
        readonly used: number
    };

    readonly cpu: {
        readonly model: string; // model name
        readonly load: number;
        readonly cores: number;
        readonly threads: number;
        readonly speed: number; // in GHz
    };

    readonly gpu: Array<{
        readonly model: string; // model name
        readonly memoryTotal: number; // Total GPU memory in MB
    }>;
}
