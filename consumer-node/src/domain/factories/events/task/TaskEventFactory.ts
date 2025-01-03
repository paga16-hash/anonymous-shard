import { Task } from '../../../core/task/Task.js'
import { TaskSubmissionEvent } from '../../../events/task/TaskSubmissionEvent.js'
import { DomainEventIdFactory } from '../DomainEventIdFactory.js'
import { Topic } from '../../../../utils/Topic.js'
import { EventType } from '../../../../utils/EventType.js'

export class TaskEventFactory {
  static taskSubmissionEventFrom(task: Task): TaskSubmissionEvent {
    return {
      id: DomainEventIdFactory.newId(),
      topic: Topic.TASK,
      type: EventType.TASK_SUBMISSION,
      timestamp: new Date(),
      clientId: task.clientId,
      task
    }
  }
}
