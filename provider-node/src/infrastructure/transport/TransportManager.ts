export interface TransportManager {
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
     * Listen on the given address.
     * @param address the address to listen on
     */
    listen(address: string): Promise<void>
}