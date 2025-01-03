import { TaskResult } from '../../domain/core/task/TaskResult.js'
import { Task } from '../../domain/core/task/Task.js'
import { TaskEvent } from '../../domain/events/task/TaskEvent.js'
import { TaskResultIdentifier } from '../../domain/core/task/TaskResultIdentifier.js'
import { DomainEventId } from '../../domain/events/DomainEventId.js'
import { TaskState } from '../../domain/core/task/enum/TaskState.js'
import { TaskId } from '../../domain/core/task/TaskId.js'

export interface TaskService {
  routeEvent(event: TaskEvent): void

  retrieveResult(domainEventId: DomainEventId, cId: TaskResultIdentifier): Promise<TaskResult>

  retrieveLocalResult(taskId: TaskId): Promise<TaskResult>

  getTasks(): Map<string, Task>

  addTask(pk: string, task: Task): void

  setState(pk: string, taskState: TaskState): void

  removeTask(pk: string): void
}
