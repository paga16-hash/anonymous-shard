import { DomainEvent } from '../DomainEvent.js'
import { ClientId } from '../../core/task/ClientId.js'

export interface TaskEvent extends DomainEvent {
  readonly clientId: ClientId
}
