import {Multiaddr, multiaddr} from '@multiformats/multiaddr';
import {SocksClient} from "socks";
import {AddressInfo, createServer, Socket} from "net";
import {transportSymbol} from "@libp2p/interface";
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
        const socket: Socket = await transport.dial(addr);
        socket.write('Hello through Tor!, I am one of the peers' + onionAddress);
        socket.end();
    } catch (err) {
        console.error('Failed to dial:', err);
    }
})();
