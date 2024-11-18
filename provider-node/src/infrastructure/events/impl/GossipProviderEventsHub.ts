import {ProviderEventsHub} from "../ProviderEventsHub.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {Node} from "../../../domain/core/node/Node.js";

export class GossipProviderEventsHub implements ProviderEventsHub{
    private readonly METRICS_TOPIC = process.env.METRICS_TOPIC
    private readonly node: any;

    constructor(node: Node) {
        this.node = node;
    }
    publishMetrics(metric: Metric): void {
        /*this.node.publish(this.METRICS_TOPIC!, this.metricService.getCurrentMetrics())
            .then(r => console.log("Metrics published"))
            .catch(e => console.error("Error publishing metrics"));*/
        console.log("Publishing metrics: " + JSON.stringify(metric));
    }

    //TODO ADD METRICS TOPIC HANDLER
    subscribeToMetrics(handler: (metricEvent: MetricEvent) => void): void {
/*        this.node.subscribe(this.METRICS_TOPIC!, (data: any): void => {
            console.log("Received metrics: " + JSON.stringify(data));
        })
            .then(r => console.log("Subscribed to metrics", r))
            .catch(e => console.error("Error subscribing to metrics", e));*/

    }

    publishMetric(metric: Metric): void {
    }
}