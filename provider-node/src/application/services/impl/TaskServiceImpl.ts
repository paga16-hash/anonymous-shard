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
import {TaskForceSubmissionEvent} from "../../../domain/events/task/TaskForceSubmissionEvent.js";

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
            console.log("Peer outcome handler not implemented", taskEvent)
        }
    }

    async routeEvent(event: TaskEvent): Promise<void> {
        switch (event.type) {
            case EventType.TASK_SUBMISSION:
                const taskSubmittedEvent: TaskSubmissionEvent = event as TaskSubmissionEvent
                await this.evaluateTask(taskSubmittedEvent)
                break
            case EventType.TASK_FORCE_SUBMISSION:
                const taskForceSubmittedEvent: TaskForceSubmissionEvent = event as TaskForceSubmissionEvent
                await this.execute(taskForceSubmittedEvent.task)
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
            console.log("Peer not accepted, redirecting task...")
            await this.redirectTask(task, await this.evaluator.getCandidates(task, 10))
            //TODO TO implement task redirection
        }
    }

    async redirectTask(task: Task, candidateAddresses: string[]): Promise<void> {
        console.log("Redirecting task to one of:", candidateAddresses)
        const newProviderAddress: string = candidateAddresses[Math.floor(Math.random() * candidateAddresses.length)]
        console.log("Redirecting task to:", newProviderAddress)
        const taskEvent: TaskForceSubmissionEvent = TaskEventFactory.taskForceSubmissionEventFrom(task, newProviderAddress)
        await this.taskOutcomeHandler(taskEvent)
    }

    getPendingTasks(): Promise<Task[]> {
        return Promise.resolve([]);
    }

    registerTaskOutcomeHandler(handler: (taskEvent: TaskEvent) => Promise<void>): void {
        this.taskOutcomeHandler = handler
    }
}