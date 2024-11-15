import {config} from 'dotenv'
import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {kadDHT} from '@libp2p/kad-dht'
import {identify} from '@libp2p/identify'
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import {bootstrap} from '@libp2p/bootstrap'
import {generateKeyPairFromSeed} from '@libp2p/crypto/keys'
import {Node} from "../Node.js";
import {RPC} from "@chainsafe/libp2p-gossipsub/message";
import Message = RPC.Message;
import {boostrapAddresses, boostrapNodeSeedFromEnv} from "../../../utils/BootstrapNode.js";
import {peerIdFromPrivateKey} from "@libp2p/peer-id";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {

    private node: any;
    private bootstrapNodes: string[] = boostrapAddresses();

    constructor() {
        console.log(process.env.BOOTSTRAP_NODE)
        this.init().then(() => console.log("Node initialized")).catch(e => console.error("Error initializing node", e));
    }

    async init(): Promise<void> {
        let peerSeed;
        if(process.env.BOOTSTRAP_NODE) {
            peerSeed = boostrapNodeSeedFromEnv(parseInt(process.env.BOOTSTRAP_NODE!))
            peerSeed = await generateKeyPairFromSeed('Ed25519', Buffer.from(peerSeed!, 'utf8'))
            this.bootstrapNodes = this.bootstrapNodes.filter((_, i) => (i+1) !== parseInt(process.env.BOOTSTRAP_NODE!))
        }
        console.log("Bootstrap nodes: " + this.bootstrapNodes)

        createLibp2p({
            privateKey: peerSeed,
            addresses: {
                listen: [`/ip4/127.0.0.1/tcp/${3000 + parseInt(process.env.BOOTSTRAP_NODE!)}/`]
            },
            transports: [tcp()],
            connectionEncrypters: [noise()],
            streamMuxers: [yamux()],
            services: {
                identify: identify(),
                dht: kadDHT({
                    kBucketSize: 20,
                    clientMode: false
                }),
                pubsub: gossipsub(),
            },
            peerDiscovery: [
                bootstrap({
                    list: this.bootstrapNodes
                })
            ]
        })
            .then(async (node): Promise<void> => {
                this.node = node;
                await this.start();
                console.log('Node started with multiaddresses:', node.getMultiaddrs().map(addr => addr.toString()));

                this.subscribe(process.env.METRICS_TOPIC!, data => {
                    console.log("Received metrics: " + JSON.stringify(data));
                }).then(() => console.log("Subscribed to metrics")).catch(e => console.error("Error subscribing to metrics", e));
                setInterval(async (): Promise<void> => {
                    try {
                        await this.publish(process.env.METRICS_TOPIC!, {metric: "value"});
                        console.log("Metrics published");
                    } catch (e) {
                        console.error("Error publishing metrics", e);
                    }
                }, 35000);
            })
            .catch((err) => {
                console.error("Error creating node: " + err);
            })

    }

    async isRunning(): Promise<boolean> {
        return this.node.isStarted();
    }

    async start(): Promise<void> {
        await this.node.start();
        this.node.addEventListener('peer:discovery', (event: any): void => {
            console.log(`Discovered peer: ${event.detail.id.toString()}`);
        });

        this.node.addEventListener('peer:disconnect', (event: any): void => {
            console.log("Peer disconnected:", event.detail.id.toString());
            // Implement reconnection or attempt DHT discovery here if needed
        });
    }

    async stop(): Promise<void> {
        await this.node.stop();
    }

    async subscribe(topic: string, listener: (data: any) => void): Promise<void> {
        this.node.services.pubsub.subscribe(topic, (msg: Message) => {
            if (msg.data === null) return console.error("Received null message from" + msg.from + " on topic " + topic + ". Ignoring.")
            const messageContent: string = msg.data!.toString();
            listener(JSON.parse(messageContent));
        });
        this.node.services.pubsub.subscribe(topic, listener);
    }

    async publish(topic: string, data: any): Promise<void> {
        const bufferData: Buffer = Buffer.from(JSON.stringify(data));
        await this.node.services.pubsub.publish(topic, bufferData);
    }

}
