import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    upload(publicKey: string, taskResult: TaskResult): void

    retrieve(privateKey: string, cid: string): Promise<TaskResult>

    //delete(fileId: TaskId): void
}