import {Metric} from "../../domain/core/metric/Metric.js";
import {Task} from "../../domain/core/task/Task.js";

export interface NodeService {
    getKnownPeers(): string[];

    getKnownMetrics(): Promise<Map<string, Metric>>;

    getCurrentMetrics(): Promise<Metric>;

    getPendingTask(): Promise<Task[]>;
}