import {Socket} from "net";
import {TransportManager} from "../TransportManager.js";
import {DiscoveryComponent} from "../../network/DiscoveryComponent.js";
import {DHTDiscoveryComponent} from "../../network/dht/DHTDiscoveryComponent.js";
import {Transport} from "../Transport";

export class TransportManagerImpl implements TransportManager {
    private readonly transport: Transport;
    private discoveryComponent: DiscoveryComponent;

    constructor(transport: Transport,
                discoveryComponent: DiscoveryComponent =
                    new DHTDiscoveryComponent("", new Map(), (address: string, message: string) => {return Promise.resolve()})) {
        this.transport = transport;
        this.discoveryComponent = discoveryComponent
    }

    /**
     * Add the discovery component.
     * @param discoveryComponent The discovery component.
     */
    addDiscoveryComponent(discoveryComponent: DiscoveryComponent): void {
        this.discoveryComponent = discoveryComponent
    }
    /**
     * Send a message to a peer identified by its address.
     * @param address The address of the peer.
     * @param message The message to send.
     */
    async sendToPeer(address: string, message: string): Promise<void> {
        try {
            const socket: Socket = (await this.transport.dial(address))!;
            socket.write(JSON.stringify(message));
            socket.end();
            //console.log(`[TransportManager] Message sent to ${address}`);
        } catch (error) {
            console.error(`[TransportManager] Failed to send message to ${address}:`, error);
            throw error;
        }
    }

    /**
     * Broadcast a message to all known peers.
     * @param message The message to broadcast.
     */
    async sendToBroadcast(message: string): Promise<void> {
        const addresses: string[] = this.discoveryComponent.getAddresses();
        //console.log(`[TransportManager] Broadcasting message to ${addresses.length} peers.`, addresses);
        if (!addresses.length) {
            console.warn("[TransportManager] No peers available to broadcast the message.");
            return;
        }

        await Promise.all(
            addresses.map(async (address: string): Promise<void> => {
                await this.sendToPeer(address, message);
            })
        );
    }

    /**
     * Send a message to a random subset of peers based on the specified gossip factor.
     * @param message The message to send.
     * @param gossipFactor The number of peers to send the message to.
     */
    async sendToRandomPeers(message: string, gossipFactor: number): Promise<void> {
        const addresses: string[] = this.discoveryComponent.getAddresses();
        if (!addresses.length) {
            console.warn("[TransportManager] No peers available for gossip messaging.");
            return;
        }

        const selectedCount: number = Math.min(gossipFactor, addresses.length);
        const selectedAddresses: string[] = this.selectRandomSubset(addresses, selectedCount);

        await Promise.all(
            selectedAddresses.map(async (address: string): Promise<void> => {
                await this.sendToPeer(address, message);
            })
        );
    }

    /**
     * Listen on the given address and port for incoming messages.
     * @param address The address to listen on.
     * @param port The port to listen on.
     */
    async listen(address: string, port: number): Promise<void> {
        try {
            await this.transport.listen(address, port);
            console.log(`[TransportManager] Listening on ${address}:${port}`);
        } catch (error) {
            console.error(`[TransportManager] Failed to start listening on ${address}:${port}:`, error);
        }
    }

    /**
     * Select a random subset of addresses.
     * @param addresses The list of available addresses.
     * @param count The number of addresses to select.
     * @returns A random subset of addresses.
     */
    private selectRandomSubset(addresses: string[], count: number): string[] {
        const selected: Set<string> = new Set();
        while (selected.size < count) {
            const randomIndex: number = Math.floor(Math.random() * addresses.length);
            selected.add(addresses[randomIndex]);
        }
        return Array.from(selected);
    }
}
