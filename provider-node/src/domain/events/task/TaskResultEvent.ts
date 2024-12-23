import {TaskEvent} from "./TaskEvent.js";
import {TaskResultIdentifier} from "../../core/task/TaskResultIdentifier.js";

export interface TaskResultEvent extends TaskEvent {
    contentIdentifier: TaskResultIdentifier
}