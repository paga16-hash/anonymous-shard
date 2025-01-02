import {Task} from "../../../domain/core/task/Task.js";
import {taskService} from "../../../index.js";

export const taskController = {
    getTasks: async (): Promise<Map<string, Task>> => {
        return taskService.getTasks()
    },
}