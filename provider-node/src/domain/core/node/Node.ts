import {MetricEvent} from "../../events/metric/MetricEvent.js";

export interface Node {

    peerId(): string;

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void;

    propagateMetric(metric: MetricEvent): Promise<void>;
}