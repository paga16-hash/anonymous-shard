import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Task} from "../../domain/core/task/Task.js";
import {TaskId} from "../../domain/core/task/TaskId.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";

export interface TaskService {
    routeEvent(event: TaskEvent): void
    getPendingTasks(): Promise<Task[]>
    execute(task: Task): Promise<TaskResult>
    retrieveResult(taskId: TaskId): Promise<TaskResult>
}