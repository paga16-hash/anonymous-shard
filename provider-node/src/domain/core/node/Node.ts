import {Metric} from "../metric/Metric.js";
import {MetricEvent} from "../../events/metric/MetricEvent.js";

export interface Node {

    init(): Promise<void>;

    start(): Promise<void>;

    stop(): Promise<void>;

    isRunning(): Promise<boolean>;

    registerMetricsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void;

    propagateMetric(metric: Metric): Promise<void>;
}