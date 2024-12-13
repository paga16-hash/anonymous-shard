export interface Encryptor {
    encrypt(publicKey: string, data: any): Promise<string>
}