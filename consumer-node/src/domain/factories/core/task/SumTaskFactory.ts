import {TaskId} from "../../../core/task/TaskId.js";
import {ClientId} from "../../../core/task/ClientId.js";
import {SumTask} from "../../../core/task/impl/SumTask.js";
import {TaskIdFactory} from "./TaskIdFactory.js";
import {TaskType} from "../../../core/task/enum/TaskType.js";

export class SumTaskFactory {
    static taskFrom(taskId: TaskId, clientId: ClientId, addends: number[]): SumTask {
        return {
            id: taskId,
            clientId: clientId,
            details: {
                addends: addends
            }
        }
    }

    static createTask(clientId: ClientId, addends: number[]): SumTask {
        return {
            id: TaskIdFactory.newId(TaskType.SUM),
            clientId: clientId,
            details: {
                addends: addends
            }
        }
    }
}