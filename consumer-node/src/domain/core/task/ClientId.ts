export interface ClientId {
    readonly value: string  // onion, peer id or public key
    readonly publicKey?: string
    //to consider also to add a public key
}