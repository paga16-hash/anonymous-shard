import { Encryptor } from '../Encryptor.js'
import * as crypto from 'crypto'

export class RSAEncryptor implements Encryptor {
  async decrypt(privateKey: string, encryptedData: string): Promise<string> {
    return JSON.parse(
      crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf-8')
    )
  }
}
