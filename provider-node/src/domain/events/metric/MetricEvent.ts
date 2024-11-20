import { DomainEvent } from '../DomainEvent.js'

export interface MetricEvent extends DomainEvent {
  readonly peerId: string
}
