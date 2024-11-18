import {MetricEvent} from "./TaskEvent";
import {Metric} from "../Metric";

export interface MetricAvailableEvent extends MetricEvent {
    readonly metric: Metric
}