import {config} from 'dotenv'
import {Node} from "../Node.js";
import {EventsHub} from "../../../../infrastructure/events/EventsHub.js";
import {ProviderEventsHub} from "../../../../infrastructure/events/impl/ProviderEventsHub.js";
import {MetricEvent} from "../../../events/metric/MetricEvent.js";
import {TransportManager} from "../../../../infrastructure/transport/TransportManager.js";
import {Socks5TransportManager} from "../../../../infrastructure/transport/socks5/Socks5TransportManager.js";
import {Socks5Transport} from "../../../../infrastructure/transport/socks5/Socks5Transport.js";
import {TaskEvent} from "../../../events/task/TaskEvent.js";
import {SocketTransportManager} from "../../../../infrastructure/transport/socket/SocketTransportManager.js";
import {SocketTransport} from "../../../../infrastructure/transport/socket/SocketTransport.js";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private readonly bootstrapNodes: Map<string, number>;
    private readonly address: string;
    private readonly port: number;
    private readonly providerEventsHub: EventsHub;
    private readonly transportManager: TransportManager;
    private readonly anonymousMode: boolean = process.env.ANONYMOUS_MODE === "true";

    constructor(address: string, port: number, bootstrapNodes: Map<string, number>) {
        this.bootstrapNodes = bootstrapNodes;
        this.providerEventsHub = new ProviderEventsHub();
        this.address = address;
        this.port = port
        /*this.transportManager = new Socks5TransportManager(
            new Socks5Transport({
                    addressMap: this.bootstrapNodes,
                },
                this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
        );*/
        this.transportManager = this.initTransport()
        this.providerEventsHub.useTransport(this.transportManager)
    }

    private initTransport(): TransportManager {
        if(this.anonymousMode) {
            return new Socks5TransportManager(
                new Socks5Transport({
                        addressMap: this.bootstrapNodes,
                    },
                    this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
            );
        } else {
            return new SocketTransportManager(
                new SocketTransport({
                        addressMap: this.bootstrapNodes,
                    },
                    this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
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

    async registerMetricEventsHandler(handler: (metric: MetricEvent) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerMetricEventsHandler(handler);
        } catch (e) {
            console.error("Error registering handler for provider-metrics topic", e);
        }
    }

    async registerTaskEventsHandler(handler: (metric: TaskEvent) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerTaskEventsHandler(handler);
        } catch (e) {
            console.error("Error registering handler for task topic", e);
        }
    }

    /**
     * Return the peer id of the node
     * @return the peer id of the node composed by address:port
     */
    peerId(): string {
        return this.address + ":" + this.port;
    }
}