import { TaskEvaluator } from '../TaskEvaluator.js'
import { Task } from '../../../domain/core/task/Task.js'
import { Metric } from '../../../domain/core/metric/Metric.js'

export class MetricBasedTaskEvaluator implements TaskEvaluator {
    private readonly metric: () => Promise<Metric>
    private readonly getOtherMetrics: () => Map<string, Metric>

    constructor(currentMetric: () => Promise<Metric>, metrics: () => Map<string, Metric>) {
        this.metric = currentMetric
        this.getOtherMetrics = metrics
    }

    /**
     * Evaluate the task for this node, based on an evaluation strategy.
     * @param _ The task to evaluate.
     * @return True if this node should execute the task, false otherwise.
     */
    async evaluate(_: Task): Promise<boolean> {
        // note the task is not used in this implementation, but it could be used to make the evaluation more complex because
        // the design allows for it
        try {
            const currentMetric: Metric = await this.metric()
            const otherMetrics: Map<string, Metric> = this.getOtherMetrics()

            const currentScore: number = this.calculateScore(currentMetric)
            const otherScores: number[] = Array.from(otherMetrics.values()).map(this.calculateScore)

            return otherScores.every((score: number): boolean => currentScore >= score)
        } catch (error) {
            console.error('Error during evaluation:', error)
            return false
        }
    }

    /**
     * Get the list of candidate nodes that can execute the task.
     * @param task The task to evaluate the candidates for.
     * @param n The number of candidate nodes to return.
     * @return The list of candidate nodes.
     */
    async getCandidates(task: Task, n: number): Promise<string[]> {
        try {
            const otherMetrics: Map<string, Metric> = this.getOtherMetrics()

            const scoredNodes = Array.from(otherMetrics.entries())
                .map(([key, metric]) => ({ key, score: this.calculateScore(metric) }))
                .sort((a, b) => b.score - a.score)
                .slice(0, n)

            return scoredNodes.map(node => node.key)
        } catch (error) {
            console.error('Error during candidate selection:', error)
            return []
        }
    }

    /**
     * Calculate the score for a given metric.
     * @param metric The metric to score.
     * @returns A numeric score.
     */
    private calculateScore(metric: Metric): number {
        const memoryScore: number = metric.memory.free / metric.memory.total
        const cpuScore: number = (1 - metric.cpu.load / 100) * metric.cpu.speed
        const gpuScore: number = metric.gpu.reduce((acc, gpu) => acc + gpu.memoryTotal, 0)

        return memoryScore * 0.5 + cpuScore * 0.4 + gpuScore * 0.1
    }
}
