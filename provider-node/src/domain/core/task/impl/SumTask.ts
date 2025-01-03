import { Task } from '../Task.js'
import { TaskId } from '../TaskId.js'
import { ClientId } from '../ClientId.js'
import { SumTaskDetails } from './SumTaskDetails.js'

export interface SumTask extends Task {
    readonly id: TaskId
    readonly clientId: ClientId
    readonly details: SumTaskDetails
}
