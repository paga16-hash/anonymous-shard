import { TaskId } from './TaskId.js'
import { TaskResultIdentifier } from './TaskResultIdentifier.js'

export interface TaskResult {
  readonly taskId: TaskId
  readonly result: any
  cId?: TaskResultIdentifier
}
