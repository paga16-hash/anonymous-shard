import {Task} from "../../../domain/core/task/Task.js";
import {SumTask} from "../../../domain/core/task/impl/SumTask.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";
import {TaskFailure} from "../../../domain/core/task/enum/TaskFailure.js";

export class SumTaskExecutor {
    execute(task: Task): TaskResult {
        try {
            const sumTask: SumTask  = this.parseSumTask(task);
            const sum: number = sumTask.details.addends.reduce((acc: number, val: number) => acc + val, 0);
            return {
                taskId: sumTask.id,
                result: sum
            };
        }
        catch (e) {
            return {
                taskId: task.id,
                result: {
                    failure: TaskFailure.ERROR,
                    msg: e
                }
            }
        }
    }

    private parseSumTask(task: Task): SumTask {
        if (task.details.addends === undefined) {
            throw new Error("Invalid task details");
        }
        //TODO TO IMPLEMENT VALIDATION
        //TaskPresenter.validate(task)
        return task as SumTask;
    }
}