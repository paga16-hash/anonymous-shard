import { v4 as uuidv4 } from 'uuid'
import { TaskId } from '../../../core/task/TaskId.js'
import { TaskType } from '../../../core/task/enum/TaskType.js'

export class TaskIdFactory {
  static newId(taskType: TaskType, publicKey: string): TaskId {
    return {
      value: uuidv4(),
      type: taskType,
      publicKey: publicKey
    }
  }

  static newSumTaskId(publicKey: string): TaskId {
    return {
      value: uuidv4(),
      type: TaskType.SUM,
      publicKey: publicKey
    }
  }

  static idOf(value: string, taskType: TaskType, publicKey: string): TaskId {
    return {
      value: value,
      type: taskType,
      publicKey: publicKey
    }
  }
}
