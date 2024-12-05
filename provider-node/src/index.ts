import {config} from 'dotenv'
import {Socks5Transport} from "./infrastructure/transport/socks5/Socks5Transport.js";
import {TransportManager} from "./infrastructure/transport/TransportManager.js";
import {Socks5TransportManager} from "./infrastructure/transport/socks5/Socks5TransportManager.js";
import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";

config({path: process.cwd() + '/../.env'})

console.log(mapBootstrapAddresses())

//const nodeService: NodeService = new NodeServiceImpl("127.0.0.1", new MetricServiceImpl());
await (async (): Promise<void> => {
    const transportManager: TransportManager = new Socks5TransportManager(
        new Socks5Transport({
                onionMap: mapBootstrapAddresses(),
            },
            (message: string): void => {
                console.log("Handler onMessage: " + message)
            })
    );

    // for testing the other node address
    let addressToContact: string = process.env.ONION_ADDRESS!;
    try {
        await transportManager.listen(addressToContact);
    } catch (err) {
        console.error('Failed to listen:', err);
    }

    try {
        setInterval(async (): Promise<void> => {
            await transportManager.sendToPeer(addressToContact, "Hello from provider-node");
        }, 10000);
    } catch (err) {
        console.error('Failed to contact peer:', addressToContact, " with error:", err);
    }
})();
