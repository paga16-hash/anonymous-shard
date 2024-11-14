import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/Metric.js";
import {MetricFactory} from "../../../domain/factories/MetricFactory.js";

export class MetricServiceImpl implements MetricService {
    async getCurrentMetrics(): Promise<Metric> {
        return MetricFactory.currentMetric();
    }
}