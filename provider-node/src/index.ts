import {config} from 'dotenv'
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";
import {TaskServiceImpl} from "./application/services/impl/TaskServiceImpl.js";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository.js";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor.js";
import {SumTaskExecutor} from "./application/executors/impl/SumTaskExecutor.js";
import {TaskType} from "./domain/core/task/enum/TaskType.js";

config({path: process.cwd() + '/../.env'});

//console.log(mapBootstrapAddresses())
const providerNodeService: NodeService =
    new NodeServiceImpl(
        new MetricServiceImpl(), new TaskServiceImpl(
            new IPFSTaskRepository(new RSAEncryptor()), new Map([[TaskType.SUM, new SumTaskExecutor()]]
            )
        )
    )