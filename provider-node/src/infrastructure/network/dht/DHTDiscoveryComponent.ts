import {mapBootstrapAddresses} from "../../../utils/BootstrapNode.js";
import {DiscoveryComponent} from "../DiscoveryComponent.js";
import {DiscoveryEvent} from "../../../domain/events/discovery/DiscoveryEvent.js";
import {DiscoveryEventFactory} from "../../../domain/factories/events/discovery/DiscoveryEventFactory.js";
import {EventType} from "../../../utils/EventType.js";
import {PeerDiscoveryEvent} from "../../../domain/events/discovery/PeerDiscoveryEvent.js";
import {DiscoveryResponseEvent} from "../../../domain/events/discovery/DiscoveryResponseEvent.js";
import {PingEvent} from "../../../domain/events/discovery/PingEvent.js";

export class DHTDiscoveryComponent implements DiscoveryComponent {
    private readonly id: string;
    private readonly bucketSize: number;
    private readonly buckets: Map<number, Map<string, number>>;
    private readonly gossipInterval: number;
    private readonly pingInterval: number;
    private readonly sender: (address: string, message: string) => Promise<void>;
    private readonly COLD_START_INTERVAL: number = 5000;

    constructor(id: string, bootstrapNodes: Map<string, number>, sender: (address: string, message: string) => Promise<void>, bucketSize: number = 20, gossipInterval: number = 5000, pingInterval: number = 30000) {
        this.id = id;
        this.bucketSize = bucketSize;
        this.buckets = new Map();
        this.sender = sender;
        this.gossipInterval = gossipInterval;
        this.pingInterval = pingInterval;

        for (const [address, port] of bootstrapNodes) {
            this.addAddressMapping(address, port);
        }

        this.startGossip();
        this.startPing();
    }

    /**
     * Get the addresses from all buckets.
     * @returns the addresses
     */
    getAddresses(): string[] {
        return Array.from(this.buckets.values()).flatMap((bucket) => Array.from(bucket.keys()));
    }

    /**
     * Add a mapping from an address to a port.
     * @param address the address
     * @param port the port to map to
     */
    addAddressMapping(address: string, port: number): void {
        console.log(`Adding peer: ${address}:${port} to routing table`);
        if (address === this.id) {
            return;
        }
        const distance = this.xorDistance(this.id, address);
        const bucketIndex = Math.floor(Math.log2(distance)) || 0;

        if (!this.buckets.has(bucketIndex)) {
            this.buckets.set(bucketIndex, new Map());
        }

        const bucket = this.buckets.get(bucketIndex)!;
        if (bucket.size >= this.bucketSize) {
            console.warn(`Bucket ${bucketIndex} is full. Address ${address} not added.`);
            return;
        }

        bucket.set(address, port);
        console.log(`Added peer: ${address} to bucket ${bucketIndex}`);
        console.log("KNOWN PEERS:", this.getAddresses())
    }

    /**
     * Remove a mapping from an address.
     * @param address the address
     */
    removeAddressMapping(address: string): void {
        const distance = this.xorDistance(this.id, address);
        const bucketIndex = Math.floor(Math.log2(distance)) || 0;

        if (this.buckets.has(bucketIndex)) {
            const bucket = this.buckets.get(bucketIndex)!;
            if (bucket.delete(address)) {
                console.log(`Removed peer: ${address} from bucket ${bucketIndex}`);
                console.log("KNOWN PEERS:", this.getAddresses())
            } else {
                console.warn(`Address ${address} not found in bucket ${bucketIndex}`);
            }
        } else {
            console.warn(`No bucket found for address ${address}`);
        }
    }

    /**
     * Join the network.
     */
    async joinNetwork(): Promise<void> {
        const bootstrapAddresses: string[] = Array.from(mapBootstrapAddresses().keys());
        if (!bootstrapAddresses.length) {
            console.warn(`[${this.id}] No bootstrap addresses available.`);
            return;
        }

        const bootstrapAddress = bootstrapAddresses[Math.floor(Math.random() * bootstrapAddresses.length)];
        console.log(`Joining network via ${bootstrapAddress}`);

        const message: DiscoveryEvent = DiscoveryEventFactory.discoveryEventFrom(this.id);

        this.sender(bootstrapAddress, JSON.stringify(message)).catch((): void => {
            console.error(`Failed to send DISCOVER message to ${bootstrapAddress}`);
            setTimeout((): void => {
                this.joinNetwork();
            }, this.COLD_START_INTERVAL);
        })
    }

    async handleDiscoveryEvent(discoveryEvent: PeerDiscoveryEvent): Promise<void> {
        switch (discoveryEvent.type) {
            case EventType.DISCOVER:
                await this.respondToDiscover(discoveryEvent.senderId);
                break;
            case EventType.DISCOVER_RESPONSE:
                this.updateRoutingTable((discoveryEvent as DiscoveryResponseEvent).peers);
                break;
            case EventType.PING:
                console.log("Ping discarded from", discoveryEvent.senderId);
                break;
            default:
                console.log(`Unknown message type: ${discoveryEvent.type}`);
        }
    }

    private async respondToDiscover(senderAddress: string): Promise<void> {
        this.updateRoutingTable([senderAddress]);
        const peers: string[] = this.getAddresses().concat(this.id);
        const discoverResponse: DiscoveryResponseEvent = DiscoveryEventFactory.discoveryResponseEventFrom(this.id, peers);

        try {
            this.sender(senderAddress, JSON.stringify(discoverResponse)).catch((): void => {
                console.error(`Failed to respond to DISCOVER from ${senderAddress}:`);
            })
        } catch (err) {

        }
    }

    private updateRoutingTable(peerAddresses: string[]): void {
        peerAddresses.forEach((address: string): void => {
            if (address !== this.id) {
                this.sender(address, JSON.stringify(DiscoveryEventFactory.pingEventFrom(this.id)))
                    .then((): void => {
                        this.addAddressMapping(address, parseInt(address.split(":")[1]));
                    })
                    .catch((): void => {
                        this.removeAddressMapping(address);
                    })
            }
        });
    }

    /**
     * Start periodic gossiping.
     */
    private startGossip(): void {
        setInterval((): void => {
            const peers: string[] = this.getAddresses();
            const gossipEvent: DiscoveryResponseEvent = DiscoveryEventFactory.gossipEventFrom(this.id, peers);

            peers.forEach((address: string): void => {
                this.sender(address, JSON.stringify(gossipEvent)).catch(() => {
                    console.error(`Failed to send GOSSIP message to ${address}:`);
                })
            });
        }, this.gossipInterval);
    }

    /**
     * Start periodic pings to verify peer availability.
     */
    private startPing(): void {
        setInterval((): void => {
            const peers: string[] = this.getAddresses();

            peers.forEach((peer: string): void => {
                const pingMessage: PingEvent = DiscoveryEventFactory.pingEventFrom(this.id);
                this.sender(peer, JSON.stringify(pingMessage)).catch(() => {
                    console.error(`Failed to send PING to ${peer}, removing from routing table.`);
                    this.removeAddressMapping(peer);
                })
            });
        }, this.pingInterval);
    }

    private xorDistance(a: string, b: string): number {
        return parseInt(a, 16) ^ parseInt(b, 16);
    }
}
