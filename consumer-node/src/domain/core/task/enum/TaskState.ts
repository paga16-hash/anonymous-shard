export enum TaskState {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class TaskStateConverter {
  static from(value: string): TaskState {
    return TaskState[value.toUpperCase() as keyof typeof TaskState]
  }
}
