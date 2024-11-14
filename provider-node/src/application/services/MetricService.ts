import {Metric} from "../../domain/core/Metric.js";

export interface MetricService {
    getCurrentMetrics(): Promise<Metric>;
}