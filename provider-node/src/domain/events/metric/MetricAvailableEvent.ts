import { MetricEvent } from './MetricEvent.js'
import { Metric } from '../../core/metric/Metric.js'

export interface MetricAvailableEvent extends MetricEvent {
    readonly metric: Metric
}
