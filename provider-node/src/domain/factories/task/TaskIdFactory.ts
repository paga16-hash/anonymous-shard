import {v4 as uuidv4} from "uuid";
import {TaskId} from "../../core/task/TaskId.js";
import {TaskType} from "../../core/task/enum/TaskType.js";

export class TaskFactory {

    static newId(taskType: TaskType): TaskId {
        return {
            value: uuidv4(),
            type: taskType
        }
    }

    static idOf(value: string, taskType: TaskType): TaskId {
        return {
            value: value,
            type: taskType
        }
    }
}
