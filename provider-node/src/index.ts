import {config} from 'dotenv'
import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";

config({path: process.cwd() + '/../.env'})

console.log(mapBootstrapAddresses())

const nodeService: NodeService = new NodeServiceImpl(new MetricServiceImpl());
/*await (async (): Promise<void> => {
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
})();*/
