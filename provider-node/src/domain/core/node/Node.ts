import {MetricEvent} from "../../events/metric/MetricEvent.js";
import {TaskEvent} from "../../events/task/TaskEvent.js";
import {DiscoveryEvent} from "../../events/discovery/DiscoveryEvent.js";

export interface Node {

    peerId(): string;

    joinNetwork(): Promise<void>;

    propagateMetric(metric: MetricEvent): Promise<void>;

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void;

    routeTaskOutcome(taskEvent: TaskEvent): Promise<void>;

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void;

    registerDiscoveryEventsHandler(handler: (discoveryEvent: DiscoveryEvent) => Promise<void>): void

    routeDiscoveryEvent(discoveryEvent: DiscoveryEvent): void;

}