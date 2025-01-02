import express, { Request, Response, Router } from 'express'
import {taskController as controller} from "../controllers/tasksController.js";
import HttpStatusCode from "../../../utils/HttpStatusCode.js";
import {Task} from "../../../domain/core/task/Task.js";

export const tasksRouter: Router = express.Router()
//TODO: also here, add presentation layer

tasksRouter.route('/').get((req: Request, res: Response): void => {
    controller
        .getTasks()
        .then((tasks: Map<string, Task>): void => {
            res.status(HttpStatusCode.OK).send(tasks)
        })
        .catch((): void => {
            res.send({ error: 'No tasks found' })
        })
})
