import {MetricAvailableEvent} from "../../events/metric/MetricAvailableEvent.js";
import {DomainEventId} from "../../events/DomainEventId.js";
import {Metric} from "../../core/metric/Metric.js";
import {EventType} from "../../../utils/EventType.js";
import {Topic} from "../../../utils/Topic.js";
import {v4 as uuidv4} from 'uuid';

export class MetricEventFactory {

    static newId(): DomainEventId {
        return {value: uuidv4()}
    }

    static idOf(value: string): DomainEventId {
        return {value}
    }

    static createMetricAvailableEvent(peerId: string, metric: Metric): MetricAvailableEvent {
        return {
            id: this.newId(),
            topic: Topic.METRIC,
            type: EventType.METRIC_AVAILABLE,
            timestamp: new Date(),
            peerId,
            metric
        }
    }

    static metricAvailableEventFrom(id: DomainEventId, timestamp: Date, peerId: string, metric: Metric): MetricAvailableEvent {
        return {
            id,
            topic: Topic.METRIC,
            type: EventType.METRIC_AVAILABLE,
            timestamp,
            peerId,
            metric
        }
    }
}