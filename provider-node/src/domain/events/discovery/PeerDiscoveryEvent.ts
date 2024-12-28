import {DomainEvent} from "../DomainEvent.js";
import {EventType} from "../../../utils/EventType";

export interface PeerDiscoveryEvent extends DomainEvent {
    type: EventType.DISCOVER | EventType.DISCOVER_RESPONSE | EventType.PING;
    senderId: string;
}