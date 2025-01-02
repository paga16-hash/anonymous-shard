import {Task} from "../../../domain/core/task/Task.js";
import {consumerNodeService} from "../../../index.js";

export const taskController = {
    getTasks: (): Map<string, Task> => {
        return consumerNodeService.getTasks()
    },
}