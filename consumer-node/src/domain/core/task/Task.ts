import {TaskId} from "./TaskId.js";
import {ClientId} from "./ClientId.js";
import {TaskState} from "./enum/TaskState.js";

export interface Task {
    readonly id: TaskId
    readonly clientId: ClientId
    status: TaskState
    readonly details: any
}