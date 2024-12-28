import {NodeService} from "../NodeService.js";
import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {Node} from "../../../domain/core/node/Node.js";
import {NodeImpl} from "../../../domain/core/node/impl/NodeImpl.js";
import {mapBootstrapAddresses} from "../../../utils/BootstrapNode.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {MetricEventFactory} from "../../../domain/factories/events/metric/MetricEventFactory.js";
import {TaskService} from "../TaskService.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {Task} from "../../../domain/core/task/Task.js";
import {DiscoveryEvent} from "../../../domain/events/discovery/DiscoveryEvent";

export class NodeServiceImpl implements NodeService {
    private readonly GOSSIP_INTERVAL: number = 30 * 1000;
    private readonly node: Node;
    private readonly metricService: MetricService;
    private readonly taskService: TaskService

    constructor(metricService: MetricService, taskService: TaskService) {
        this.node = new NodeImpl(process.env.HOST!, parseInt(process.env.PORT!), mapBootstrapAddresses());
        this.metricService = metricService;
        this.taskService = taskService;
        this.init().then((): void => {
            console.log("Provider service node initialized");
        })
    }

    private async init(): Promise<void> {
        this.node.registerMetricEventsHandler(async (metricEvent: MetricEvent): Promise<void> => {
            console.log("Received metric event");
            this.metricService.routeEvent(metricEvent);
        })
        this.node.registerTaskEventsHandler(async (taskEvent: TaskEvent): Promise<void> => {
            console.log("Received task event");
            this.taskService.routeEvent(taskEvent);
        })

        this.node.registerDiscoveryEventsHandler(async (discoveryEvent: DiscoveryEvent): Promise<void> => {
            console.log("Received discovery event");
            this.node.routeDiscoveryEvent(discoveryEvent);
        })

        this.taskService.registerTaskOutcomeHandler(async (taskEvent: TaskEvent): Promise<void> => {
            await this.node.routeTaskOutcome(taskEvent);
        });


        this.waitAndJoinNetwork();
    }

    async getCurrentMetrics(): Promise<Metric> {
        return this.metricService.getCurrentMetric();
    }

    async getPendingTask(): Promise<Task[]> {
        return this.taskService.getPendingTasks()
    }

    private waitAndJoinNetwork(): void {
        setTimeout(async (): Promise<void> => {
            this.node.joinNetwork().then((): void => {
                console.log("Joined network, start gossiping metrics");
                setInterval(async (): Promise<void> => {
                    this.node.propagateMetric(
                        MetricEventFactory.createMetricAvailableEvent(this.node.peerId(), await this.getCurrentMetrics())
                    ).catch((e: any): void => {
                        console.error("Error propagating metric", e);
                    })
                }, this.GOSSIP_INTERVAL);
            }).catch((e: any): void => {
                console.error("Error joining network", e);
            })
        }, 5000);
    }
}