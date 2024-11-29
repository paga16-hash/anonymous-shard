import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { ping } from "@libp2p/ping";
import { SocksProxyAgent } from "socks-proxy-agent";

const torProxy = process.env.TOR_PROXY; // e.g., socks5h://tor1:9050
const onionAddress = process.env.ONION_ADDRESS; // e.g., another node's .onion address

async function main() {
    // Create libp2p node
    const libp2p = await createLibp2p({
        addresses: {
            listen: ["/ip4/127.0.0.1/tcp/3000"],
        },
        transports: [
            tcp()
        ],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        services: {
            ping: ping(),
        },
    });

    await libp2p.start();
    console.log("Libp2p node started. Peer ID:", libp2p.peerId.toString());

    if (onionAddress) {
        console.log("Dialing remote peer:", onionAddress);
        try {
            const connection = await libp2p.dial(onionAddress);
            console.log("Connected to peer:", connection.remotePeer.toString());
        } catch (err) {
            console.error("Failed to connect to peer:", err);
        }
    }

    libp2p.addEventListener("peer:connect", (evt) => {
        console.log("Connected to:", evt.detail.remotePeer.toString());
    });
}

main().catch(console.error);
