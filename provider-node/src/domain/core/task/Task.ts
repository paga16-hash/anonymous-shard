import {TaskDetails} from "./TaskDetails.js";
import {TaskId} from "./TaskId.js";

export interface Task {
    readonly id: TaskId
    readonly clientId: string
    readonly taskDetails: TaskDetails
}