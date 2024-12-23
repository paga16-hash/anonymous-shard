import {TaskId} from "./TaskId.js";

export interface TaskResult {
    readonly taskId: TaskId
    readonly result: any
    cId?: string
}