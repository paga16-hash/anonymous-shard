import { DomainEvent } from '../DomainEvent.js'

export interface TaskEvent extends DomainEvent {
  readonly clientId: string
}
