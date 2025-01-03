export interface Socks5Config {
  sleepOnError: number
  ttl?: number
  noDelay?: boolean
  addressMap: Map<string, number>
  socksHost: string
  socksPort: number
}
