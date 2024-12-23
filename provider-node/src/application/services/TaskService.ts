import {Task} from "../../domain/core/task/Task.js";
import {TaskEvent} from "../../domain/events/task/TaskEvent.js";

export interface TaskService {
    routeEvent(event: TaskEvent): void

    getPendingTasks(): Promise<Task[]>

    execute(task: Task): Promise<void>

    registerTaskOutcomeHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void
}