import {TaskService} from "../TaskService.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";
import {Task} from "../../../domain/core/task/Task.js";
import {TaskRepository} from "../../repositories/TaskRepository.js";
import {TaskExecutor} from "../../executors/TaskExecutor.js";
import {TaskType} from "../../../domain/core/task/enum/TaskType.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {EventType} from "../../../utils/EventType.js";
import {TaskSubmissionEvent} from "../../../domain/events/task/TaskSubmissionEvent.js";
import {TaskResultEvent} from "../../../domain/events/task/TaskResultEvent.js";
import {TaskEventFactory} from "../../../domain/factories/events/task/TaskEventFactory.js";
import {TaskFailureEvent} from "../../../domain/events/task/TaskFailureEvent.js";

export class TaskServiceImpl implements TaskService {
    private readonly taskRepository: TaskRepository
    private readonly taskExecutors: Map<TaskType, TaskExecutor>;
    private taskOutcomeHandler: ((taskEvent: TaskEvent) => Promise<void>);

    constructor(taskRepository: TaskRepository, taskExecutors: Map<TaskType, TaskExecutor> = new Map()) {
        this.taskExecutors = taskExecutors
        this.taskRepository = taskRepository
        this.taskOutcomeHandler = async (taskEvent: TaskEvent): Promise<void> => {
            console.log("Task outcome handler not implemented", taskEvent)
        }
    }

    async routeEvent(event: TaskEvent): Promise<void> {
        switch (event.type) {
            case EventType.TASK_SUBMISSION:
                const taskSubmittedEvent: TaskSubmissionEvent = event as TaskSubmissionEvent
                await this.execute(taskSubmittedEvent.task)
                break
            default:
                console.error("Unrecognized or not supported event type: " + event.type)
        }
    }

    async addTaskExecutor(taskType: TaskType, taskExecutor: TaskExecutor): Promise<void> {
        this.taskExecutors.set(taskType, taskExecutor)
    }

    async removeTaskExecutor(taskType: TaskType): Promise<void> {
        this.taskExecutors.delete(taskType)
    }

    async execute(task: Task): Promise<void> {
        try {
            const publicKey: string = task.id.publicKey
            const executor = this.taskExecutors.get(task.id.type)
            const result: TaskResult = executor!.execute(task)
            // clean public-key for security reasons
            result.taskId.publicKey = ""
            result.cId = await this.taskRepository.upload(publicKey, result)
            const taskResultEvent: TaskResultEvent = TaskEventFactory.taskResultEventFrom(task.id, task.clientId, result.cId!)
            await this.taskOutcomeHandler(taskResultEvent)
        } catch (e: any) {
            const taskResultEvent: TaskFailureEvent = TaskEventFactory.taskFailureEventFrom(task.id, task.clientId, e.toString())
            await this.taskOutcomeHandler(taskResultEvent)
            console.error("Error executing task", e)
        }
    }

    getPendingTasks(): Promise<Task[]> {
        return Promise.resolve([]);
    }

    registerTaskOutcomeHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void {
        this.taskOutcomeHandler = handler
    }
}