import {TaskResultIdentifier} from "../../../core/task/TaskResultIdentifier.js";

export class TaskResultIdentifierFactory {
    static taskResultIdentifierFrom(contentIdentifier: string): TaskResultIdentifier {
        return {
            value: contentIdentifier
        }
    }
}