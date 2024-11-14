import {config} from 'dotenv'
import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {kadDHT} from '@libp2p/kad-dht'
import {identify} from '@libp2p/identify'
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import { bootstrap } from '@libp2p/bootstrap'
import {Node} from "../Node.js";
import {RPC} from "@chainsafe/libp2p-gossipsub/message";
import {peerIdFromString} from '@libp2p/peer-id'
import Message = RPC.Message;
import {RSAPrivateKey} from "@libp2p/interface/src/keys";
import {generateKeyPair} from "@libp2p/crypto/keys";

config({path: process.cwd() + '/../.env'})

export class NodeImpl implements Node {

    private node: any;
    private bootstrapNodes: string[] = [
        '/ip4/127.0.0.1/tcp/3001/p2p/12D3KooWJuGrEevUwRwjJ3rFtAb1Uh6Bfnz4hXKB1DwPmAA9wubC'
    ];

    /*
    *   peerDiscovery: [
    bootstrap({
      list: bootstrappers
    })
  ],
  services: {
    kadDHT: kadDHT({
      protocol: '/ipfs/lan/kad/1.0.0',
      peerInfoMapper: removePublicAddressesMapper,
      clientMode: false
    }),
    identify: identify()*/

    async init(): Promise<void> {
        const peerId = peerIdFromString('12D3KooWJuGrEevUwRwjJ3rFtAb1Uh6Bfnz4hXKB1DwPmAA9wubC')
        console.log("ID:"+peerId.toString())

        let testPrivateKey = await generateKeyPair("Ed25519")

        //const fixedPeerId = PeerId.createFromPrivKey(Buffer.from('your-pre-generated-private-key', 'hex'))
        //let privateKey =  generateKeyPair("Ed25519").
        console.log("Private Keeey: " + testPrivateKey.toString())


        createLibp2p({
            //privateKey: Buffer.from('12D3KooWJuGrEevUwRwjJ3rFtAb1Uh6Bfnz4hXKB1DwPmAA9wubC', 'hex'),
            addresses:{
                listen: ['/ip4/127.0.0.1/tcp/3000/p2p/12D3KooWJuGrEevUwRwjJ3rFtAb1Uh6Bfnz4hXKB1DwPmAA9wubC']
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
                setTimeout((): void => {
                    setInterval(async (): Promise<void> => {
                        try {
                            await this.publish(process.env.METRICS_TOPIC!, { metric: "value" });
                            console.log("Metrics published");
                        } catch (e) {
                            console.error("Error publishing metrics", e);
                        }
                    }, 30000);
                }, 5000)
            })
            .catch((err) => {
                console.error("Error creating node: " + err);
            })
    }

    constructor() {

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
            if(msg.data === null) return console.error("Received null message from" + msg.from + " on topic " + topic + ". Ignoring.")
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
