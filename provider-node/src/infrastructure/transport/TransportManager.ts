import {DiscoveryComponent} from "../network/DiscoveryComponent.js";

export interface TransportManager {

    /**
     * Add the discovery component.
     * @param discoveryComponent the discovery component
     */
    addDiscoveryComponent(discoveryComponent: DiscoveryComponent): void;
    /**
     * Send a message to a peer, identified by its onion address.
     * @param address the onion address of the peer
     * @param message the message to send
     */
    sendToPeer(address: string, message: string): Promise<void>;

    /**
     * Send a message to all known peers.
     * @param message the message to send
     */
    sendToBroadcast(message: string): Promise<void>

    /**
     * Send a message to a random subset of known peers.
     * @param message the message to send
     * @param gossipFactor the number of peers to send the message to
     * @returns a promise that resolves when the message has been sent to the peers
     */
    sendToRandomPeers(message: string, gossipFactor: number): Promise<void>

    /**
     * Listen on the given address.
     * @param address the address to listen on
     * @param port the port to listen on
     */
    listen(address: string, port: number): Promise<void>

}