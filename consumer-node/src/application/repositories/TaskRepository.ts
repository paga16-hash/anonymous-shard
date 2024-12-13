import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    retrieve(privateKey: string, cid: string): Promise<TaskResult>
}