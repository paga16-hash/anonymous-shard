import {DomainEventIdFactory} from "../DomainEventIdFactory.js";
import {Topic} from "../../../../utils/Topic.js";
import {EventType} from "../../../../utils/EventType.js";
import {TaskResultEvent} from "../../../events/task/TaskResultEvent.js";
import {ClientId} from "../../../core/task/ClientId.js";
import {TaskFailureEvent} from "../../../events/task/TaskFailureEvent.js";
import {TaskFailure} from "../../../core/task/enum/TaskFailure.js";
import {TaskResultIdentifier} from "../../../core/task/TaskResultIdentifier.js";
import {TaskId} from "../../../core/task/TaskId.js";
import {TaskForceSubmissionEvent} from "../../../events/task/TaskForceSubmissionEvent.js";
import {Task} from "../../../core/task/Task.js";

export class TaskEventFactory {
    static taskResultEventFrom(taskId: TaskId, clientId: ClientId, cId: TaskResultIdentifier): TaskResultEvent {
        return {
            id: taskId,
            topic: Topic.TASK,
            type: EventType.TASK_COMPLETED,
            timestamp: new Date(),
            clientId: clientId,
            contentIdentifier: cId
        }
    }

    static taskFailureEventFrom(taskId: TaskId, clientId: ClientId, message: string): TaskFailureEvent {
        return {
            id: taskId,
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

    static taskForceSubmissionEventFrom(task: Task, newProviderAddress: string): TaskForceSubmissionEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.TASK,
            type: EventType.TASK_FORCE_SUBMISSION,
            timestamp: new Date(),
            clientId: task.clientId,
            task,
            provider: newProviderAddress
        }
    }
}
