import {MetricService} from "../MetricService.js";
import {Metric} from "../../../domain/core/metric/Metric.js";
import {MetricFactory} from "../../../domain/factories/core/metric/MetricFactory.js";
import {EventType} from "../../../utils/EventType.js";
import {MetricEvent} from "../../../domain/events/metric/MetricEvent.js";
import {MetricAvailableEvent} from "../../../domain/events/metric/MetricAvailableEvent.js";

export class MetricServiceImpl implements MetricService {
    knownMetrics: Map<string, Metric> = new Map<string, Metric>();

    async routeEvent(event: MetricEvent): Promise<void> {
        switch (event.type) {
            case EventType.METRIC_AVAILABLE:
                const metricAvailableEvent: MetricAvailableEvent = event as MetricAvailableEvent;
                this.updateKnownMetrics(event.peerId, metricAvailableEvent.metric);
                break;
            default:
                console.error("Unrecognized or not supported event type", event.type);
                break;
        }
    }

    async getCurrentMetric(): Promise<Metric> {
        return MetricFactory.currentMetric();
    }

    getBestCandidate(): Map<string, Metric> {
        return this.knownMetrics;
    }

    getKnownMetrics(): Map<string, Metric> {
        return this.knownMetrics;
    }

    private updateKnownMetrics(peerId: string, metric: Metric): void {
        this.knownMetrics.set(peerId, metric);
    }


}