import {TaskService} from "../TaskService.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";
import {Task} from "../../../domain/core/task/Task.js";
import {TaskRepository} from "../../repositories/TaskRepository.js";
import {TaskExecutor} from "../../executors/TaskExecutor.js";
import {TaskType} from "../../../domain/core/task/enum/TaskType.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {EventType} from "../../../utils/EventType.js";
import {TaskSubmissionEvent} from "../../../domain/events/task/TaskSubmissionEvent.js";
import {TaskEventFactory} from "../../../domain/factories/events/task/TaskEventFactory.js";
import {TaskEvaluator} from "../../evaluator/TaskEvaluator.js";

export class TaskServiceImpl implements TaskService {
    private readonly evaluator: TaskEvaluator
    private readonly repository: TaskRepository
    private readonly executors: Map<TaskType, TaskExecutor>;
    private taskOutcomeHandler: ((taskEvent: TaskEvent) => Promise<void>);

    constructor(taskRepository: TaskRepository, taskEvaluator: TaskEvaluator, taskExecutors: Map<TaskType, TaskExecutor> = new Map()) {
        this.evaluator = taskEvaluator
        this.executors = taskExecutors
        this.repository = taskRepository
        this.taskOutcomeHandler = async (taskEvent: TaskEvent): Promise<void> => {
            console.log("Task outcome handler not implemented", taskEvent)
        }
    }

    async routeEvent(event: TaskEvent): Promise<void> {
        switch (event.type) {
            case EventType.TASK_SUBMISSION:
                const taskSubmittedEvent: TaskSubmissionEvent = event as TaskSubmissionEvent
                await this.evaluateTask(taskSubmittedEvent)
                break
            default:
                console.error("Unrecognized or not supported event type: " + event.type)
        }
    }

    async addTaskExecutor(taskType: TaskType, taskExecutor: TaskExecutor): Promise<void> {
        this.executors.set(taskType, taskExecutor)
    }

    async removeTaskExecutor(taskType: TaskType): Promise<void> {
        this.executors.delete(taskType)
    }

    async execute(task: Task): Promise<void> {
        let taskResultEvent;
        try {
            const publicKey: string = task.id.publicKey
            const executor: TaskExecutor = this.executors.get(task.id.type)!
            const result: TaskResult = executor!.execute(task)
            // clean public-key for security reasons
            result.taskId.publicKey = ""
            result.cId = await this.repository.upload(publicKey, result)
            taskResultEvent = TaskEventFactory.taskResultEventFrom(task.id, task.clientId, result.cId!)
        } catch (e: any) {
            taskResultEvent = TaskEventFactory.taskFailureEventFrom(task.id, task.clientId, e.toString())
            console.error("Error executing task", e)
        }
        await this.taskOutcomeHandler(taskResultEvent)
    }

    async evaluateTask(taskSubmissionEvent: TaskSubmissionEvent): Promise<void> {
        const task: Task = taskSubmissionEvent.task
        if (await this.evaluator.evaluate(task)) {
            await this.execute(task)
        } else {
            //TODO TO implement task redirection
        }
    }

    getPendingTasks(): Promise<Task[]> {
        return Promise.resolve([]);
    }

    registerTaskOutcomeHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void {
        this.taskOutcomeHandler = handler
    }
}