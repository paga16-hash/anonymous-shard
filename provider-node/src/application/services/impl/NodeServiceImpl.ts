import {NodeService} from "../NodeService.js";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {Node} from "../../../domain/core/node/Node.js";
import {NodeImpl} from "../../../domain/core/node/impl/NodeImpl.js";
import {mapBootstrapAddresses} from "../../../utils/BootstrapNode.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {MetricEventFactory} from "../../../domain/factories/events/MetricEventFactory.js";
import {MetricAvailableEvent} from "../../../domain/events/metric/MetricAvailableEvent.js";

export class NodeServiceImpl implements NodeService {
    private readonly node: Node;
    private readonly metricService: MetricService;
    //private readonly taskService: TaskService
    //private readonly fileService: FileService;

    constructor(metricService: MetricService) {
        this.node = new NodeImpl(process.env.HOST!, parseInt(process.env.PORT!), mapBootstrapAddresses());
        this.metricService = metricService;
        this.init().then((): void => {
            console.log("Provider service node initialized");
        })
    }

    private async init(): Promise<void> {
        //await this.node.init();
        this.node.registerMetricEventsHandler(async (metricEvent: MetricEvent): Promise<void> => {
            console.log("Received metric event", metricEvent);
            //This method will take care to route the event to the correct handler, in this case the topic is METRIC
            //and the type is metric-available
            //this.metricService.routeEvent(metricEvent);
            this.metricService.updateKnownMetrics(metricEvent.peerId, (metricEvent as MetricAvailableEvent).metric);
            //console.log(this.metricService.getKnownMetrics().size);
        })
        setInterval(async (): Promise<void> => {
            let metricEvent: MetricAvailableEvent =
                MetricEventFactory.createMetricAvailableEvent(this.node.peerId(), await this.getCurrentMetrics());
            this.node.propagateMetric(metricEvent)
                .catch((e: any): void => {
                console.error("Error propagating metric", e);
            })
        }, 30 * 1000);
    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetric();
    }

    async getPendingTask(): Promise<number> {
        return 0
        //return this.taskService.getPendingTasks()
    }
}