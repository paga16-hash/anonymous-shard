import {config} from 'dotenv'
import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {TaskServiceImpl} from "./application/services/impl/TaskServiceImpl.js";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository.js";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor.js";

config({path: process.cwd() + '/../.env'});

console.log(mapBootstrapAddresses())
const consumerNodeService: NodeService = new NodeServiceImpl(new TaskServiceImpl(new IPFSTaskRepository(new RSAEncryptor())));
