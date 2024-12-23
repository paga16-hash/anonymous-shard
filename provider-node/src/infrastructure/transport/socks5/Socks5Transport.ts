import {createServer, Server, Socket} from "net";
import {Socks5Config} from "./Socks5Config.js";
import {SocksClient} from "socks";
import {Transport} from "../Transport.js";
import {DomainEvent} from "../../../domain/events/DomainEvent.js";


export class Socks5Transport implements Transport {
    private readonly config: Socks5Config;
    private readonly DEFAULT_SOCKS_HOST: string = '127.0.0.1';
    private readonly DEFAULT_SOCKS_PORT: number = 9050;
    private readonly handler: (message: DomainEvent) => void;

    constructor(config: Partial<Socks5Config> = {}, onMessage: (message: DomainEvent) => void) {
        this.config = {
            sleepOnError: 5000,
            socksHost: this.DEFAULT_SOCKS_HOST,
            socksPort: this.DEFAULT_SOCKS_PORT,
            addressMap: new Map(),
            ...config,
        };
        this.handler = onMessage;
        this.listen(process.env.HOST!, parseInt(process.env.PORT!)).catch(console.error);
    }

    /**
     * Get the onion addresses.
     * @returns the onion addresses
     */
    getAddresses(): string[] {
        return Array.from(this.config.addressMap.keys());
    }

    /**
     * Add a mapping from an onion address to a port.
     * @param address the onion address
     * @param port the port to map to
     */
    addAddressMapping(address: string, port: number): void {
        this.config.addressMap.set(address, port);
    }

    /**
     * Remove a mapping from an onion address.
     * @param onion the onion address
     */
    removeAddressMapping(onion: string): void {
        this.config.addressMap.delete(onion);
    }

    /**
     * Listen on the given address.
     * @example await transport.listen(multiaddr('your-onion-address'))
     * @param address the address to listen on
     * @param port the port to listen on
     */
    async listen(address: string, port: number): Promise<void> {
        console.log("Trying to listen: ", address, "on port", port);

        const server: Server = createServer((socket: Socket): void => {
            console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
            socket.on('connect', (): void => {
                console.log('Connection established with', socket.remoteAddress);
            });

            socket.on('data', (data: Buffer): void => {
                //parse the data and cast to a domain event depending on the topic
                //console.log('Received:', JSON.parse(data.toString()), 'from', socket.remoteAddress);
                this.handler(JSON.parse(data.toString()) as unknown as DomainEvent);
                //this.handler(presentationLayer.parseEvent(data));
            });

            socket.on('end', (): void => {
                console.log('Connection ended with ', socket.remoteAddress);
            });
        });

        server.listen(port, (): void => {
            console.log(`Listening on ${address}:${port}`);
        });
    }

    /**
     * Dial the given address with retries.
     * @param address The address to dial.
     * @param maxRetries Maximum number of retry attempts.
     */
    // @ts-ignore TODO fix this
    async dial(address: string, maxRetries: number = 5): Promise<Socket> {
        let attempt: number = 0;

        while (attempt < maxRetries) {
            attempt++;
            console.log(`Attempt ${attempt}: Trying to dial ${address} via SOCKS5 proxy...`);

            try {
                const socket: Socket = (await SocksClient.createConnection({
                    proxy: {
                        host: this.config.socksHost,
                        port: this.config.socksPort,
                        type: 5,
                    },
                    command: 'connect',
                    destination: {
                        host: `${address}.onion`,
                        port: this.config.addressMap.get(address) || 80,
                    },
                })).socket;

                console.log('Connected to target via SOCKS5 proxy.');
                return socket;
            } catch (err) {
                console.error(`Attempt ${attempt} failed`);//: , err
                if (attempt < maxRetries) {
                    console.log(`Retrying in ${this.config.sleepOnError / 1000} seconds...`);
                    await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, this.config.sleepOnError));
                } else {
                    console.error('Max retries reached. Unable to connect.');
                }
            }
        }
    }

}