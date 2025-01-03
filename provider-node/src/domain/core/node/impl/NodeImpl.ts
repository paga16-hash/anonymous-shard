import {config} from 'dotenv'
import {Node} from "../Node.js";
import {EventsHub} from "../../../../infrastructure/events/EventsHub.js";
import {ProviderEventsHub} from "../../../../infrastructure/events/impl/ProviderEventsHub.js";
import {MetricEvent} from "../../../events/metric/MetricEvent.js";
import {TransportManager} from "../../../../infrastructure/transport/TransportManager.js";
import {Socks5Transport} from "../../../../infrastructure/transport/socks5/Socks5Transport.js";
import {TaskEvent} from "../../../events/task/TaskEvent.js";
import {SocketTransport} from "../../../../infrastructure/transport/socket/SocketTransport.js";
import {DHTDiscoveryComponent} from "../../../../infrastructure/network/dht/DHTDiscoveryComponent.js";
import {DiscoveryComponent} from "../../../../infrastructure/network/DiscoveryComponent.js";
import {DiscoveryEvent} from "../../../events/discovery/DiscoveryEvent.js";
import {TransportManagerImpl} from "../../../../infrastructure/transport/impl/TransportManagerImpl.js";


config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private readonly bootstrapNodes: Map<string, number>;
    private readonly address: string;
    private readonly port: number;
    private readonly providerEventsHub: EventsHub;
    private readonly transportManager: TransportManager;
    private readonly dhtComponent: DiscoveryComponent;
    private readonly anonymousMode: boolean = process.env.ANONYMOUS_MODE === "true";

    constructor(address: string, port: number, bootstrapNodes: Map<string, number>) {
        this.bootstrapNodes = bootstrapNodes;
        this.providerEventsHub = new ProviderEventsHub();
        this.address = address;
        this.port = port
        this.transportManager = this.initTransport()
        this.dhtComponent = new DHTDiscoveryComponent(this.peerId(), this.bootstrapNodes, this.transportManager.sendToPeer.bind(this.transportManager))
        this.transportManager.addDiscoveryComponent(this.dhtComponent)
        this.providerEventsHub.useTransport(this.transportManager)
    }

    async joinNetwork(): Promise<void> {
        await this.dhtComponent.joinNetwork()
    }

    private initTransport(): TransportManager {
        if (this.anonymousMode) {
            return new TransportManagerImpl(
                new Socks5Transport({}, this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
            );
        } else {
            return new TransportManagerImpl(
                new SocketTransport({}, this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
            );
        }
    }

    async propagateMetric(metricEvent: MetricEvent): Promise<void> {
        try {
            this.providerEventsHub.publishMetricEvent(metricEvent);
        } catch (e) {
            console.error("Error publishing metrics", e);
        }
    }

    async registerMetricEventsHandler(handler: (metricEvent: MetricEvent) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerMetricEventsHandler(handler);
        } catch (e) {
            console.error("Error registering handler for provider-metrics topic", e);
        }
    }

    async routeTaskOutcome(taskEvent: TaskEvent): Promise<void> {
        try {
            this.providerEventsHub.publishTaskOutcome(taskEvent)
        } catch (e) {
            console.error("Error publishing task event", e);
        }
    }

    async registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerTaskEventsHandler(handler);
        } catch (e) {
            console.error("Error registering handler for task topic", e);
        }
    }

    async registerDiscoveryEventsHandler(handler: (discoveryEvent: DiscoveryEvent) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerDiscoveryEventsHandler(handler);
        } catch (e) {
            console.error("Error registering handler for peers topic", e);
        }
    }

    async routeDiscoveryEvent(discoveryEvent: DiscoveryEvent): Promise<void> {
        try {
            this.dhtComponent.handleDiscoveryEvent(discoveryEvent)
        } catch (e) {
            console.error("Error routing discovery event", e);
        }
    }

    getKnownPeers(): string[] {
        return this.dhtComponent.getAddresses()
    }

    /**
     * Return the peer id of the node
     * @return the peer id of the node composed by address:port
     */
    peerId(): string {
        return this.address + ":" + this.port;
    }
}