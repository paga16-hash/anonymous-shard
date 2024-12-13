import {Metric} from "../../domain/core/metric/Metric.js";
import {MetricEvent} from "../../domain/events/metric/MetricEvent";

export interface MetricService {

    routeEvent(event: MetricEvent): void

    getCurrentMetric(): Promise<Metric>;

    getKnownMetrics(): Map<string, Metric>

    getBestCandidate(): Map<string, Metric>

}