import express, {Request, Response, Router} from 'express'
import {taskController as controller} from "../controllers/tasksController.js";
import HttpStatusCode from "../../../utils/HttpStatusCode.js";

export const tasksRouter: Router = express.Router()
//TODO: also here, add presentation layer

tasksRouter.route('/').get((_: Request, res: Response): void => {
    try {
        res.status(HttpStatusCode.OK).send(Array.from(controller.getTasks()))
    } catch (e) {
        res.send({error: 'No tasks found'})
    }
})
