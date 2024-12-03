import {createServer, Server, Socket} from "net";
import {Socks5Config} from "./Socks5Config.js";
import {SocksClient} from "socks";
import {Transport} from "../Transport.js";

export class Socks5Transport implements Transport {
    private readonly config: Socks5Config;
    private readonly DEFAULT_SOCKS_HOST: string = '127.0.0.1';
    private readonly DEFAULT_SOCKS_PORT: number = 9050;
    private readonly handler: (message: string) => void;

    constructor(config: Partial<Socks5Config> = {}, onMessage: (message: string) => void) {
        this.config = {
            sleepOnError: 100,
            socksHost: this.DEFAULT_SOCKS_HOST,
            socksPort: this.DEFAULT_SOCKS_PORT,
            onionMap: new Map(),
            ...config,
        };
        this.handler = onMessage;
    }

    /**
     * Get the onion addresses.
     * @returns the onion addresses
     */
    getAddresses(): string[] {
        return Array.from(this.config.onionMap.keys());
    }

    /**
     * Add a mapping from an onion address to a port.
     * @param onion the onion address
     * @param port the port to map to
     */
    addAddressMapping(onion: string, port: number): void {
        this.config.onionMap.set(onion, port);
    }

    /**
     * Remove a mapping from an onion address.
     * @param onion the onion address
     */
    removeAddressMapping(onion: string): void {
        this.config.onionMap.delete(onion);
    }

    /**
     * Listen on the given address.
     * @example await transport.listen(multiaddr('your-onion-address'))
     * @param address
     */
    async listen(address: string): Promise<void> {
        console.log("Trying to listen: ", address)
        const port = this.config.onionMap.get(address);
        if (!port) {
            throw new Error(`Address ${address} not mapped to a port.`);
        }

        const server: Server = createServer((socket: Socket): void => {
            console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
            socket.on('connect', (): void => {
                console.log('Connection established with', socket.remoteAddress);
            });

            socket.on('data', (data: Buffer): void => {
                console.log('Received:', data.toString(), 'from', socket.remoteAddress);
                this.handler(data.toString());
            });

            socket.on('end', (): void => {
                console.log('Connection ended.');
            });
        });

        server.listen(port, (): void => {
            console.log(`Listening on ${address}:${port}`);
        });
    }

    /**
     * Dial the given address.
     * @param address the address to dial
     */
    async dial(address: string): Promise<Socket> {
        console.log("Trying to dial:", address, "via SOCKS5 proxy...")
        const socket: Socket  = (await SocksClient.createConnection({
            proxy: {
                host: this.config.socksHost,
                port: this.config.socksPort,
                type: 5,
            },
            command: 'connect',
            destination: {
                host: address + '.onion',
                port: this.config.onionMap.get(address) || 80,
            },
        })).socket;
        console.log('Connected to target via SOCKS5 proxy.');
        return socket;
    }
}