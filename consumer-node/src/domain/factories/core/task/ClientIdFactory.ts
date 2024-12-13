import {ClientId} from "../../../core/task/ClientId.js";

export class ClientIdFactory {
    static idFrom(value: string, publicKey: string): ClientId {
        return {
            value: value,
            publicKey: publicKey
        }
    }
}