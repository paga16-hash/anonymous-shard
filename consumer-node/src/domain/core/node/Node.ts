import {TaskEvent} from "../../events/task/TaskEvent.js";

export interface Node {
    peerId(): string;

    registerTaskEventsHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void;

    submitTask(taskEvent: TaskEvent): Promise<void>;
}