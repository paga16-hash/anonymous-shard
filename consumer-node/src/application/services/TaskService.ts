import {TaskResult} from "../../domain/core/task/TaskResult.js";
import {Task} from "../../domain/core/task/Task.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";

export interface TaskService {
    routeEvent(event: TaskEvent): void

    retrieveResult(task: Task, cId: string): Promise<TaskResult>

    getTasks(): Map<string, Task>

    addTask(pk:string, task: Task): void

    removeTask(pk: string): void
}