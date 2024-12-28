import {Task} from "../../domain/core/task/Task.js";

export interface TaskEvaluator {
    /**
     * Evaluate the task for this node, based on an evaluation strategy
     * @param task the task to evaluate
     * @return true if this node should execute the task, false otherwise
     */
    evaluate(task: Task): Promise<boolean>
}