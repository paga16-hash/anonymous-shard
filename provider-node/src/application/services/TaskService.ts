import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Task} from "../../domain/core/task/Task.js";
import {TaskId} from "../../domain/core/task/TaskId";

export interface TaskService {
    execute(task: Task): Promise<TaskResult>
    retrieveResult(taskId: TaskId): Promise<TaskResult>
}