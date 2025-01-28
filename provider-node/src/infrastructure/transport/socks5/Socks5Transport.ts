import {createServer, Server, Socket} from 'net'
import {Socks5Config} from './Socks5Config.js'
import {SocksClient} from 'socks'
import {Transport} from '../Transport.js'
import {DomainEvent} from '../../../domain/events/DomainEvent.js'

export class Socks5Transport implements Transport {
    private readonly config: Socks5Config
    private readonly DEFAULT_SOCKS_HOST: string = '127.0.0.1'
    private readonly DEFAULT_SOCKS_PORT: number = 9050
    private readonly handler: (message: DomainEvent) => void

    constructor(config: Partial<Socks5Config> = {}, onMessage: (message: DomainEvent) => void) {
        this.config = {
            sleepOnError: 5000,
            socksHost: this.DEFAULT_SOCKS_HOST,
            socksPort: this.DEFAULT_SOCKS_PORT,
            ...config
        }
        this.handler = onMessage
        this.listen(process.env.HOST!, parseInt(process.env.PORT!)).catch(console.error)
    }

    /**
     * Listen on the given address.
     * @example await transport.listen(multiaddr('your-onion-address'))
     * @param address the address to listen on
     * @param port the port to listen on
     */
    async listen(address: string, port: number): Promise<void> {
        const server: Server = createServer((socket: Socket): void => {
            // Here you can add every default event that you want to the socket, like 'connect', 'end', etc..
            socket.on('data', (data: Buffer): void => {
                try {
                    this.handler(JSON.parse(data.toString()) as unknown as DomainEvent)
                    //TODO this.handler(presentationLayer.parseEvent(data));
                } catch (error) {
                    console.error('Error parsing message')
                }
            })
        })

        server.listen(port, (): void => {
            console.log(`Listening on ${address}:${port}`)
        })
    }

    /**
     * Dial the given address with retries.
     * @param address The address to dial.
     * @param maxRetries Maximum number of retry attempts.
     */
    // @ts-expect-error to fix the return type
    async dial(address: string, maxRetries: number = 5): Promise<Socket> {
        let port: number
        const [addressPart, portPart] = address.split(':')
        if (portPart) {
            address = addressPart
            port = parseInt(portPart)
        } else {
            port = 80
        }
        let attempt: number = 0

        while (attempt < maxRetries) {
            attempt++
            try {
                return (
                    await SocksClient.createConnection({
                        proxy: {
                            host: this.config.socksHost,
                            port: this.config.socksPort,
                            type: 5
                        },
                        command: 'connect',
                        destination: {
                            host: `${address}.onion`,
                            port: port
                        }
                    })
                ).socket
            } catch (err) {
                if (attempt < maxRetries) {
                    await new Promise(
                        (resolve): NodeJS.Timeout => setTimeout(resolve, this.config.sleepOnError)
                    )
                } else {
                    console.error('Max retries reached. Unable to connect.')
                }
            }
        }
    }
}
