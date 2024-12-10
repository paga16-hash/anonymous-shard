import {TaskId} from "../../domain/core/task/TaskId.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    upload(taskResult: TaskResult): void

    retrieve(cid: TaskId): TaskResult

    delete(fileId: TaskId): void
}