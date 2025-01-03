import {Task} from "../../../domain/core/task/Task.js";
import {consumerNodeService} from "../../../index.js";
import {TaskState} from "../../../domain/core/task/enum/TaskState.js";
import {TaskIdFactory} from "../../../domain/factories/core/task/TaskIdFactory.js";
import {TaskType} from "../../../domain/core/task/enum/TaskType.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";

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
    },
    getTaskResult: async (id: string): Promise<TaskResult> => {
        return await consumerNodeService.getLocalTaskResult(TaskIdFactory.idOf(id, TaskType.SUM, ""));
    }
}

