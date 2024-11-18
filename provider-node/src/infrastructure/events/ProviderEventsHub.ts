import {Metric} from "../../domain/core/metric/Metric.js";
import {MetricEvent} from "../../domain/events/metric/MetricEvent.js";

export interface ProviderEventsHub {
    publishMetric(metric: Metric): void

    subscribeToMetrics(handler: (metricEvent: MetricEvent) => void): void
}