import { SocksProxyAgent } from 'socks-proxy-agent';
import * as tls from 'tls';
import * as net from 'net';
import { Multiaddr } from '@multiformats/multiaddr';
import { Connection } from '@libp2p/interface-connection'; // Libp2p connection interface
import { EventEmitter } from 'events';

/**
 * A custom TLS over SOCKS transport for routing through Tor.
 */
export class TorTransport {
    private torProxyAddress: string;
    private agent: SocksProxyAgent;

    constructor(torProxyAddress = 'socks5h://127.0.0.1:9050') {
        this.torProxyAddress = torProxyAddress;
        this.agent = new SocksProxyAgent(this.torProxyAddress);
    }

    /**
     * Symbol to identify the transport
     */
    get [Symbol.toStringTag]() {
        return 'TorTransport';
    }

    /**
     * Dial a multiaddr over Tor with TLS
     */
    async dial(ma: Multiaddr, options: any): Promise<Connection> {
        const multiaddrStr = ma.toString();
        const { host, port } = this.extractOnionAddress(multiaddrStr);

        return new Promise((resolve, reject) => {
            // Step 1: First connect to the Tor proxy using net.connect
            const socksSocket = net.connect({
                host: '127.0.0.1', // Tor proxy is usually on localhost
                port: 9050,        // Default Tor SOCKS port
            });

            socksSocket.on('connect', () => {
                // Step 2: Use socksSocket to create the TLS connection
                const tlsSocket = tls.connect({
                    host,           // Target .onion address
                    port,           // Target port
                    socket: socksSocket,  // Tunnel the socket through the SOCKS proxy
                    rejectUnauthorized: false, // Skip certificate validation for hidden services
                });

                tlsSocket.on('secureConnect', () => {
                    resolve(this.wrapConnection(tlsSocket));  // Wrap and resolve the connection
                });

                tlsSocket.on('error', (err) => {
                    reject(new Error(`Failed to connect to ${host}:${port} via Tor with TLS: ${err.message}`));
                });
            });

            socksSocket.on('error', (err) => {
                reject(new Error(`Failed to connect to Tor proxy: ${err.message}`));
            });
        });
    }

    /**
     * Create a listener for incoming connections
     */
    createListener(options: any) {
        const emitter = new EventEmitter();
        const server = net.createServer((socket) => {
            const connection = this.wrapConnection(socket);
            emitter.emit('connection', connection);
        });

        return {
            listen: (multiaddrs: Multiaddr[]) => {
                multiaddrs.forEach((ma) => {
                    const { port } = this.extractOnionAddress(ma.toString());
                    server.listen(port, '127.0.0.1', () => {
                        console.log(`Listening on 127.0.0.1:${port} via Tor`);
                    });
                });
            },
            close: () => server.close(),
            getAddrs: () => {
                return []; // Normally you would return your service's .onion address here
            },
            addListener: (event: string, handler: any) => emitter.on(event, handler),
            removeListener: (event: string, handler: any) => emitter.off(event, handler)
        };
    }

    /**
     * Filters multiaddrs for Tor-specific addresses
     */
    listenFilter(addrs: Multiaddr[]) {
        return addrs.filter((ma) => ma.toString().includes('.onion'));
    }

    dialFilter(addrs: Multiaddr[]) {
        return addrs.filter((ma) => ma.toString().includes('.onion'));
    }

    /**
     * Extract hostname and port from a multiaddr
     */
    extractOnionAddress(multiaddrStr: string): { host: string, port: number } {
        const match = multiaddrStr.match(/\/dns4\/([a-zA-Z0-9]+\.onion)\/tcp\/(\d+)/);
        if (!match) {
            throw new Error(`Invalid Tor Multiaddr: ${multiaddrStr}`);
        }
        const host = match[1];
        const port = parseInt(match[2], 10);
        return { host, port };
    }

    /**
     * Wraps a socket in a libp2p connection object
     */
    wrapConnection(socket: net.Socket): Connection {
        return {
            stream: socket, // Native socket for libp2p
            close: () => socket.destroy(),  // Cleanly close the socket
        };
    }

}
