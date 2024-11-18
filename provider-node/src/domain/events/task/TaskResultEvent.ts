import {TaskEvent} from "./TaskEvent.js";
import {TaskResult} from "../../task/TaskResult";

export interface TaskResultEvent extends TaskEvent {
    result: TaskResult
}