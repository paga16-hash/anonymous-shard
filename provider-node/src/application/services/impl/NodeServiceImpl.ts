import {NodeService} from "../NodeService.js";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {Node} from "../../../domain/core/node/Node.js";
import {NodeImpl} from "../../../domain/core/node/impl/NodeImpl.js";
import {ProviderEventsHub} from "../../../infrastructure/events/ProviderEventsHub.js";
import {GossipProviderEventsHub} from "../../../infrastructure/events/impl/GossipProviderEventsHub.js";

export class NodeServiceImpl implements NodeService {
    private readonly node: Node;
    private readonly metricService: MetricService;
    //private readonly taskService: TaskService
    private readonly providerEventsHub: ProviderEventsHub;

    constructor(metricService: MetricService) {
        this.node = new NodeImpl();
        this.providerEventsHub = new GossipProviderEventsHub(this.node);
        this.metricService = metricService;
        //this.taskService = new TaskService();
    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetrics();
    }

    async getPendingTask(): Promise<number> {
        return Promise.resolve(0);
    }
}