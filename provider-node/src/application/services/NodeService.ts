import {Metric} from "../../domain/core/metric/Metric.js";

export interface NodeService {

    getCurrentMetrics(): Promise<Metric>;

    getPendingTask(): Promise<number>;

}