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
      addressMap: new Map(),
      ...config
    }
    this.handler = onMessage
    this.listen(process.env.HOST!, parseInt(process.env.PORT!)).catch(console.error)
  }

  /**
   * Get the addresses.
   * @returns the addresses
   */
  getAddresses(): string[] {
    return Array.from(this.config.addressMap.keys())
  }

  /*    /!**
     * Add a mapping from an address to a port.
     * @param address the address
     * @param port the port to map to
     *!/
    addAddressMapping(address: string, port: number): void {
        this.config.addressMap.set(address, port);
    }

    /!**
     * Remove a mapping from an address.
     * @param address the address
     *!/
    removeAddressMapping(address: string): void {
        this.config.addressMap.delete(address);
    }*/

  /**
   * Listen on the given address.
   * @example await transport.listen(multiaddr('your-address'))
   * @param address the address to listen on
   * @param port the port to listen on
   */
  async listen(address: string, port: number): Promise<void> {
    //console.log("Trying to listen: ", address, "on port", port);

    const server: Server = createServer((socket: Socket): void => {
      /*console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
            socket.on('connect', (): void => {
                console.log('Connection established with', socket.remoteAddress);
            });
*/
      socket.on('data', (data: Buffer): void => {
        //TODO presentation layer this.handler(presentationLayer.parseEvent(data));
        this.handler(JSON.parse(data.toString()) as unknown as DomainEvent)
      })

      /*socket.on('end', (): void => {
                console.log('Connection ended with ', socket.remoteAddress);
            });*/
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
      //console.log(`Attempt ${attempt}: Trying to dial ${address} directly...`);

      try {
        //const port: number = this.config.addressMap.get(address) || 80;
        const socket: Socket = new Socket()
        socket.connect(port, address)
        return new Promise((resolve, reject): void => {
          socket.once('connect', (): void => {
            //console.log('Connected to target.');
            resolve(socket)
          })

          socket.once('error', (err: Error): void => {
            socket.destroy()
            reject(err)
          })
        })
      } catch (err) {
        //console.error(`Attempt ${attempt} failed`);//: , err
        if (attempt < maxRetries) {
          //console.log(`Retrying in ${this.config.sleepOnError / 1000} seconds...`);
          await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, this.config.sleepOnError))
        } else {
          console.error('Max retries reached. Unable to connect.')
        }
      }
    }
  }
}
