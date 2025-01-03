import { NodeService } from '../NodeService.js'
import { Node } from '../../../domain/core/node/Node.js'
import { NodeImpl } from '../../../domain/core/node/impl/NodeImpl.js'
import { TaskService } from '../TaskService.js'
import { TaskEvent } from '../../../domain/events/task/TaskEvent.js'
import { TaskSubmissionEvent } from '../../../domain/events/task/TaskSubmissionEvent.js'
import { mapBootstrapAddresses } from '../../../utils/BootstrapNode.js'
import { TaskEventFactory } from '../../../domain/factories/events/task/TaskEventFactory.js'
import { SumTaskFactory } from '../../../domain/factories/core/task/SumTaskFactory.js'
import { ClientIdFactory } from '../../../domain/factories/core/task/ClientIdFactory.js'
import { KeyPairFactory } from '../../../utils/KeyPairFactory.js'
import { Task } from '../../../domain/core/task/Task.js'
import { TaskId } from '../../../domain/core/task/TaskId'
import { TaskResult } from '../../../domain/core/task/TaskResult'

export class NodeServiceImpl implements NodeService {
  private readonly SUBMIT_INTERVAL: number = 100000
  private readonly node: Node
  private readonly taskService: TaskService

  constructor(taskService: TaskService) {
    this.node = new NodeImpl(process.env.HOST!, parseInt(process.env.PORT!), mapBootstrapAddresses())
    this.taskService = taskService
    this.init().then((): void => {
      console.log('Consumer service node initialized')
      this.startSubmitting()
    })
  }

  private async init(): Promise<void> {
    this.node.registerTaskEventsHandler(async (taskEvent: TaskEvent): Promise<void> => {
      console.log('Received task event')
      this.taskService.routeEvent(taskEvent)
    })
  }

  private startSubmitting(): void {
    setInterval(async (): Promise<void> => {
      const rndAddends: number[] = Array.from({ length: 5 }, (): number => Math.floor(Math.random() * 100))
      const { publicKey, privateKey } = KeyPairFactory.newPair()
      const taskEvent: TaskSubmissionEvent = TaskEventFactory.taskSubmissionEventFrom(
        SumTaskFactory.createTask(
          publicKey,
          ClientIdFactory.idFrom(process.env.HOST! + ':' + process.env.PORT!),
          rndAddends
        )
      )
      this.taskService.addTask(privateKey, taskEvent.task)
      this.node.submitTask(taskEvent).catch((e: any): void => {
        console.error('Error submitting task', e)
      })
    }, this.SUBMIT_INTERVAL)
  }

  getTasks(): Map<string, Task> {
    return this.taskService.getTasks()
  }

  async getLocalTaskResult(id: TaskId): Promise<TaskResult> {
    return await this.taskService.retrieveLocalResult(id)
  }
}
