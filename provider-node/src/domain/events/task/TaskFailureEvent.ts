import {TaskEvent} from "./TaskEvent.js";
import {TaskError} from "../../core/task/TaskError.js";

export interface TaskFailureEvent extends TaskEvent {
    error: TaskError
}