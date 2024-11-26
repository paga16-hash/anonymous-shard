import {Metric} from "../../domain/core/metric/Metric.js";

export interface MetricService {
    getCurrentMetric(): Promise<Metric>;

    getKnownMetrics(): Map<string, Metric>

    getBestCandidate(): Map<string, Metric>

    updateKnownMetrics(peerId: string, metric: Metric): void
}