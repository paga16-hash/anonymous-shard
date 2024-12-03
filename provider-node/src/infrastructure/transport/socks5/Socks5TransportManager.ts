import {Socket} from "net";
import {Socks5Transport} from "./Socks5Transport.js";
import {TransportManager} from "../TransportManager.js";

export class Socks5TransportManager implements TransportManager {
    private readonly transport: Socks5Transport;

    constructor(transport: Socks5Transport) {
        this.transport = transport;
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
        for (const address of this.transport.getOnionAddresses()) {
            await this.sendToPeer(address, message);
        }
    }

    /**
     * Listen on the given address.
     * @param address the address to listen on
     */
    async listen(address: string): Promise<void> {
        await this.transport.listen(address);
    }
}