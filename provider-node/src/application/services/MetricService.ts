import {Metric} from "../../domain/core/metric/Metric.js";

export interface MetricService {
    getCurrentMetrics(): Promise<Metric>;
}