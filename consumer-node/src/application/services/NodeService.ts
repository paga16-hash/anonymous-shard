import {Metric} from "../../domain/core/metric/Metric.js";
import {Task} from "../../domain/core/task/Task.js";

export interface NodeService {
    getCurrentMetrics(): Promise<Metric>;

    getPendingTask(): Promise<Task[]>;
}