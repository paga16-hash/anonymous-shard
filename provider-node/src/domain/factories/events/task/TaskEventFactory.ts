import {DomainEventIdFactory} from "../DomainEventIdFactory.js";
import {Topic} from "../../../../utils/Topic.js";
import {EventType} from "../../../../utils/EventType.js";
import {TaskResultEvent} from "../../../events/task/TaskResultEvent.js";
import {TaskResult} from "../../../core/task/TaskResult.js";
import {ClientId} from "../../../core/task/ClientId.js";
import {TaskFailureEvent} from "../../../events/task/TaskFailureEvent.js";
import {TaskFailure} from "../../../core/task/enum/TaskFailure.js";

export class TaskEventFactory {
    static taskResultEventFrom(clientId: ClientId, result: TaskResult): TaskResultEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.TASK,
            type: EventType.TASK_COMPLETED,
            timestamp: new Date(),
            clientId: clientId,
            result
        }
    }

    static taskFailureEventFrom(clientId: ClientId, message: string): TaskFailureEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.TASK,
            type: EventType.TASK_FAILED,
            timestamp: new Date(),
            clientId: clientId,
            error: {
                failure: TaskFailure.ERROR,
                msg: message
            }
        }
    }
}
