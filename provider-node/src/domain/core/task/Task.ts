import {TaskDetails} from "./TaskDetails";
import {TaskId} from "./TaskId";

export interface Task {
    readonly id: TaskId
    readonly clientId: string
    readonly taskDetails: TaskDetails
}