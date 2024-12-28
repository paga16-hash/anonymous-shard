import {TaskEvaluator} from "../TaskEvaluator.js";
import {Task} from "../../../domain/core/task/Task.js";
import {Metric} from "../../../domain/core/metric/Metric.js";

export class MetricBasedTaskEvaluator implements TaskEvaluator {

    private readonly metric: () => Promise<Metric>;
    private readonly getOtherMetrics: () => Map<string, Metric>;
    constructor(currentMetric: () => Promise<Metric>, metrics: () => Map<string, Metric>) {
        this.metric = currentMetric;
        this.getOtherMetrics = metrics;
    }

    async evaluate(task: Task): Promise<boolean> {
        const currentMetric: Metric = await this.metric();
        const otherMetrics: Map<string, Metric> = this.getOtherMetrics();

        // business logic to evaluate the task

        return false;
        /*const currentMetric: Metric = this.metricService.getCurrentMetric();
        return currentMetric.value > this.metricThreshold;*/
    }
}