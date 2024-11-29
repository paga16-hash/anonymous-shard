/*
export interface Transport<DialEvents extends ProgressEvent = ProgressEvent> {
    /!**
     * Used to identify the transport
     *!/
    [Symbol.toStringTag]: string

    /!**
     * Used by the isTransport function
     *!/
    [transportSymbol]: true

    /!**
     * Dial a given multiaddr.
     *!/
    dial(ma: Multiaddr, options: DialTransportOptions<DialEvents>): Promise<Connection>

    /!**
     * Create transport listeners.
     *!/
    createListener(options: CreateListenerOptions): Listener

    /!**
     * Takes a list of `Multiaddr`s and returns only addresses that are valid for
     * the transport to listen on
     *!/
    listenFilter: MultiaddrFilter

    /!**
     * Takes a list of `Multiaddr`s and returns only addresses that are vali for
     * the transport to dial
     *!/
    dialFilter: MultiaddrFilter
}
*/

export class TorTransportTest implements Transport {
    private torProxyAddress: string;
    private agent: SocksProxyAgent;

    constructor(torProxyAddress = "socks5h://"){}


}