import {TaskEvent} from "./TaskEvent.js";
import {TaskError} from "../../task/TaskError.js";

export interface TaskFailureEvent extends TaskEvent {
    error: TaskError
}