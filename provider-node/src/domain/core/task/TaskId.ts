import {TaskType} from "./enum/TaskType.js";

export interface TaskId {
    readonly value: string
    readonly type: TaskType
    publicKey: string
}