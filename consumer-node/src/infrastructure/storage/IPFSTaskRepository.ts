import axios, {AxiosResponse} from 'axios';
import {TaskRepository} from "../../application/repositories/TaskRepository.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Encryptor} from "../encryption/Encryptor.js";

export class IPFSTaskRepository implements TaskRepository {
    private readonly gatewayUrl: string;
    private readonly encryptor: Encryptor;

    constructor(encryptor: Encryptor, gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs') {
        this.encryptor = encryptor;
        this.gatewayUrl = gatewayUrl;
    }

    async retrieve(privateKey: string, cId: string): Promise<TaskResult> {
        try {
            const url: string = `${this.gatewayUrl}/${cId}`;
            console.log(`Retrieving TaskResult from IPFS: ${url}`);
            const response: AxiosResponse<any, any> = await axios.get(url);
            //TODO VALIDATION LAYER
            const decryptedTaskResult: string = await this.encryptor.decrypt(privateKey, response.data.enc);
            return decryptedTaskResult as unknown as TaskResult;
        } catch (error) {
            console.error('Error retrieving TaskResult from IPFS:', error);
            throw error;
        }
    }
}
