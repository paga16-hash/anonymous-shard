import { EventType } from '../../../utils/EventType.js'
import { PeerDiscoveryEvent } from './PeerDiscoveryEvent.js'

export interface DiscoveryEvent extends PeerDiscoveryEvent {
    type: EventType.DISCOVER
}
