import {createServer} from 'net'; // Native TCP server
import { SocksClient } from 'socks';
import { EventEmitter } from 'events';
import { multiaddr } from '@multiformats/multiaddr';

export function torTransport(socksProxy) {
    return () => ({
        [Symbol.toStringTag]: 'TorTransport',
        [Symbol.for('@libp2p/transport')]: true,

        // Dial a given multiaddr using the SOCKS proxy
        async dial(ma, options) {
            const { host, port } = ma.toOptions();
            const proxyOptions = {
                proxy: {
                    ipaddress: socksProxy.host,
                    port: socksProxy.port,
                    type: 5 // SOCKS5
                },
                command: 'connect',
                destination: {
                    host,
                    port
                }
            };

            return new Promise((resolve, reject) => {
                SocksClient.createConnection(proxyOptions)
                    .then((info) => {
                        resolve(info.socket); // Use the socket to communicate
                    })
                    .catch(reject);
            });
        },

        // Create a server to listen on the local .onion address
        /*createListener(options) {
            const server = createServer(socket => {
                options.handler(socket);
            });
            server.address()

            return {
                listen(ma) {
                    const { port } = ma.toOptions();
                    server.listen(port, () => {
                        console.log(`TorTransport listening on port ${port}`);
                    });
                },
                close() {
                    server.close();
                },
                getAddrs() {
                    return [multiaddr(`/ip4/127.0.0.1/tcp/${server.address().port}`)];
                }
            };
        }*/
        createListener(options) {
            const server = createServer(socket => {
                options.handler(socket);
            });

            // Extend EventEmitter to emit libp2p events
            const listener = new EventEmitter();

            server.on('listening', () => {
                listener.emit('listening');
            });

            server.on('connection', (socket) => {
                listener.emit('connection', socket);
            });

            server.on('error', (err) => {
                listener.emit('error', err);
            });

            server.on('close', () => {
                listener.emit('close');
            });

            listener.listen = (ma) => {
                const { port } = ma.toOptions();
                server.listen(port, () => {
                    console.log(`TorTransport listening on port ${port}`);
                });
            };

            listener.close = () => {
                server.close();
            };

            listener.getAddrs = () => {
                const addr = server.address();
                return [multiaddr(`/ip4/127.0.0.1/tcp/${addr.port}`)];
            };

            return listener;
        },

        // Filter multiaddrs for dialing
        dialFilter(multiaddrs) {
            return multiaddrs.filter((ma) => ma.protoNames().includes('onion'));
        },

        // Filter multiaddrs for listening
        listenFilter(multiaddrs) {
            return multiaddrs.filter((ma) => ma.protoNames().includes('tcp'));
        }
    });
}
