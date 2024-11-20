export interface Node {

    start(): Promise<void>;

    stop(): Promise<void>;

    isRunning(): Promise<boolean>;

    subscribe(topic: string, listener: (data: any) => void): Promise<void>;

    publish(topic: string, data: any): Promise<void>;
}