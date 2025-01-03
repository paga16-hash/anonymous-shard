import { DomainEventId } from '../../events/DomainEventId.js'
import { v4 as uuidv4 } from 'uuid'

export class DomainEventIdFactory {
  static newId(): DomainEventId {
    return { value: uuidv4() }
  }

  static idOf(value: string): DomainEventId {
    return { value }
  }
}
