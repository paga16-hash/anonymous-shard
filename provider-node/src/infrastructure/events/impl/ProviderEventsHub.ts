import {EventsHub} from "../EventsHub.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {DomainEvent} from "../../../domain/events/DomainEvent.js";
import {TransportManager} from "../../transport/TransportManager.js";
import {Topic} from "../../../utils/Topic.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {EventType} from "../../../utils/EventType.js";
import {TaskResultEvent} from "../../../domain/events/task/TaskResultEvent.js";
import {TaskFailureEvent} from "../../../domain/events/task/TaskFailureEvent.js";
import {DiscoveryEvent} from "../../../domain/events/discovery/DiscoveryEvent.js";

export class ProviderEventsHub implements EventsHub {
    private transportManager: TransportManager | undefined
    private topicEventListeners: Map<string, ((data: any) => void)>

    constructor() {
        this.topicEventListeners = new Map<string, ((data: any) => void)>();
    }

    /**
     * Use the passed transport manager to send and receive messages
     * @param transportManager the transport manager to use
     */
    async useTransport(transportManager: TransportManager): Promise<void> {
        this.transportManager = transportManager;
    }

    /**
     * Route the event to the correct handler
     * @param event the event to route
     */
    async routeEvent(event: DomainEvent): Promise<void> {
        //console.log("Handler routeEvent: " + event)
        //TODO introduce presentation layer to handle the event safely
        const listener = this.topicEventListeners.get(JSON.parse(event.toString()).topic);
        if (listener) {
            listener(JSON.parse(event.toString()));
        } else {
            console.log(JSON.parse(event.toString()))
            console.error("No registered handler for topic: " + JSON.parse(event.toString()).topic);
        }
    }

    /**
     * Register a handler for the metric topic
     * @param handler the handler to register
     */
    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void {
        this.subscribe(Topic.METRIC, handler).then((): void => {
            console.log("Registered handler for topic: " + Topic.METRIC);
        }).catch((err: any): void => {
            console.error("Error registering handler for topic: " + Topic.METRIC, err);
        })
    }

    /**
     * Publish a metric event
     * @param metricEvent the metric event to publish
     */
    publishMetricEvent(metricEvent: MetricEvent): void {
        this.publish(metricEvent).catch((err: any): void => {
            console.error("Error publishing metric event", err);
        })
    }

    /**
     * Publish a task event
     * @param taskEvent the task event to publish
     */
    publishTaskOutcome(taskEvent: TaskEvent): void {
        switch (taskEvent.type) {
            case EventType.TASK_COMPLETED:
                const taskCompletedEvent: TaskResultEvent = taskEvent as TaskResultEvent
                this.directPublish(taskCompletedEvent.clientId.value, taskCompletedEvent).catch((err: any): void => {
                    console.error("Error publishing task result directly", err);
                })
                break;
            case EventType.TASK_FAILED:
                const taskFailedEvent: TaskFailureEvent = taskEvent as TaskFailureEvent
                this.directPublish(taskFailedEvent.clientId.value, taskFailedEvent).catch((err: any): void => {
                    console.error("Error publishing task event", err);
                })
                break;
            default:
                console.error("Unrecognized or not supported event type: " + taskEvent.type)
        }
    }

    /**
     * Register a handler for the task topic
     * @param handler the handler to register
     */
    registerTaskEventsHandler(handler: (metricEvent: TaskEvent) => Promise<void>): void {
        this.subscribe(Topic.TASK, handler).then((): void => {
            console.log("Registered handler for topic: " + Topic.TASK);
        }).catch((err: any): void => {
            console.error("Error registering handler for topic: " + Topic.TASK, err);
        })
    }

    /**
     * Register a handler for the peers topic
     * @param handler the handler to register
     */
    registerDiscoveryEventsHandler(handler: (discoveryEvent: DiscoveryEvent) => Promise<void>): void {
        this.subscribe(Topic.PEERS, handler).then((): void => {
            console.log("Registered handler for topic: " + Topic.PEERS);
        }).catch((err: any): void => {
            console.error("Error registering handler for topic: " + Topic.PEERS, err);
        })
    }

    /**
     * Publish a domain event
     * @param domainEvent the domain event to publish
     * @private
     */
    private async publish(domainEvent: DomainEvent): Promise<void> {
        if (this.transportManager) {
            await this.transportManager.sendToBroadcast(JSON.stringify(domainEvent));
        } else {
            console.error("No transport manager available to publish event");
        }
    }

    /**
     * Subscribe to a topic
     * @param topic the topic to subscribe to
     * @param listener the listener to call when a message is received
     * @private
     */
    private async subscribe(topic: string, listener: (data: any) => void): Promise<void> {
        this.topicEventListeners.set(topic, listener);
    }

    /**
     * Send a message directly to an address
     * @param address the address to send the message to
     * @param domainEvent the domain event to send to the address
     * @private
     */
    private async directPublish(address: string, domainEvent: DomainEvent): Promise<void> {
        if (this.transportManager) {
            await this.transportManager.sendToPeer(address, JSON.stringify(domainEvent)).then((): void => {
                console.log("Message sent to " + address);
            }).catch((err: any): void => {
                console.error("Error sending message to " + address, err);
            });
        } else {
            console.error("No transport manager available to directly publish message");
        }
    }
}