import {Task} from "../../domain/core/task/Task.js";

export interface TaskEvaluator {
    /**
     * Evaluate the task for this node, based on an evaluation strategy
     * @param task the task to evaluate
     * @return true if this node should execute the task, false otherwise
     */
    evaluate(task: Task): Promise<boolean>

    /**
     * Get the list of candidate nodes that can execute the task
     * @param task the task to evaluate the candidates for
     * @param n the number of candidate nodes to return
     * @return the list of candidate nodes
     */
    getCandidates(task: Task, n: number): Promise<string[]>
}