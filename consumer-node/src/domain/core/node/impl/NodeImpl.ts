import {config} from 'dotenv'
import {Node} from "../Node.js";
import {EventsHub} from "../../../../infrastructure/events/EventsHub.js";
import {ConsumerEventsHub} from "../../../../infrastructure/events/impl/ConsumerEventsHub.js";
import {TransportManager} from "../../../../infrastructure/transport/TransportManager.js";
import {Socks5Transport} from "../../../../infrastructure/transport/socks5/Socks5Transport.js";
import {TaskEvent} from "../../../events/task/TaskEvent.js";
import {SocketTransport} from "../../../../infrastructure/transport/socket/SocketTransport.js";
import {TaskSubmissionEvent} from "../../../events/task/TaskSubmissionEvent.js";
import {TransportManagerImpl} from "../../../../infrastructure/transport/impl/TransportManagerImpl.js";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private readonly anonymousMode: boolean = process.env.ANONYMOUS_MODE === "true";
    private readonly bootstrapNodes: Map<string, number>;
    private readonly address: string;
    private readonly port: number;
    private readonly providerEventsHub: EventsHub;
    private readonly transportManager: TransportManager;

    constructor(address: string, port: number, bootstrapNodes: Map<string, number>) {
        this.bootstrapNodes = bootstrapNodes;
        this.providerEventsHub = new ConsumerEventsHub();
        this.address = address;
        this.port = port
        this.transportManager = this.initTransport()
        this.providerEventsHub.useTransport(this.transportManager)
    }

    private initTransport(): TransportManager {
        if (this.anonymousMode) {
            return new TransportManagerImpl(
                new Socks5Transport({
                        addressMap: this.bootstrapNodes,
                    },
                    this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
            );
        } else {
            return new TransportManagerImpl(
                new SocketTransport({
                        addressMap: this.bootstrapNodes,
                    },
                    this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
            );
        }
    }

    async submitTask(taskEvent: TaskSubmissionEvent): Promise<void> {
        try {
            this.providerEventsHub.publishTask(taskEvent)
        } catch (e) {
            console.error("Error publishing task", e);
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