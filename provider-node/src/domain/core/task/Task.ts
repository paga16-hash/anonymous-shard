import {TaskId} from "./TaskId.js";
import {ClientId} from "./ClientId.js";

export interface Task {
    readonly id: TaskId
    readonly clientId: ClientId
    readonly details: any
}