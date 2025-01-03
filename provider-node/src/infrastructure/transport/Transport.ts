import { Socket } from 'net'

export interface Transport {
    listen(address: string, port: number): Promise<void>

    dial(address: string): Promise<Socket | undefined>
}
