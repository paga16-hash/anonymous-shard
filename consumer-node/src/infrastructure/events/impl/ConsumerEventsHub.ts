import {EventsHub} from "../EventsHub.js";
import {DomainEvent} from "../../../domain/events/DomainEvent.js";
import {TransportManager} from "../../transport/TransportManager.js";
import {Topic} from "../../../utils/Topic.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {TaskSubmissionEvent} from "../../../domain/events/task/TaskSubmissionEvent.js";

export class ConsumerEventsHub implements EventsHub {
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
        //TODO introduce presentation layer to handle the event safely
        const listener = this.topicEventListeners.get(JSON.parse(event.toString()).topic);
        if (listener) {
            listener(JSON.parse(event.toString()));
        } else {
            console.error("No registered handler for topic: " + event.topic);
        }
    }

    /**
     * Publish a task event
     * @param taskEvent the task event to publish
     */
    publishTaskEvent(taskEvent: TaskEvent): void {
        this.publish(taskEvent).catch((err: any): void => {
            console.error("Error publishing task event", err);
        })
    }

    /**
     * Publish a task submission event
     * @param taskSubmissionEvent the task submission event
     */
    publishTask(taskSubmissionEvent: TaskSubmissionEvent): void {
        this.publishToRandomPeer(taskSubmissionEvent).catch((err: any): void => {
            console.error("Error publishing task submission event", err);
        })
    }

    /**
     * Register a handler for the task topic
     * @param handler the handler to register
     */
    registerTaskEventsHandler(handler: (metricEvent: TaskEvent) => Promise<void>): void {
        this.subscribe(Topic.TASK, handler).then((): void => {
            console.log("Registered handler for topic: " + Topic.TASK);
        }).catch((err: any):void => {
            console.error("Error registering handler for topic: " + Topic.TASK, err);
        })
    }

    /**
     * Publish a domain event
     * @param domainEvent the domain event to publish
     * @private
     */
    private async publish(domainEvent: DomainEvent): Promise<void> {
        if(this.transportManager) {
            await this.transportManager.sendToBroadcast(JSON.stringify(domainEvent));
        } else {
            console.error("No transport manager available to publish event");
        }
    }

    /**
     * Publish to a random peer
     * @param domainEvent the domain event to publish
     * @private
     */
    private async publishToRandomPeer(domainEvent: DomainEvent): Promise<void> {
        if(this.transportManager) {
            await this.transportManager.sendToRandomPeers(JSON.stringify(domainEvent), 1);
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

    private async gossip(topic: string, listener: (data: any) => void): Promise<void> {
        /*this.node.services.pubsub.subscribe(topic);
        this.topicEventListeners.set(topic, listener);*/
    }
}