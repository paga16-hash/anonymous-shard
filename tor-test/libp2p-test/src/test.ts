import { createServer, Socket } from 'net';
import { tcp } from '@libp2p/tcp';
import { Multiaddr } from '@multiformats/multiaddr';
import { SocksClient } from 'socks';
import { promises as fs } from 'fs';
import {multiaddr} from "@multiformats/multiaddr";

const DEFAULT_SOCKS_PORT = 9050;

interface Socks5TcpConfig {
    sleepOnError: number;
    ttl?: number;
    noDelay?: boolean;
    onionMap: Map<string, number>;
    socksPort: number;
}

class Socks5TcpTransport {
    private config: Socks5TcpConfig;

    constructor(config: Partial<Socks5TcpConfig> = {}) {
        this.config = {
            sleepOnError: 100,
            socksPort: DEFAULT_SOCKS_PORT,
            onionMap: new Map(),
            ...config,
        };
    }

    async listen(address: Multiaddr): Promise<void> {
        const addrStr = address.toString();
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
            console.log(`Listening on ${addrStr}:${port}`);
        });
    }

    async dial(address: Multiaddr): Promise<Socket> {
        const onionAddress = this.multiaddrToOnion(address);

        if (!onionAddress) {
            throw new Error(`Unsupported multiaddr: ${address.toString()}`);
        }

        const { socksPort } = this.config;

        console.log(`Dialing ${onionAddress} via SOCKS5 on port ${socksPort}...`);

        const { socket } = await SocksClient.createConnection({
            proxy: {
                host: '127.0.0.1',
                port: socksPort,
                type: 5,
            },
            command: 'connect',
            destination: {
                host: onionAddress.host,
                port: onionAddress.port,
            },
        });

        console.log('Connected to target via SOCKS5 proxy.');
        return socket;
    }

    private multiaddrToOnion(addr: Multiaddr): { host: string; port: number } | null {
        const parts = addr.toString().split('/');
        const onionIndex = parts.findIndex((part) => part.endsWith('.onion'));
        if (onionIndex === -1) {
            return null;
        }

        const host = parts[onionIndex];
        const port = parseInt(parts[onionIndex + 1], 10) || 80;
        return { host, port };
    }
}

// Example usage
(async () => {
    const transport = new Socks5TcpTransport({
        onionMap: new Map([['/onion3/someonionaddress', 8080]]),
    });

    const addr = multiaddr('/onion3/someonionaddress');

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
