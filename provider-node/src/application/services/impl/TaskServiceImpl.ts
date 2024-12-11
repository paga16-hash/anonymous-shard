import {TaskService} from "../TaskService.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";
import {Task} from "../../../domain/core/task/Task.js";
import {TaskRepository} from "../../repositories/TaskRepository.js";
import {TaskExecutor} from "../../executors/TaskExecutor.js";
import {TaskType} from "../../../domain/core/task/enum/TaskType.js";
import {TaskId} from "../../../domain/core/task/TaskId.js";

export class TaskServiceImpl implements TaskService {
    private readonly taskRepository: TaskRepository
    private readonly taskExecutors: Map<TaskType, TaskExecutor>;

    constructor(taskRepository: TaskRepository, taskExecutors: Map<TaskType, TaskExecutor> = new Map()) {
        this.taskExecutors = taskExecutors
        this.taskRepository = taskRepository
    }

    async addTaskExecutor(taskType: TaskType, taskExecutor: TaskExecutor): Promise<void> {
        this.taskExecutors.set(taskType, taskExecutor)
    }

    async removeTaskExecutor(taskType: TaskType): Promise<void> {
        this.taskExecutors.delete(taskType)
    }

    async execute(task: Task): Promise<TaskResult> {
        const executor = this.taskExecutors.get(task.id.type)
        if (!executor) {
            throw new Error(`Task executor not found for task type: ${task.id.type}`)
        }
        const result: TaskResult = executor.execute(task)
        this.taskRepository.upload(task.clientId.publicKey!, result)
        return result
    }

    retrieveResult(taskId: TaskId): Promise<TaskResult> {
        //TO BIND IN SOME WAY THE CID TO THE TASK ID
        return this.taskRepository.retrieve("privateKey", "cid")
    }
}