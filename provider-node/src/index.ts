import {config} from 'dotenv'
import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";
import {TaskServiceImpl} from "./application/services/impl/TaskServiceImpl";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor";

config({path: process.cwd() + '/../.env'});

console.log(mapBootstrapAddresses())
const nodeService: NodeService = new NodeServiceImpl(new MetricServiceImpl(), new TaskServiceImpl(new IPFSTaskRepository(new RSAEncryptor())));

/*
import {config} from 'dotenv'
import {SumTaskFactory} from "./domain/factories/task/SumTaskFactory.js";
import {ClientIdFactory} from "./domain/factories/task/ClientIdFactory.js";
import {TaskIdFactory} from "./domain/factories/task/TaskIdFactory.js";
import {TaskType} from "./domain/core/task/enum/TaskType.js";
import {SumTaskExecutor} from "./application/executors/impl/SumTaskExecutor.js";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository.js";
import * as crypto from 'crypto';
import {Encryptor} from "./infrastructure/encryption/Encryptor.js";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor.js";

config({path: process.cwd() + '/../.env'});

function generateRSAKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // Key size for strong encryption
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return { publicKey, privateKey };
}

const { publicKey, privateKey } = generateRSAKeyPair();

console.log("Generated Public Key:");
console.log(publicKey);

console.log("Generated Private Key:");
console.log(privateKey);


(async () => {
    const task = SumTaskFactory.taskFrom(TaskIdFactory.newId(TaskType.SUM), ClientIdFactory.idFrom("value", "publicKey"), [1, 2, 3, 4, 5]);

    console.log("Current Sum Task:");
    console.log(task);

    const sumTaskExecutor: SumTaskExecutor = new SumTaskExecutor();
    const taskResult = sumTaskExecutor.execute(task)

    console.log("Task Result:");
    console.log(taskResult)

    const encryptor: Encryptor = new RSAEncryptor();
    const taskRepository: IPFSTaskRepository = new IPFSTaskRepository(encryptor);
    const cid = await taskRepository.upload(publicKey, taskResult);
    console.log('CID:', cid);

    // Retrieve and decrypt the TaskResult
    const retrievedTaskResult = await taskRepository.retrieve(privateKey, cid);

    console.log('Retrieved Task Result:', retrievedTaskResult);
})();*/
