import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {MetricFactory} from "../../../domain/factories/metric/MetricFactory.js";

export class MetricServiceImpl implements MetricService {
    knownMetrics: Map<string, Metric> = new Map<string, Metric>();

    async getCurrentMetric(): Promise<Metric> {
        return MetricFactory.currentMetric();
    }

    getBestCandidate(): Map<string, Metric> {
        return this.knownMetrics;
    }

    getKnownMetrics(): Map<string, Metric> {
        return this.knownMetrics;
    }

    updateKnownMetrics(peerId: string, metric: Metric): void {
        this.knownMetrics.set(peerId, metric);
    }


}