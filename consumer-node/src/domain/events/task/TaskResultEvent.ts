import {TaskEvent} from "./TaskEvent.js";
import {TaskResult} from "../../core/task/TaskResult.js";

export interface TaskResultEvent extends TaskEvent {
    result: TaskResult
}