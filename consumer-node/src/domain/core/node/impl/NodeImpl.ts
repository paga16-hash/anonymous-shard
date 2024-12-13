import {config} from 'dotenv'
import {Node} from "../Node.js";
import {EventsHub} from "../../../../infrastructure/events/EventsHub.js";
import {ProviderEventsHub} from "../../../../infrastructure/events/impl/ProviderEventsHub.js";
import {TransportManager} from "../../../../infrastructure/transport/TransportManager.js";
import {Socks5TransportManager} from "../../../../infrastructure/transport/socks5/Socks5TransportManager.js";
import {Socks5Transport} from "../../../../infrastructure/transport/socks5/Socks5Transport.js";
import {TaskEvent} from "../../../events/task/TaskEvent";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private readonly bootstrapNodes: Map<string, number>;
    private readonly address: string;
    private readonly port: number;
    private readonly providerEventsHub: EventsHub;
    private readonly transportManager: TransportManager;

    constructor(address: string, port: number, bootstrapNodes: Map<string, number>) {
        this.bootstrapNodes = bootstrapNodes;
        this.providerEventsHub = new ProviderEventsHub();
        this.address = address;
        this.port = port
        this.transportManager = new Socks5TransportManager(
            new Socks5Transport({
                    addressMap: this.bootstrapNodes,
                },
                this.providerEventsHub.routeEvent.bind(this.providerEventsHub))
        );
        this.providerEventsHub.useTransport(this.transportManager)
    }

    async submitTask(taskEvent: TaskEvent): Promise<void> {
        try {
            this.providerEventsHub.publishTaskEvent(taskEvent);
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