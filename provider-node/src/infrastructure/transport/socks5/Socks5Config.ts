export interface Socks5Config {
    sleepOnError: number;
    ttl?: number;
    noDelay?: boolean;
    onionMap: Map<string, number>;
    socksHost: string;
    socksPort: number;
}