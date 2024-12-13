export interface Encryptor {
    decrypt(privateKey: string, data: string): Promise<string>
}