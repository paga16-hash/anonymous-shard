import { DomainEvent } from './DomainEvent'

export interface MetricEvent extends DomainEvent {
  readonly peerId: string
}
