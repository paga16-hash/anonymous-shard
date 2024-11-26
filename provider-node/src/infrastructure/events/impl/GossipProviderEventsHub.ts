import {ProviderEventsHub} from "../ProviderEventsHub.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";

export class GossipProviderEventsHub implements ProviderEventsHub {
    private readonly METRICS_TOPIC = process.env.METRICS_TOPIC
    private node: any;
    private topicEventListeners: Map<string, ((data: any) => void)>

    constructor() {
        this.topicEventListeners = new Map<string, ((data: any) => void)>();
    }

    async init(node: any): Promise<void> {
        this.node = node;
        this.node.services.pubsub.addEventListener('message', (evt: any): void => {
            if (evt.detail.data) {
                try {
                    const messageContent = evt.detail.data.toString();
                    const parsedData = JSON.parse(messageContent);
                    this.onMessage(evt.detail.topic, parsedData);
                } catch (e) {
                    console.error("Error parsing message content:", e);
                }
            }
        });
    }

    registerMetricsEvent(handler: (metricEvent: MetricEvent) => Promise<void>): void {
        this.subscribe(this.METRICS_TOPIC!, handler).then((): void => {
            console.log("Subscribed to metrics topic");
        }).catch((err: any): void => {
            console.error("Error subscribing to metrics topic", err);
        })
    }

    publishMetric(metricEvent: MetricEvent): void {
        this.publish(this.METRICS_TOPIC!, metricEvent).catch((err: any): void => {
            console.error("Error publishing metric", err);
        })
    }

    private async publish(topic: string, data: any): Promise<void> {
        const bufferData: Buffer = Buffer.from(JSON.stringify(data));
        await this.node.services.pubsub.publish(topic, bufferData);
    }

    private async subscribe(topic: string, listener: (data: any) => void): Promise<void> {
        this.node.services.pubsub.subscribe(topic);
        this.topicEventListeners.set(topic, listener);
    }

    private async onMessage(topic: string, data: any): Promise<void> {
        const listener = this.topicEventListeners.get(topic);
        if (listener) {
            listener(data);
        } else {
            console.error("No registered listener for topic: " + topic);
        }
    }
}