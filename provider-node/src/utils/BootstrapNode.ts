export const bootstrapNodeSeedFromEnv = (n: number): string | undefined => {
    return process.env[`BOOTSTRAP_SEED_${n}`]
}

export const bootstrapAddresses = (): string[] => {
    return Object.keys(process.env).filter(k => k.startsWith('BOOTSTRAP_NODE_ADDRESS')).map(k => process.env[k]!)
}