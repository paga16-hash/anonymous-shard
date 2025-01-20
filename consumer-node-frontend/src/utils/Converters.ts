export enum TaskType {
  SUM,
  FISCAL_CODE
}

export class TaskTypeConverter {
  static from(value: number): string {
    return TaskType[value]
  }
}
