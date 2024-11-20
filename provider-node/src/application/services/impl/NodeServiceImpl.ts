import {NodeService} from "../NodeService.js";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {Node} from "../../../domain/core/node/Node.js";
import {NodeImpl} from "../../../domain/core/node/impl/NodeImpl.js";
import {ProviderEventsHub} from "../../../infrastructure/events/ProviderEventsHub.js";
import {GossipProviderEventsHub} from "../../../infrastructure/events/impl/GossipProviderEventsHub.js";
import {boostrapAddresses} from "../../../utils/BootstrapNode.js";

export class NodeServiceImpl implements NodeService {
    private readonly node: Node;
    private readonly metricService: MetricService;
    //private readonly taskService: TaskService
    //private readonly fileService: FileService;
    private  providerEventsHub: ProviderEventsHub | undefined;

    constructor(nodeAddress: string, metricService: MetricService) {
        this.node = new NodeImpl(nodeAddress, boostrapAddresses());
        this.metricService = metricService;
        setTimeout(() => {
            this.providerEventsHub = new GossipProviderEventsHub(this.node);
            //this.taskService = new TaskService();
            this.startMetricPropagation()
                .then((): void => {
                    console.log("Metric propagation started");
                })
                .catch((e: any): void => {
                    console.error("Error starting metric propagation", e);
                });
        }, 6000);

    }

    private async startMetricPropagation(): Promise<void> {
        // @ts-ignore
        this.providerEventsHub.subscribeToMetrics(async (metricEvent: Metric): Promise<void> => {
            console.log("Received metric event", metricEvent);
        });

        setInterval(async (): Promise<void> => {
            try {
                // @ts-ignore
                this.providerEventsHub.publishMetric(await this.getCurrentMetrics());
            } catch (e) {
                console.error("Error publishing metrics", e);
            }
        }, 8000);
    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetrics();
    }

    async getPendingTask(): Promise<number> {
        return 0
        //return this.taskService.getTasks()
    }
}