import {config} from 'dotenv'
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";
import {TaskServiceImpl} from "./application/services/impl/TaskServiceImpl.js";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository.js";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor.js";
import {SumTaskExecutor} from "./application/executors/impl/SumTaskExecutor.js";
import {TaskType} from "./domain/core/task/enum/TaskType.js";
import {TaskEvaluator} from "./application/evaluator/TaskEvaluator.js";
import {MetricBasedTaskEvaluator} from "./application/evaluator/impl/MetricBasedTaskEvaluator.js";

config({path: process.cwd() + '/../.env'});

//console.log(mapBootstrapAddresses())
const metricService: MetricServiceImpl = new MetricServiceImpl()
const taskEvaluator: TaskEvaluator = new MetricBasedTaskEvaluator(metricService.getCurrentMetric.bind(metricService), metricService.getKnownMetrics.bind(metricService))
const ipfsTaskRepository: IPFSTaskRepository = new IPFSTaskRepository(new RSAEncryptor())
const taskService: TaskServiceImpl = new TaskServiceImpl(ipfsTaskRepository, taskEvaluator, new Map([[TaskType.SUM, new SumTaskExecutor()]]))

const providerNodeService: NodeService = new NodeServiceImpl(metricService, taskService)
