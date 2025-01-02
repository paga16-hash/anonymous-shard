import {TaskId} from "../../../core/task/TaskId.js";
import {ClientId} from "../../../core/task/ClientId.js";
import {SumTask} from "../../../core/task/impl/SumTask.js";
import {TaskIdFactory} from "./TaskIdFactory.js";
import {TaskState} from "../../../core/task/enum/TaskState.js";

export class SumTaskFactory {
    static taskFrom(taskId: TaskId, clientId: ClientId, status: TaskState, addends: number[]): SumTask {
        return {
            id: taskId,
            clientId: clientId,
            status: status,
            details: {
                addends: addends
            }
        }
    }

    static createTask(publicKey: string, clientId: ClientId, addends: number[]): SumTask {
        return {
            id: TaskIdFactory.newSumTaskId(publicKey),
            clientId: clientId,
            status: TaskState.PENDING,
            details: {
                addends: addends
            }
        }
    }
}