import { createServer, Server, Socket } from 'net'
import { SocketConfig } from './SocketConfig.js'
import { Transport } from '../Transport.js'
import { DomainEvent } from '../../../domain/events/DomainEvent.js'

/**
 * Socket transport, without any proxy.
 */
export class SocketTransport implements Transport {
    private readonly config: SocketConfig
    private readonly handler: (message: DomainEvent) => void

    constructor(config: Partial<SocketConfig> = {}, onMessage: (message: DomainEvent) => void) {
        this.config = {
            sleepOnError: 5000,
            ...config
        }
        this.handler = onMessage
        this.listen(process.env.HOST!, parseInt(process.env.PORT!)).catch(console.error)
    }

    /**
     * Listen on the given address.
     * @example await transport.listen(multiaddr('your-address'))
     * @param address the address to listen on
     * @param port the port to listen on
     */
    async listen(address: string, port: number): Promise<void> {
        const server: Server = createServer((socket: Socket): void => {
            let buffer: Buffer = Buffer.alloc(0)

            socket.on('data', (chunk: Buffer): void => {
                buffer = Buffer.concat([buffer, chunk])

                // Assume length-prefix protocol, same for the sender
                while (buffer.length >= 4) {
                    const messageLength: number = buffer.readUInt32BE(0)

                    if (buffer.length >= 4 + messageLength) {
                        const rawMessage: string = buffer.subarray(4, 4 + messageLength).toString()
                        buffer = buffer.subarray(4 + messageLength)
                        try {
                            const message = JSON.parse(rawMessage)
                            this.handler(message as unknown as DomainEvent)
                            //TODO: add presentation layer for validation
                        } catch (error) {
                            console.error('Error parsing event:', error)
                        }
                    } else {
                        break // Wait for next chunk(s)
                    }
                }
            })

            /*example: socket.on('end',callback);*/
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
                const socket: Socket = new Socket()
                socket.connect(port, address)
                return new Promise((resolve, reject): void => {
                    socket.once('connect', (): void => {
                        resolve(socket)
                    })

                    socket.once('error', (err: Error): void => {
                        socket.destroy()
                        reject(err)
                    })
                })
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
