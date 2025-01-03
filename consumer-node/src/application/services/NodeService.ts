import { Task } from '../../domain/core/task/Task.js'
import { TaskResult } from '../../domain/core/task/TaskResult.js'
import { TaskId } from '../../domain/core/task/TaskId.js'

export interface NodeService {
  getTasks(): Map<string, Task>

  getLocalTaskResult(id: TaskId): Promise<TaskResult>
}
