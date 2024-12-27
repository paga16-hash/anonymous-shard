import {mapBootstrapAddresses} from "../../../utils/BootstrapNode.js";
import {DiscoveryComponent} from "../DiscoveryComponent.js";
import {DiscoveryEvent} from "../../../domain/events/discovery/DiscoveryEvent.js";
import {DiscoveryEventFactory} from "../../../domain/factories/events/discovery/DiscoveryEventFactory.js";
import {EventType} from "../../../utils/EventType.js";
import {PeerDiscoveryEvent} from "../../../domain/events/discovery/PeerDiscoveryEvent.js";
import {DiscoveryResponseEvent} from "../../../domain/events/discovery/DiscoveryResponseEvent.js";

export class DHTDiscoveryComponent implements DiscoveryComponent {
    private readonly id: string;
    private readonly bucketSize: number;
    // the key, so the address, is in address:port format
    private knownPeers: Map<string, number>;
    private readonly sender: ((address: string, message: string) => void);

    constructor(id: string, knownPeers: Map<string, number> = new Map(), sender: (address: string, message: string) => void, bucketSize: number = 20) {
        this.id = id;
        this.bucketSize = bucketSize;
        this.knownPeers = knownPeers;
        this.sender = sender;
    }

    /**
     * Get the onion addresses.
     * @returns the onion addresses
     */
    getAddresses(): string[] {
        return Array.from(this.knownPeers.keys());
    }

    /**
     * Add a mapping from an address to a port.
     * @param address the address
     * @param port the port to map to
     */
    addAddressMapping(address: string, port: number): void {
        this.knownPeers.set(address + ':' + port, port);
    }

    /**
     * Remove a mapping from an address.
     * @param address the address
     */
    removeAddressMapping(address: string): void {
        this.knownPeers.delete(address);
    }

    /**
     * Join the network.
     * @returns a promise that resolves when the node has joined the network
     */
    async joinNetwork(): Promise<void> {
        const bootstrapAddresses: string[] = Array.from(mapBootstrapAddresses().keys());
        if (!bootstrapAddresses.length) {
            console.warn(`[${this.id}] No bootstrap addresses available.`);
            return;
        }

        // Pick a random bootstrap address
        const bootstrapAddress: string = bootstrapAddresses[Math.floor(Math.random() * bootstrapAddresses.length)];
        console.log(`Joining network via ${bootstrapAddress}`);

        const message: DiscoveryEvent = DiscoveryEventFactory.discoveryEventFrom(this.id);

        try {
            this.sender(bootstrapAddress, JSON.stringify(message));
        } catch (err) {
            throw new Error(`Failed to send DISCOVER message to ${bootstrapAddress}: ${err}`);
        }
    }

    async handleDiscoveryEvent(discoveryEvent: PeerDiscoveryEvent): Promise<void> {
        switch (discoveryEvent.type) {
            case EventType.DISCOVER:
                await this.respondToDiscover(discoveryEvent.senderId);
                break;
            case EventType.DISCOVER_RESPONSE:
                console.log("peeeeeer",(discoveryEvent as DiscoveryResponseEvent).peers);
                this.updateRoutingTable((discoveryEvent as DiscoveryResponseEvent).peers);
                this.optimizeRoutingTable();
                break;
            default:
                console.log(`Unknown message type: ${discoveryEvent.type}`);
        }
    }

    private async respondToDiscover(senderAddress: string): Promise<void> {
        const peers: string[] = Array.from(this.knownPeers.keys());
        const discoverResponse: DiscoveryResponseEvent = DiscoveryEventFactory.discoveryResponseEventFrom(this.id, peers);

        try {
            this.sender(senderAddress, JSON.stringify(discoverResponse));
            console.log(`Responded to DISCOVER from ${senderAddress}`);
        } catch (err) {
            console.error(`Failed to respond to DISCOVER from ${senderAddress}:`, err);
        }
    }


    private updateRoutingTable(peerAddresses: string[]): void {
        peerAddresses.forEach((peerAddress: string): void => {
            if (!this.knownPeers.has(peerAddress) && peerAddress !== this.id) {
                this.knownPeers.set(peerAddress, parseInt(peerAddress.split(':')[1]));
                console.log(`Discovered new peer: ${peerAddress}`);
            }
        });
    }

    private optimizeRoutingTable(): void {
        if (this.knownPeers.size > this.bucketSize) {
            const sortedPeers: string[] = Array.from(this.knownPeers.keys()).sort((a, b) =>
                this.xorDistance(this.id, a) - this.xorDistance(this.id, b)
            );
            this.knownPeers = new Map(sortedPeers.slice(0, this.bucketSize).map((peer) => [peer, this.knownPeers.get(peer)!]));
        }
    }

    private xorDistance(a: string, b: string): number {
        return parseInt(a, 16) ^ parseInt(b, 16);
    }

}
