import { MetricAvailableEvent } from '../../../events/metric/MetricAvailableEvent.js'
import { DomainEventId } from '../../../events/DomainEventId.js'
import { Metric } from '../../../core/metric/Metric.js'
import { EventType } from '../../../../utils/EventType.js'
import { Topic } from '../../../../utils/Topic.js'
import { DomainEventIdFactory } from '../DomainEventIdFactory.js'

export class MetricEventFactory {
    static createMetricAvailableEvent(peerId: string, metric: Metric): MetricAvailableEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.METRIC,
            type: EventType.METRIC_AVAILABLE,
            timestamp: new Date(),
            peerId,
            metric
        }
    }

    static metricAvailableEventFrom(
        id: DomainEventId,
        timestamp: Date,
        peerId: string,
        metric: Metric
    ): MetricAvailableEvent {
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
