import {TaskEvent} from "./TaskEvent.js";
import {Task} from "../../core/task/Task.js";

export interface TaskSubmittedEvent extends TaskEvent {
    task: Task
}