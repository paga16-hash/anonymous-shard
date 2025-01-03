import { TaskEvent } from './TaskEvent.js'
import { Task } from '../../core/task/Task.js'

export interface TaskSubmissionEvent extends TaskEvent {
    task: Task
}
