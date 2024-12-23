import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    upload(publicKey: string, taskResult: TaskResult): Promise<string>

    retrieve(privateKey: string, cid: string): Promise<TaskResult>
}