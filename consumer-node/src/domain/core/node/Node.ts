import {TaskEvent} from "../../events/task/TaskEvent.js";
import {TaskSubmissionEvent} from "../../events/task/TaskSubmissionEvent.js";

export interface Node {
    peerId(): string;

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void;

    submitTask(taskEvent: TaskSubmissionEvent): Promise<void>;
}