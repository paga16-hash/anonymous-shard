import {Encryptor} from "../Encryptor.js";
import * as crypto from 'crypto';

export class RSAEncryptor implements Encryptor {

    async encrypt(publicKey: string, data: any): Promise<string> {
        return crypto.publicEncrypt(publicKey,
            Buffer.from(JSON.stringify(data))
        ).toString('base64');
    }

    async decrypt(privateKey: string, encryptedData: string): Promise<string> {
        return JSON.parse(crypto.privateDecrypt(privateKey,
            Buffer.from(encryptedData, 'base64')
        ).toString('utf-8'));
    }
}