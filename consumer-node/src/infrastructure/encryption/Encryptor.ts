export interface Encryptor {
    encrypt(publicKey: string, data: any): Promise<string>
    decrypt(privateKey: string, data: string): Promise<string>
}