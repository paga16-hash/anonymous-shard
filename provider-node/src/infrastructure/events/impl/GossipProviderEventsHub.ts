import {ProviderEventsHub} from "../ProviderEventsHub.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {Node} from "../../../domain/core/node/Node.js";

export class GossipProviderEventsHub implements ProviderEventsHub {
    private readonly METRICS_TOPIC = process.env.METRICS_TOPIC
    private readonly node: any;

    constructor(node: Node) {
        this.node = node;
    }

    //TODO ADD METRICS TOPIC HANDLER
    subscribeToMetrics(handler: (metricEvent: MetricEvent) => Promise<void>): void {
        this.node.subscribe(this.METRICS_TOPIC!, handler).then((): void => {
            console.log("Subscribed to metrics topic");
        }).catch((err: any): void => {
            console.error("Error subscribing to metrics topic", err);
        })
    }
    publishMetric(metric: Metric): void {
        console.log(this.METRICS_TOPIC, metric)
        this.node.publish(this.METRICS_TOPIC!, metric).then((): void => {
            console.log("Published metric");
        }).catch((err: any): void => {
            console.error("Error publishing metric", err);
        })
    }
}