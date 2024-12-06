import { DomainEventId } from './DomainEventId.js'

export interface DomainEvent {
  readonly id: DomainEventId

  readonly topic: string

  readonly type: string

  readonly timestamp: Date
}
