import axios, {AxiosResponse} from 'axios';
import {TaskRepository} from "../../application/repositories/TaskRepository.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";

export class IPFSTaskRepository implements TaskRepository {
    private readonly apiKey: string = process.env.PINATA_API_KEY!;
    private readonly apiSecret: string = process.env.PINATA_API_SECRET!;
    private readonly pinataUrl: string = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    private readonly gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs';

    async upload(taskResult: TaskResult): Promise<string> {
        try {
            console.log('Uploading TaskResult of #' + taskResult.taskId.value + ' to IPFS via Pinata...');
            const res = await axios.post(this.pinataUrl, taskResult, {
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: this.apiKey,
                    pinata_secret_api_key: this.apiSecret,
                },
            });

            const cid = res.data.IpfsHash;
            console.log(`TaskResult uploaded successfully! CID: ${cid}`);
            return cid;
        } catch (error) {
            console.error('Error uploading TaskResult to IPFS:', error);
            throw error;
        }
    }

    // Method to retrieve a TaskResult from IPFS by CID
    async retrieve(cId: string): Promise<TaskResult> {
        try {
            const url: string = `${this.gatewayUrl}/${cId}`;

            console.log(`Retrieving TaskResult from IPFS: ${url}`);
            const response: AxiosResponse<any, any> = await axios.get(url);

            console.log('Retrieved TaskResult:', response.data);
            return response.data as TaskResult;
        } catch (error) {
            console.error('Error retrieving TaskResult from IPFS:', error);
            throw error;
        }
    }

    // TODO Implement delete (unpin in this case) method
    // Method to delete a TaskResult (not supported in IPFS, so no-op or placeholder)
    /*    delete(taskId: TaskId): void {
            console.warn('Delete operation is not supported in IPFS. TaskId:', taskId.value);
        }*/
}
