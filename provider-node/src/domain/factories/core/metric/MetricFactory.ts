import si from "systeminformation";
import { Metric } from "../../../core/metric/Metric.js";

export class MetricFactory {
    static async currentMetric(): Promise<Metric> {
        const memory = await si.mem();
        const cpu = await si.currentLoad();
        const cpuInfo = await si.cpu();
        const graphics = await si.graphics();

        const gpuMetrics = graphics.controllers.map((gpu) => ({
            model: gpu.model,
            memoryTotal: gpu.vram || 0
        }));

        return {
            memory: {
                total: memory.total,
                free: memory.free,
                used: memory.used,
            },
            cpu: {
                model: cpuInfo.manufacturer + "-" + cpuInfo.brand,
                load: cpu.currentLoad,
                cores: cpuInfo.cores,
                threads: cpuInfo.processors,
                speed: cpuInfo.speed,
            },
            gpu: gpuMetrics,
        };
    }

    static metricFrom(
        totalMemory: number,
        freeMemory: number,
        usedMemory: number,
        cpuModel: string,
        cpuCurrentLoad: number,
        cpuCores: number,
        cpuThreads: number,
        cpuSpeed: number,
        gpuMetrics: {
            model: string;
            load: number;
            memoryTotal: number;
            memoryUsed: number;
            temperature: number;
        }[]
    ): Metric {
        return {
            memory: {
                total: totalMemory,
                free: freeMemory,
                used: usedMemory,
            },
            cpu: {
                model: cpuModel,
                load: cpuCurrentLoad,
                cores: cpuCores,
                threads: cpuThreads,
                speed: cpuSpeed,
            },
            gpu: gpuMetrics,
        };
    }
}
