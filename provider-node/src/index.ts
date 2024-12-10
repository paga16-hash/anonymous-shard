import {config} from 'dotenv'
/*import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";

console.log(mapBootstrapAddresses())
const nodeService: NodeService = new NodeServiceImpl(new MetricServiceImpl());*/
config({path: process.cwd() + '/../.env'})
import axios from 'axios';

const apiKey = process.env.PINATA_API_KEY
const apiSecret = process.env.PINATA_API_SECRET

// Function to upload JSON data to Pinata
async function uploadJSONToPinata(jsonData: any) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    console.log('Uploading JSON to Pinata...');
    const response = await axios.post(url, jsonData, {
        headers: {
            'Content-Type': 'application/json',
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
        },
    });

    const cid = response.data.IpfsHash;
    console.log(`JSON uploaded successfully! CID: ${cid}`);
    return cid;
}

// Function to retrieve JSON data from IPFS
async function retrieveJSONFromIPFS(cid: string) {
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    console.log(`Retrieving JSON from IPFS: ${gatewayUrl}`);

    const response = await axios.get(gatewayUrl);
    console.log('Retrieved JSON:', response.data);
    return response.data;
}

// Example usage
(async () => {
    const jsonData = {
        taskId: '12345',
        result: {
            success: true,
            output: 'This is the result of the task.',
        },
        timestamp: new Date().toISOString(),
    };

    try {
        const cid = await uploadJSONToPinata(jsonData);
        const retrievedData = await retrieveJSONFromIPFS(cid);
        console.log('Retrieved Data:', retrievedData);
    } catch (error) {
        console.error('Error:', error);
    }
})();
