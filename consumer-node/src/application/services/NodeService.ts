import {Task} from "../../domain/core/task/Task.js";

export interface NodeService {
    getTasks(): Map<string, Task>
}