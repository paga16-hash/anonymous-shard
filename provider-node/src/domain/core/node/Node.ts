import {MetricEvent} from "../../events/metric/MetricEvent.js";
import {TaskEvent} from "../../events/task/TaskEvent";

export interface Node {

    peerId(): string;

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void;

    propagateMetric(metric: MetricEvent): Promise<void>;

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void;

}