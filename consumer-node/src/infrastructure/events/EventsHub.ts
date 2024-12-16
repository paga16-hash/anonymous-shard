import {DomainEvent} from "../../domain/events/DomainEvent.js";
import {TransportManager} from "../transport/TransportManager.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";
import {TaskSubmissionEvent} from "../../domain/events/task/TaskSubmissionEvent";

export interface EventsHub {

    useTransport(transportManager: TransportManager): void

    routeEvent(event: DomainEvent): void

    publishTaskEvent(task: TaskEvent): void

    publishTask(taskSubmissionEvent: TaskSubmissionEvent): void

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void
}