import {TaskService} from "../TaskService.js";
import {TaskResult} from "../../../domain/core/task/TaskResult.js";
import {Task} from "../../../domain/core/task/Task.js";
import {TaskRepository} from "../../repositories/TaskRepository.js";
import {TaskEvent} from "../../../domain/events/task/TaskEvent.js";
import {EventType} from "../../../utils/EventType.js";
import {TaskResultEvent} from "../../../domain/events/task/TaskResultEvent.js";
import {TaskResultIdentifier} from "../../../domain/core/task/TaskResultIdentifier.js";
import {DomainEventId} from "../../../domain/events/DomainEventId.js";

export class TaskServiceImpl implements TaskService {
    private readonly taskRepository: TaskRepository
    private readonly tasks: Map<string, Task>

    constructor(taskRepository: TaskRepository, tasks: Map<string, Task> = new Map()) {
        this.tasks = tasks
        this.taskRepository = taskRepository
    }

    async routeEvent(event: TaskEvent): Promise<void> {
        switch (event.type) {
            case EventType.TASK_COMPLETED:
                const taskResultEvent: TaskResultEvent = event as TaskResultEvent
                console.log("Returned event", taskResultEvent)
                // get the cId and call the retrieve method, retrieving the task from tasks and the pk to decript the result.
                const result: TaskResult = await this.retrieveResult(taskResultEvent.id, taskResultEvent.contentIdentifier)
                console.log("Decrypted result", result)
                //this.persistResult() ...
                break
            default:
                console.error("Unrecognized or not supported event type: " + event.type)
        }
    }

    retrieveResult(domainEventId: DomainEventId, cId: TaskResultIdentifier): Promise<TaskResult> {
        const pk = Array.from(this.tasks.entries())
            .find(([key, task]) => task.id.value === domainEventId.value)?.[0];
        return this.taskRepository.retrieve(pk!, cId.value)
    }

    getTasks(): Map<string, Task> {
        return this.tasks
    }

    addTask(pk: string, task: Task): void {
        //TODO TO IMPLEMENT A STORAGE ON FILE FOR THE PK AND THE TASK ID
        //TODO IN ORDER TO RETRIEVE THE TASK LATER AFTER RESTARTS
        this.tasks.set(pk, task)
    }

    removeTask(pk: string): void {
        this.tasks.delete(pk)
    }

}