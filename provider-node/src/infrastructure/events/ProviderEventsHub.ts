import {Metric} from "../../domain/core/metric/Metric.js";
import {MetricEvent} from "../../domain/events/metric/MetricEvent.js";
import {Node} from "../../domain/core/node/Node.js";

export interface ProviderEventsHub {
    // This method allows initializing the provider events hub,
    // subscribing to the necessary and mandatory topics or main events topics
    init(node: Node): Promise<void>

    publishMetric(metric: Metric): void

    registerMetricsEvent(handler: (metricEvent: any) => Promise<void>): void
}