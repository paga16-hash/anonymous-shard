export interface SocketConfig {
  sleepOnError: number
  ttl?: number
  noDelay?: boolean
  addressMap: Map<string, number>
}
