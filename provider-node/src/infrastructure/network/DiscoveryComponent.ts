import { DiscoveryEvent } from '../../domain/events/discovery/DiscoveryEvent.js'

export interface DiscoveryComponent {
    /**
     * Join the network.
     */
    joinNetwork(): Promise<void>

    /**
     * Route an incoming message.
     * @param message the message
     */
    handleDiscoveryEvent(message: DiscoveryEvent): void

    /**
     * Get the known peers addresses.
     * @returns the addresses
     */
    getAddresses(): string[]

    /**
     * Add a mapping from an address to a port.
     * @param address the address
     * @param port the port to map to
     */
    addAddressMapping(address: string, port: number): void

    /**
     * Remove a mapping from an address.
     * @param address the address
     */
    removeAddressMapping(address: string): void
}
