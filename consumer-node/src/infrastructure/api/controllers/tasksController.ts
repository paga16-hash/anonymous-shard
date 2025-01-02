import {Task} from "../../../domain/core/task/Task.js";
import {consumerNodeService} from "../../../index.js";
import {TaskState} from "../../../domain/core/task/enum/TaskState.js";

export const taskController = {
    getTasks: (): Map<string, Task> => {
        return consumerNodeService.getTasks()
    },
    getTasksByStatus: (status: TaskState): Map<string, Task> => {
        const completedTasks: Map<string, Task>  = new Map<string, Task>();
        consumerNodeService.getTasks().forEach((task: Task, key: string): void => {
            if (task.status === status) {
                completedTasks.set(key, task);
            }
        });
        return completedTasks;
    }
}

