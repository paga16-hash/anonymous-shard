import {DomainEvent} from "../../domain/events/DomainEvent.js";
import {TransportManager} from "../transport/TransportManager.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";

export interface EventsHub {

    useTransport(transportManager: TransportManager): void

    routeEvent(event: DomainEvent): void

    publishTaskEvent(task: TaskEvent): void

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void
}