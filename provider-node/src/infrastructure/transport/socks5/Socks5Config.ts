export interface Socks5Config {
    sleepOnError: number;
    ttl?: number;
    noDelay?: boolean;
    socksHost: string;
    socksPort: number;
}