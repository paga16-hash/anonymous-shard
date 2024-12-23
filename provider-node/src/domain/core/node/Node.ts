import {MetricEvent} from "../../events/metric/MetricEvent.js";
import {TaskEvent} from "../../events/task/TaskEvent.js";

export interface Node {

    peerId(): string;

    propagateMetric(metric: MetricEvent): Promise<void>;

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void;

    routeTaskOutcome(taskEvent: TaskEvent): Promise<void>;

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void;

}