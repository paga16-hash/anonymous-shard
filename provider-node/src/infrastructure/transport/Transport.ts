import {Socket} from "net";

export interface Transport {
    listen(address: string): Promise<void>;

    dial(address: string): Promise<Socket | undefined>;
}