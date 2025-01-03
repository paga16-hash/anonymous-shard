import express, { Request, Response, Router } from 'express'
import { taskController as controller } from '../controllers/tasksController.js'
import HttpStatusCode from '../../../utils/HttpStatusCode.js'
import { TaskStateConverter } from '../../../domain/core/task/enum/TaskState.js'

export const tasksRouter: Router = express.Router()
//TODO: also here, add presentation layer

tasksRouter.route('/').get((_: Request, res: Response): void => {
  try {
    res.status(HttpStatusCode.OK).send(Array.from(controller.getTasks()))
  } catch (e) {
    res.send({ error: 'No tasks found' })
  }
})

tasksRouter.route('/:id/results').get(async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(HttpStatusCode.OK).send(await controller.getTaskResult(req.params.id))
  } catch (e) {
    res.send({ error: 'No tasks found' })
  }
})

tasksRouter.route('/').post((req: Request, res: Response): void => {
  try {
    console.log('BODY: ', req.body)
    res.status(HttpStatusCode.OK).send(Array.from(controller.getTasks()))
  } catch (e) {
    res.send({ error: 'No tasks found' })
  }
})

tasksRouter.route('/:status').get((req: Request, res: Response): void => {
  try {
    res
      .status(HttpStatusCode.OK)
      .send(Array.from(controller.getTasksByStatus(TaskStateConverter.from(req.params.status))))
  } catch (e) {
    res.send({ error: 'No tasks found by status' })
  }
})
