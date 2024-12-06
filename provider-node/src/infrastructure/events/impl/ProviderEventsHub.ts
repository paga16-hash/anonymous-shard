import {EventsHub} from "../EventsHub.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {DomainEvent} from "../../../domain/events/DomainEvent.js";
import {TransportManager} from "../../transport/TransportManager.js";
import {Topic} from "../../../utils/Topic.js";

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
        console.log("Handler routeEvent: " + event.toString())
        const listener = this.topicEventListeners.get(event.topic);
        if (listener) {
            listener(event);
        } else {
            console.error("No registered handler for topic: " + event.topic);
        }
    }

    /**
     * Register a handler for the metric topic
     * @param handler the handler to register
     */
    registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): void {
        this.subscribe(Topic.METRIC, handler).then((): void => {
            console.log("Registered handler for topic: " + Topic.METRIC);
        }).catch((err: any):void => {
            console.error("Error registering handler for topic: " + Topic.METRIC, err);
        })
    }

    /**
     * Publish a metric event
     * @param metricEvent the metric event to publish
     */
    publishMetricEvent(metricEvent: MetricEvent): void {
        this.publish(metricEvent).catch((err: any): void => {
            console.error("Error publishing metric", err);
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