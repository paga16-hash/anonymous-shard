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
import type {Express, NextFunction, Request, Response} from 'express'
import express from 'express'
import cors from 'cors'
import http, {Server as HttpServer} from 'http'
import {peersRouter} from "./infrastructure/api/routes/peersRouter.js";
import HttpStatusCode from "./utils/HttpStatusCode.js";


config({path: process.cwd() + '/../.env'});

//console.log(mapBootstrapAddresses())
const metricService: MetricServiceImpl = new MetricServiceImpl()
const taskEvaluator: TaskEvaluator = new MetricBasedTaskEvaluator(metricService.getCurrentMetric.bind(metricService), metricService.getKnownMetrics.bind(metricService))
const ipfsTaskRepository: IPFSTaskRepository = new IPFSTaskRepository(new RSAEncryptor())
const taskService: TaskServiceImpl = new TaskServiceImpl(ipfsTaskRepository, taskEvaluator, new Map([[TaskType.SUM, new SumTaskExecutor()]]))

export const providerNodeService: NodeService = new NodeServiceImpl(metricService, taskService)

export const app: Express = express()
app.use(express.json())
app.use(cors())

const PORT: number = Number(process.env.PORT) + 1000

const server: HttpServer = http.createServer(app)

app.use((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = (authHeader && authHeader.split(' ')[1]) || ''

    if (token === process.env.DEV_API_KEY) return next()
    else {
        res.status(HttpStatusCode.FORBIDDEN).send({error: 'No authentication token'})
    }
})
app.use('/peers', peersRouter)

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, async (): Promise<void> => {
        console.log(`APIs server listening on port ${PORT}`)
    })
}

