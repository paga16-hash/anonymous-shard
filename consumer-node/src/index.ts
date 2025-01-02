import type { Express, NextFunction, Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import http, { Server as HttpServer } from 'http'
import {tasksRouter} from "./infrastructure/api/routes/tasksRouter.js";
import {TaskService} from "./application/services/TaskService.js";
import {config} from 'dotenv'
import {mapBootstrapAddresses} from "./utils/BootstrapNode.js";
import {NodeService} from "./application/services/NodeService.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {TaskServiceImpl} from "./application/services/impl/TaskServiceImpl.js";
import {IPFSTaskRepository} from "./infrastructure/storage/IPFSTaskRepository.js";
import {RSAEncryptor} from "./infrastructure/encryption/impl/RSAEncryptor.js";
import HttpStatusCode from "./utils/HttpStatusCode.js";

config({path: process.cwd() + '/../.env'});

console.log(mapBootstrapAddresses())
export const consumerNodeService: NodeService = new NodeServiceImpl(new TaskServiceImpl(new IPFSTaskRepository(new RSAEncryptor())));

export const app: Express = express()
app.use(express.json())
app.use(cors())

const PORT: number = Number(process.env.PORT) + 1000

const server: HttpServer = http.createServer(app)

app.use((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = (authHeader && authHeader.split(' ')[1]) || ''

    if (token === process.env.DEV_API_KEY) return next()
    else {res.status(HttpStatusCode.FORBIDDEN).send({ error: 'No authentication token' })}
})
app.use('/tasks', tasksRouter)

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, async (): Promise<void> => {
        console.log(`APIs server listening on port ${PORT}`)
    })
}
