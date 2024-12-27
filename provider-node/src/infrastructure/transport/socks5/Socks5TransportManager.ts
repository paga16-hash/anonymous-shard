import {Socket} from "net";
import {Socks5Transport} from "./Socks5Transport.js";
import {TransportManager} from "../TransportManager.js";
import {DiscoveryComponent} from "../../network/DiscoveryComponent.js";
import {DHTDiscoveryComponent} from "../../network/dht/DHTDiscoveryComponent.js";

export class Socks5TransportManager implements TransportManager {
    private readonly transport: Socks5Transport;
    private discoveryComponent: DiscoveryComponent;

    constructor(transport: Socks5Transport, discoveryComponent: DiscoveryComponent = new DHTDiscoveryComponent("", new Map(), (address: string, message: string) => {
    })) {
        this.transport = transport;
        this.discoveryComponent = discoveryComponent;
    }

    /**
     * Add the discovery component.
     * @param discoveryComponent
     */
    addDiscoveryComponent(discoveryComponent: DiscoveryComponent): void {
        this.discoveryComponent = discoveryComponent;
    }

    /**
     * Send a message to a peer, identified by its onion address.
     * @param address the onion address of the peer
     * @param message the message to send
     */
    async sendToPeer(address: string, message: string): Promise<void> {
        const socket: Socket = await this.transport.dial(address);
        socket.write(JSON.stringify(message));
        socket.end();
    }

    /**
     * Send a message to all known peers.
     * @param message the message to send
     */
    async sendToBroadcast(message: string): Promise<void> {
        for (const address of this.discoveryComponent.getAddresses()) {
            await this.sendToPeer(address, message);
        }
    }

    async sendToRandomPeers(message: string, gossipFactor: number): Promise<void> {
        const addresses = this.discoveryComponent.getAddresses();
        if (!addresses.length) {
            console.warn("No addresses available to send messages to.");
            return;
        }
        const uniqueRandomAddresses: Set<string> = new Set<string>();
        while (uniqueRandomAddresses.size < gossipFactor && uniqueRandomAddresses.size < addresses.length) {
            const randomIndex: number = Math.floor(Math.random() * addresses.length);
            uniqueRandomAddresses.add(addresses[randomIndex]);
        }
        await Promise.all(
            Array.from(uniqueRandomAddresses).map((address: string) => this.sendToPeer(address, message))
        );
    }


    /**
     * Listen on the given address.
     * @param address the address to listen on
     * @param port the port to listen on
     */
    async listen(address: string, port: number): Promise<void> {
        await this.transport.listen(address, port);
    }
}