import { EventType } from '../../../utils/EventType.js'
import { PeerDiscoveryEvent } from './PeerDiscoveryEvent.js'

export interface PingEvent extends PeerDiscoveryEvent {
    type: EventType.PING
}
