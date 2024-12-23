import {Task} from "../../domain/core/task/Task.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";

export interface TaskExecutor {
    execute(task: Task): TaskResult
}