import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Task} from "../../domain/core/task/Task.js";

export interface TaskService {
    execute(task: Task): Promise<TaskResult>
}