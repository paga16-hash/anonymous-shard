import { Encryptor } from '../Encryptor.js'
import * as crypto from 'crypto'

export class RSAEncryptor implements Encryptor {
    async encrypt(publicKey: string, data: any): Promise<string> {
        return crypto.publicEncrypt(publicKey, Buffer.from(JSON.stringify(data))).toString('base64')
    }
}
