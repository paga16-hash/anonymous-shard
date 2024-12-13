import axios, {AxiosResponse} from 'axios';
import {TaskRepository} from "../../application/repositories/TaskRepository.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Encryptor} from "../encryption/Encryptor.js";

export class IPFSTaskRepository implements TaskRepository {
    private readonly apiKey: string = process.env.PINATA_API_KEY!;
    private readonly apiSecret: string = process.env.PINATA_API_SECRET!;
    private readonly gatewayUrl: string;
    private readonly encryptor: Encryptor;

    constructor(encryptor: Encryptor, gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs') {
        if (!this.apiKey || !this.apiSecret) {
            throw new Error('Pinata API Key and Secret are required!');
        }
        this.encryptor = encryptor;
        this.gatewayUrl = gatewayUrl;
    }

    async retrieve(privateKey: string, cId: string): Promise<TaskResult> {
        try {
            const url: string = `${this.gatewayUrl}/${cId}`;
            console.log(`Retrieving TaskResult from IPFS: ${url}`);
            const response: AxiosResponse<any, any> = await axios.get(url);
            console.log('Retrieved TaskResult:', response.data);
            //TODO VALIDATION LAYER
            const decryptedTaskResult: string = await this.encryptor.decrypt(privateKey, response.data.enc);
            return decryptedTaskResult as unknown as TaskResult;
        } catch (error) {
            console.error('Error retrieving TaskResult from IPFS:', error);
            throw error;
        }
    }
}
