import {EventType} from "../../../utils/EventType.js";
import {PeerDiscoveryEvent} from "./PeerDiscoveryEvent.js";

export interface DiscoveryResponseEvent extends PeerDiscoveryEvent {
    type: EventType.DISCOVER_RESPONSE;
    peers: string[];
}
