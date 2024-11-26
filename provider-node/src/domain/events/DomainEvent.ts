import { DomainEventId } from './DomainEventId.js'

export interface DomainEvent {
  readonly id: DomainEventId

  readonly type: any

  readonly timestamp: Date
}
