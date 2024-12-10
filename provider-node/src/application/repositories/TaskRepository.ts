import {TaskId} from "../../domain/core/task/TaskId.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskRepository {
    getById(cid: TaskId): TaskResult

    upload(taskResult: TaskResult): void

    delete(fileId: TaskId): void
}