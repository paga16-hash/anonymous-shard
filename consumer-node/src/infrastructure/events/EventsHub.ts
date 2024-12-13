import {MetricEvent} from "../../domain/events/metric/MetricEvent.js";
import {DomainEvent} from "../../domain/events/DomainEvent.js";
import {TransportManager} from "../transport/TransportManager.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";

export interface EventsHub {

    useTransport(transportManager: TransportManager): void

    routeEvent(event: DomainEvent): void

    publishMetricEvent(metric: MetricEvent): void

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void
}