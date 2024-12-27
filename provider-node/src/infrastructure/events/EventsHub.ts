import {MetricEvent} from "../../domain/events/metric/MetricEvent.js";
import {DomainEvent} from "../../domain/events/DomainEvent.js";
import {TransportManager} from "../transport/TransportManager.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";
import {DiscoveryEvent} from "../../domain/events/discovery/DiscoveryEvent";

export interface EventsHub {

    useTransport(transportManager: TransportManager): void

    routeEvent(domainEvent: DomainEvent): void

    publishMetricEvent(metricEvent: MetricEvent): void

    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void

    publishTaskOutcome(taskEvent: TaskEvent): void

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void

    registerDiscoveryEventsHandler(handler: (discoveryEvent: DiscoveryEvent) => Promise<void>): void
}