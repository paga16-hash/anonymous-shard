export const bootstrapNodeSeedFromEnv = (n: number): string | undefined => {
    return process.env[`BOOTSTRAP_SEED_${n}`]
}

export const bootstrapAddresses = (): string[] => {
    return Object.keys(process.env).filter(k => k.startsWith('BOOTSTRAP_NODE_ADDRESS')).map(k => process.env[k]!)
}

export const mapBootstrapAddresses = (): Map<string, number> => {
    const bootstrapMap: Map<string, number> = new Map<string, number>();
    Object.keys(process.env)
        .filter((key) => key.startsWith('BOOTSTRAP_NODE_ADDRESS_'))
        .forEach((key) => {
            const index = key.split('_').pop(); // Extract the index (e.g., "1" or "2")
            const address = process.env[key];
            const port = parseInt(process.env[`BOOTSTRAP_NODE_PORT_${index}`] || '0', 10);

            if (address && port) {
                bootstrapMap.set(address, port);
            }
        });
    return bootstrapMap;
};
