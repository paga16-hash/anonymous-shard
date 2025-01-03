import { TaskResult } from '../../domain/core/task/TaskResult.js'
import { TaskId } from '../../domain/core/task/TaskId.js'

export interface TaskRepository {
  save(taskId: string, result: TaskResult): void

  retrieve(privateKey: string, cid: string): Promise<TaskResult>

  retrieveLocally(taskId: TaskId): Promise<TaskResult>
}
