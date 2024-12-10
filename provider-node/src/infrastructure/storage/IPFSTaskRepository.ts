import {TaskId} from "../../domain/core/task/TaskId.js";
import {TaskRepository} from "../../application/repositories/TaskRepository.js";
import {TaskResult} from "../../domain/core/task/TaskResult.js";

export class IPFSTaskRepository implements TaskRepository {

    getById(taskId: TaskId): TaskResult {
        //retrieve file from IPFS
        // @ts-ignore
        return new File();
    }

    delete(taskId: TaskId): void {
    }

    retrieve(taskId: TaskId): TaskResult {
        //call IPFS to retrieve file
        return undefined;
    }

    upload(taskResult: TaskResult): void {

    }
}