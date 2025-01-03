import express, { Request, Response, Router } from 'express'
import { peerController as controller } from '../controllers/peersController.js'
import HttpStatusCode from '../../../utils/HttpStatusCode.js'

export const peersRouter: Router = express.Router()

peersRouter.route('/').get((_: Request, res: Response): void => {
    try {
        res.status(HttpStatusCode.OK).send(controller.getPeers())
    } catch (e) {
        res.send({ error: 'No peers found' })
    }
})

peersRouter.route('/:id/metrics').get(async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(HttpStatusCode.OK).send(await controller.getPeerMetric(req.params.id))
    } catch (e) {
        res.send({ error: 'No peer metrics found' })
    }
})
