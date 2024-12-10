import {TaskDetails} from "./TaskDetails.js";
import {TaskId} from "./TaskId.js";

export interface Task {
    readonly id: TaskId
    readonly clientId: string // onion, peer id or public key
    readonly taskDetails: TaskDetails
}