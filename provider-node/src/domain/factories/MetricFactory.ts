import {Metric} from "../core/Metric";
import si from "systeminformation";

export class MetricFactory {
    static async currentMetric(): Promise<Metric> {
        const memory = await si.mem();
        const cpu = await si.currentLoad();
        return {
            memory: {
                total: memory.total,
                free: memory.free,
                used: memory.used,
            },
            cpu: {
                load: cpu.currentLoad,
                cores: cpu.cpus.length,
            }
        };
    }

    static metricFrom(totalMemory: number, freeMemory: number, usedMemory: number, cpuCurrentLoad: number, cpuCores: number): Metric {
        return {
            memory: {
                total: totalMemory,
                free: freeMemory,
                used: usedMemory,
            },
            cpu: {
                load: cpuCurrentLoad,
                cores: cpuCores,
            }
        };
    }
}
