/*
import {createLibp2p} from "libp2p";
import {tcp} from "@libp2p/tcp";
import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import {identify} from "@libp2p/identify";
import {kadDHT} from "@libp2p/kad-dht";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {ping} from "@libp2p/ping";
import {bootstrap} from "@libp2p/bootstrap";

export const createNode = async (peerSeed: any, address: string, bootstrapNodes: string[]): Promise<any> => {
    return await createLibp2p({
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
    });
}*/
