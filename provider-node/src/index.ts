import {config} from 'dotenv'
import {Socks5Transport} from "./infrastructure/transport/socks5/Socks5Transport.js";
import {TransportManager} from "./infrastructure/transport/TransportManager.js";
import {Socks5TransportManager} from "./infrastructure/transport/socks5/Socks5TransportManager.js";

config({path: process.cwd() + '/../.env'})

//const nodeService: NodeService = new NodeServiceImpl("127.0.0.1", new MetricServiceImpl());
//const bootstrapNodes = bootstrapAddresses().map((address:string) => [address, 3000])

await (async () => {
    const transportManager: TransportManager = new Socks5TransportManager(
        new Socks5Transport({
                onionMap: new Map([
                    ["a7oxxul76cei44utvngfg2tnhqmedkjlwiiudbaqzer5z5w75gpgyeqd", 3000],
                    ["eww4sjfxwj6vgucebupol2nk7yhbvhjzxo2v4t46f42gukn3btknzvid", 3000]
                ])
            },
            (message: string): void => {
                console.log(message)
            })
    );

    // for testing the other node address
    let addressToContact = process.env.ONION_ADDRESS!;
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
