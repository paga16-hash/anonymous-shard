import {NodeService} from "../NodeService";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/Metric.js";
import {Node} from "../../../domain/core/Node.js";
import {NodeImpl} from "../../../domain/core/impl/NodeImpl.js";

export class NodeServiceImpl implements NodeService {
    private readonly metricService: MetricService;
    private readonly node: Node;
    private readonly METRICS_TOPIC = process.env.METRICS_TOPIC

    constructor(metricService: MetricService) {
        this.node = new NodeImpl();
        this.metricService = metricService;
    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetrics();
    }

    async getPendingTask(): Promise<number> {
        return Promise.resolve(0);
    }

    publishMetrics(): void {
        this.node.publish(this.METRICS_TOPIC!, this.metricService.getCurrentMetrics())
            .then(r => console.log("Metrics published"))
            .catch(e => console.error("Error publishing metrics"));
    }

    //TODO ADD METRICS TOPIC HANDLER
    subscribeToMetrics(): void {
        this.node.subscribe(this.METRICS_TOPIC!, (data: any): void => {
            console.log("Received metrics: " + JSON.stringify(data));
        })
            .then(r => console.log("Subscribed to metrics", r))
            .catch(e => console.error("Error subscribing to metrics", e));

    }
}