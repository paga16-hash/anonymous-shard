import {config} from 'dotenv'
import {generateKeyPairFromSeed} from '@libp2p/crypto/keys'
import {Node} from "../Node.js";
import {boostrapNodeSeedFromEnv} from "../../../../utils/BootstrapNode.js";
import {ProviderEventsHub} from "../../../../infrastructure/events/ProviderEventsHub.js";
import {GossipProviderEventsHub} from "../../../../infrastructure/events/impl/GossipProviderEventsHub.js";
import {Metric} from "../../metric/Metric.js";
import {createNode} from "./LibP2PImpl.js";
import {MetricEvent} from "../../../events/metric/MetricEvent.js";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private node: any;
    private providerEventsHub: ProviderEventsHub;
    private readonly address: string;
    private readonly bootstrapNodes: string[];

    constructor(address: string, bootstrapNodes: string[]) {
        this.providerEventsHub = new GossipProviderEventsHub();
        this.address = address;
        this.bootstrapNodes = bootstrapNodes;
    }

    async init(): Promise<void> {
        let peerSeed;
        if (process.env.BOOTSTRAP_NODE) {
            peerSeed = boostrapNodeSeedFromEnv(parseInt(process.env.BOOTSTRAP_NODE!))
            peerSeed = await generateKeyPairFromSeed('Ed25519', Buffer.from(peerSeed!, 'utf8'))
            //this.bootstrapNodes = this.bootstrapNodes.filter((_, i) => (i+1) !== parseInt(process.env.BOOTSTRAP_NODE!))
        }
        this.node = await createNode(peerSeed, this.address, this.bootstrapNodes)
        await this.start();
        await this.providerEventsHub.init(this.node);
    }

    async start(): Promise<void> {
        await this.node.start();

        console.log('Node started with multi-addresses:', this.node.getMultiaddrs().map((addr: any) => addr.toString()));
        this.node.addEventListener('peer:discovery', (event: any): void => {
            console.log(`Discovered peer: ${event.detail.id.toString()} at ${event.timeStamp}`);
        });

        this.node.addEventListener('peer:disconnect', (event: any): void => {
            console.log(`Disconnected peer at ${event.timeStamp}`);
            // Implement reconnection or attempt DHT discovery here if needed
            //connectionFault();
        });
    }

    async stop(): Promise<void> {
        await this.node.stop();
    }

    async propagateMetric(metric: Metric): Promise<void> {
        try {
            this.providerEventsHub.publishMetric(metric);
        } catch (e) {
            console.error("Error publishing metrics", e);
        }
    }

    async registerMetricsHandler(handler: (metric: any) => Promise<void>): Promise<void> {
        try {
            this.providerEventsHub.registerMetricsEvent(handler);
        } catch (e) {
            console.error("Error subscribing to metrics", e);
        }
    }


    async isRunning(): Promise<boolean> {
        return this.node.isStarted();
    }

}
