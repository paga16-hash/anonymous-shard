import {config} from 'dotenv'
import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {kadDHT} from '@libp2p/kad-dht'
import {identify} from '@libp2p/identify'
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import {ping} from '@libp2p/ping';
import {bootstrap} from '@libp2p/bootstrap'
import {generateKeyPairFromSeed} from '@libp2p/crypto/keys'
import {Node} from "../Node.js";
import {boostrapNodeSeedFromEnv} from "../../../../utils/BootstrapNode.js";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {
    private node: any;
    private topicEventListeners: Map<string, ((data: any) => void)> = new Map<string, ((data: any) => void)>();

    constructor(address: string, bootstrapNodes: string[]) {
        this.init(address, bootstrapNodes).then(() => console.log("Node initialized")).catch(e => console.error("Error initializing node", e));
    }

    private async init(address: string, bootstrapNodes: string[]): Promise<void> {
        let peerSeed;
        if (process.env.BOOTSTRAP_NODE) {
            peerSeed = boostrapNodeSeedFromEnv(parseInt(process.env.BOOTSTRAP_NODE!))
            peerSeed = await generateKeyPairFromSeed('Ed25519', Buffer.from(peerSeed!, 'utf8'))
            //this.bootstrapNodes = this.bootstrapNodes.filter((_, i) => (i+1) !== parseInt(process.env.BOOTSTRAP_NODE!))
        }

        createLibp2p({
            privateKey: peerSeed,
            addresses: {
                listen: [`/ip4/${address}/tcp/${3000 + parseInt(process.env.BOOTSTRAP_NODE!)}/`]
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
                ping: ping()
            },
            peerDiscovery: [
                bootstrap({
                    list: bootstrapNodes
                })
            ]
        })
            .then(async (node): Promise<void> => {
                this.node = node;
                await this.start();

                await this.node.addEventListener('message', (evt: any): void => {
                    if (evt.detail.data) {
                        const messageContent = evt.detail.data.toString();
                        console.log("Raw message received:", messageContent);
                        try {
                            const parsedData = JSON.parse(messageContent);
                            this.onMessage(evt.detail.topic, parsedData);
                        } catch (e) {
                            console.error("Error parsing message content:", e);
                        }
                    }
                });
            })
            .catch((err): void => {
                console.error("Error creating node: " + err);
            })
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

    async publish(topic: string, data: any): Promise<void> {
        const bufferData: Buffer = Buffer.from(JSON.stringify(data));
        await this.node.services.pubsub.publish(topic, bufferData);
    }

    async subscribe(topic: string, listener: (data: any) => void): Promise<void> {
        this.node.services.pubsub.subscribe(topic);
        this.topicEventListeners.set(topic, listener)
    }

    private async onMessage(topic: string, data: any): Promise<void> {
        const listener = this.topicEventListeners.get(topic);
        if (listener) {
            listener(data);
        } else {
            console.error("No registered listener for topic: " + topic);
        }
    }

    async isRunning(): Promise<boolean> {
        return this.node.isStarted();
    }

}
