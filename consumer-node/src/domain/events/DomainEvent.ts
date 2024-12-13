import { DomainEventId } from './DomainEventId.js'
import {EventType} from "../../utils/EventType.js";

export interface DomainEvent {
  readonly id: DomainEventId

  readonly topic: string

  readonly type: EventType

  readonly timestamp: Date
}
