import {DiscoveryEvent} from "../../../events/discovery/DiscoveryEvent.js";
import {EventType} from "../../../../utils/EventType.js";
import {DomainEventIdFactory} from "../DomainEventIdFactory.js";
import {Topic} from "../../../../utils/Topic.js";
import {DiscoveryResponseEvent} from "../../../events/discovery/DiscoveryResponseEvent.js";

export class DiscoveryEventFactory {
    static discoveryEventFrom(senderId: string): DiscoveryEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.PEERS,
            timestamp: new Date(),
            type: EventType.DISCOVER,
            senderId: senderId
        }
    }

    static discoveryResponseEventFrom(senderId: string, peers: string[]): DiscoveryResponseEvent {
        return {
            id: DomainEventIdFactory.newId(),
            topic: Topic.PEERS,
            timestamp: new Date(),
            type: EventType.DISCOVER_RESPONSE,
            senderId: senderId,
            peers: peers
        }
    }
}