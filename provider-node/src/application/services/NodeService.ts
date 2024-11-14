import {Metric} from "../../domain/core/Metric.js";

export interface NodeService {
    subscribeToMetrics(): void;

    publishMetrics(): void;

    getCurrentMetrics(): Promise<Metric>;

    getPendingTask(): Promise<number>;
}