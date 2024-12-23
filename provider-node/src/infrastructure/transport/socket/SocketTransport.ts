import {createServer, Server, Socket} from "net";
import {SocketConfig} from "./SocketConfig.js";
import {Transport} from "../Transport.js";
import {DomainEvent} from "../../../domain/events/DomainEvent.js";
import * as process from "node:process";

/**
 * Socket transport, without any proxy.
 */
export class SocketTransport implements Transport {
    private readonly config: SocketConfig;
    private readonly handler: (message: DomainEvent) => void;

    constructor(config: Partial<SocketConfig> = {}, onMessage: (message: DomainEvent) => void) {
        this.config = {
            sleepOnError: 5000,
            addressMap: new Map(),
            ...config,
        };
        this.handler = onMessage;
        this.listen("127.0.0.1").catch(console.error);
        /*this.getAddresses().forEach((address: string): void => {
            this.listen(address).catch(console.error);
        });*/
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
        this.listen(address);
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
     * @example await transport.listen(multiaddr('your-address'))
     * @param address
     */
    //TODO To modify to adhere to the correct listener
    async listen(address: string): Promise<void> {
        /*console.log("Trying to listen: ", address)
        const port = this.config.addressMap.get(address);
        if (!port) {
            throw new Error(`Address ${address} not mapped to a port.`);
        }*/
        console.log("Trying to listen: ", address, "on port", process.env.PORT)
        const port = process.env.PORT!

        const server: Server = createServer((socket: Socket): void => {
            console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
            socket.on('connect', (): void => {
                console.log('Connection established with', socket.remoteAddress);
            });

            socket.on('data', (data: Buffer): void => {
                //parse the data and cast to a domain event depending on the topic
                console.log('Received:', JSON.parse(data.toString()), 'from', socket.remoteAddress);
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
            console.log(`Attempt ${attempt}: Trying to dial ${address} directly...`);

            try {
                const port: number = this.config.addressMap.get(address) || 80;
                console.log(`Dialing ${address}:${port}...`);
                const socket: Socket = new Socket();
                socket.connect(port, address);
                return new Promise((resolve, reject): void => {
                    socket.once('connect', (): void => {
                        console.log('Connected to target.');
                        resolve(socket);
                    });

                    socket.once('error', (err:  Error): void => {
                        socket.destroy();
                        reject(err);
                    });
                });
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