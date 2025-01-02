import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    save(taskId: string, result: any): void

    retrieve(privateKey: string, cid: string): Promise<TaskResult>
}