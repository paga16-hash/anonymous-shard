/*
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { ping } from "@libp2p/ping";
import { multiaddr } from "@multiformats/multiaddr";
import {webSockets} from "@libp2p/websockets"
import {SocksProxyAgent} from "socks-proxy-agent";

const torProxy = process.env.TOR_PROXY; // e.g., socks5h://tor1:9050
const onionAddress = process.env.ONION_ADDRESS; // e.g., another node's .onion address
const torProxyTest = { host: "127.0.0.1", port: 9050 };

async function main() {
    // Create libp2p node
    const agent = new SocksProxyAgent(
        'socks://127.0.0.1:9050'
    );
    const libp2p = await createLibp2p({
        addresses: {
            listen: ["/ip4/127.0.0.1/tcp/3000/ws"],
        },
        transports: [
            tcp({

            }),
            webSockets({
                websocket: {
                    agent: agent
                }
            })
            //torTransport(torProxy)
        ],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        services: {
            ping: ping(),
        },
    });

    await libp2p.start();
    console.log("Libp2p node started. Peer ID:", libp2p.peerId.toString());

    /!*    if (onionAddress) {
            console.log("Dialing remote peer:", onionAddress);
            try {
                let onion = "/onion/" + onionAddress + "/tcp/";
                const connection = await libp2p.dial(multiaddr(onion));
                console.log("Connected to peer:", connection.remotePeer.toString());
            } catch (err) {
                console.error("Failed to connect to peer:", err);
            }
        }*!/
    //const onionAddress = "i72bhp2qv7ibm5pce3kywxpody3bwjacbzn3w2ggmzckzmptc5rkogid:3000"

    if (onionAddress) {
        console.log("Dialing remote peer:", onionAddress);
        try {
            console.log(multiaddr(`/onion3/${onionAddress.replace(".onion", ":3000")}/`).toJSON())
            const connection = await libp2p.dial(multiaddr(`/onion3/${onionAddress}/tcp/3000/ws/`));
            console.log("Connected to peer:", connection.remotePeer.toString());
        } catch (err) {
            console.error("Failed to connect to peer:", err);
        }
    }

    libp2p.addEventListener("peer:connect", (evt) => {
        console.log("Connected to:", evt.detail.toString());
    });
}

main().catch(console.error);
*/

import {AddressInfo, createServer, Socket} from 'net';
import { tcp } from '@libp2p/tcp';
import { Multiaddr } from '@multiformats/multiaddr';
import { SocksClient } from 'socks';
import { promises as fs } from 'fs';
import {multiaddr} from "@multiformats/multiaddr";
import {getMultiaddrs} from "@libp2p/tcp/dist/src/utils";

const DEFAULT_SOCKS_HOST = "127.0.0.1"
const DEFAULT_SOCKS_PORT = 9050;
let onionAddress = process.env.ONION_ADDRESS; // e.g., another node's .onion address
let socksHost = process.env.SOCKS_HOST;
let socksPort = process.env.SOCKS_PORT!;


interface Socks5TcpConfig {
    sleepOnError: number;
    ttl?: number;
    noDelay?: boolean;
    onionMap: Map<string, number>;
    socksHost: string;
    socksPort: number;
}

class Socks5TcpTransport {
    private config: Socks5TcpConfig;

    constructor(config: Partial<Socks5TcpConfig> = {}) {
        this.config = {
            sleepOnError: 100,
            socksHost: DEFAULT_SOCKS_HOST,
            socksPort: DEFAULT_SOCKS_PORT,
            onionMap: new Map(),
            ...config,
        };
    }

    async listen(address: Multiaddr): Promise<void> {
        const addrStr = address.toString().replace('/onion3/', '').split(':')[0]

        console.log("§IN DIAL: ", addrStr)
        const port = this.config.onionMap.get(addrStr);

        if (!port) {
            throw new Error(`Address ${addrStr} not mapped to a port.`);
        }

        const server = createServer((socket) => {
            console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
            socket.on('data', (data) => {
                console.log('Received:', data.toString());
            });
            socket.on('end', () => {
                console.log('Connection ended.');
            });
        });

        server.listen(port, () => {

            console.log("ADDRESS MIO:" + (server.address() as AddressInfo).address  + (server.address() as AddressInfo).port)
            console.log(`Listening on ${addrStr}:${port}`);
        });
    }

    async dial(address: Multiaddr): Promise<Socket> {
        const onionAddress = this.multiaddrToOnion(address);

        if (!onionAddress) {
            throw new Error(`Unsupported multiaddr: ${address.toString()}`);
        }

        const { socksPort } = this.config;
        const { socksHost } = this.config;

        console.log(`Dialing ${onionAddress.host} on port ${onionAddress.port} via SOCKS5 on port ${socksPort}...`);

        const { socket } = await SocksClient.createConnection({
            proxy: {
                host: socksHost,
                port: socksPort,
                type: 5,
            },
            command: 'connect',
            destination: {
                host: onionAddress.host + '.onion',
                port: onionAddress.port,
            },
        });

        console.log('Connected to target via SOCKS5 proxy.');
        return socket;
    }

    private multiaddrToOnion(addr: Multiaddr): { host: string; port: number } | null {
        /*const parts = addr.toString().split('/');
        const onionIndex = parts.findIndex((part) => part.endsWith('.onion'));
        if (onionIndex === -1) {
            return null;
        }

        const host = parts[onionIndex];
        const port = parseInt(parts[onionIndex + 1], 10) || 80;*/
        //e.g. /onion3/4pfz6moqvxj5ggvisjhv7ripfjldck5vyntzbrygpuekaog4wpyxypad:3000
        const host = addr.toString().replace('/onion3/', '').split(':')[0]
        const port = parseInt(addr.toString().replace('/onion3/', '').split(':')[1], 10) || 80;
        return { host, port };
    }
}

// Example usage
(async () => {
    onionAddress = process.env.ONION_ADDRESS!; // e.g., another node's .onion address
    //onionAddress = "4pfz6moqvxj5ggvisjhv7ripfjldck5vyntzbrygpuekaog4wpyxypad"
    let onionPort = 3000
    const transport = new Socks5TcpTransport({
        onionMap: new Map([[onionAddress, onionPort]]),
        socksHost: socksHost,
        socksPort: parseInt(socksPort)
    });

    //const addr = multiaddr('onion3/'+onionAddress +':3000');
    const addr= multiaddr('/onion3/'+ onionAddress + ':' + onionPort)

    try {
        await transport.listen(addr);
    } catch (err) {
        console.error('Failed to listen:', err);
    }

    try {
        const socket = await transport.dial(addr);
        socket.write('Hello through Tor!');
        socket.end();
    } catch (err) {
        console.error('Failed to dial:', err);
    }
})();
