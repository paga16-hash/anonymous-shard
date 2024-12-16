import axios, {AxiosResponse} from 'axios';
import {TaskRepository} from "../../application/repositories/TaskRepository.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Encryptor} from "../encryption/Encryptor.js";

export class IPFSTaskRepository implements TaskRepository {
    private readonly apiKey: string = process.env.PINATA_API_KEY!;
    private readonly apiSecret: string = process.env.PINATA_API_SECRET!;
    private readonly pinataUrl: string = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    private readonly gatewayUrl: string;
    private readonly encryptor: Encryptor;

    constructor(encryptor: Encryptor, gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs') {
        if (!this.apiKey || !this.apiSecret) {
            throw new Error('Pinata API Key and Secret are required!');
        }
        this.encryptor = encryptor;
        this.gatewayUrl = gatewayUrl;
    }

    async upload(publicKey: string, taskResult: TaskResult): Promise<string> {
        try {
            const encryptedTaskResult: string = await this.encryptor.encrypt(publicKey, taskResult);
            console.log(`Uploading TaskResult of #${taskResult.taskId.value} to IPFS via Pinata...`);
            const res: AxiosResponse<any, any> = await axios.post(this.pinataUrl, {enc: encryptedTaskResult}, {
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: this.apiKey,
                    pinata_secret_api_key: this.apiSecret,
                },
            });

            const cid = res.data.IpfsHash;
            console.log(`TaskResult of #${taskResult.taskId.value} uploaded successfully! CID: ${cid}`);
            return cid;
        } catch (error) {
            console.error('Error uploading TaskResult to IPFS:', error);
            throw error;
        }
    }

    async retrieve(privateKey: string, cId: string): Promise<TaskResult> {
        try {
            const url: string = `${this.gatewayUrl}/${cId}`;
            console.log(`Retrieving TaskResult from IPFS: ${url}`);
            const response: AxiosResponse<any, any> = await axios.get(url);

            console.log('Retrieved TaskResult:', response.data);
            //TODO VALIDATION LAYER
            //const decryptedTaskResult: string = await this.encryptor.decrypt(privateKey, response.data.enc);
            return response.data.enc as unknown as TaskResult;
        } catch (error) {
            console.error('Error retrieving TaskResult from IPFS:', error);
            throw error;
        }
    }
}
