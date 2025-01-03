import { TaskResult } from '../../domain/core/task/TaskResult.js'
import { TaskResultIdentifier } from '../../domain/core/task/TaskResultIdentifier.js'

export interface TaskRepository {
    upload(publicKey: string, taskResult: TaskResult): Promise<TaskResultIdentifier>

    retrieve(privateKey: string, cid: string): Promise<TaskResult>
}
