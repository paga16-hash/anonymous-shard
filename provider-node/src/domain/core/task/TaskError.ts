import { TaskFailure } from './enum/TaskFailure.js'

export interface TaskError {
    failure: TaskFailure
    msg: string
}
