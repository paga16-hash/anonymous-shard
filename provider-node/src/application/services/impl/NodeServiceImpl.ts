import {NodeService} from "../NodeService.js";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {Node} from "../../../domain/core/node/Node.js";
import {NodeImpl} from "../../../domain/core/node/impl/NodeImpl.js";
import {boostrapAddresses} from "../../../utils/BootstrapNode.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";

export class NodeServiceImpl implements NodeService {
    private readonly node: Node;
    private readonly metricService: MetricService;
    //private readonly taskService: TaskService
    //private readonly fileService: FileService;

    constructor(nodeAddress: string, metricService: MetricService) {
        this.node = new NodeImpl(nodeAddress, boostrapAddresses());
        this.metricService = metricService;
        this.init();
    }

    async init(): Promise<void> {
        await this.node.init();
        setTimeout(async (): Promise<void> => {
            this.node.registerMetricsHandler(async (metricEvent: any): Promise<void> => {
                console.log("Received metric event", metricEvent);
            })
            setInterval(async (): Promise<void> => {
                this.node.propagateMetric(await this.getCurrentMetrics())
                    .then((): void => {
                        console.log("Metric propagated");
                    })
            }, 20000);
        }, 10000);


    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetrics();
    }

    async getPendingTask(): Promise<number> {
        return 0
        //return this.taskService.getPendingTasks()
    }
}