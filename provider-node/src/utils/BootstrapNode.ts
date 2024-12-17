import * as process from "node:process";

export const bootstrapNodeSeedFromEnv = (n: number): string | undefined => {
    return process.env[`BOOTSTRAP_SEED_${n}`]
}

export const bootstrapAddresses = (): string[] => {
    return Object.keys(process.env).filter(k => k.startsWith('BOOTSTRAP_NODE_ADDRESS')).map(k => process.env[k]!)
}

export const mapBootstrapAddresses = (): Map<string, number> => {
    const bootstrapMap: Map<string, number> = new Map<string, number>();
    const keyPrefix = process.env.ANONYMOUS_MODE === 'true'
        ? 'BOOTSTRAP_NODE_ADDRESS_'
        : 'LOCAL_BOOTSTRAP_NODE_ADDRESS_';

    Object.keys(process.env)
        .filter((key) => key.startsWith(keyPrefix))
        .forEach((key) => {
            const index = key.split('_').pop();
            const address = process.env[key];
            const port = parseInt(process.env[`${keyPrefix.replace('ADDRESS', 'PORT')}${index}`] || '0', 10);

            if (address && port && (port.toString() !== process.env.PORT)) {
                bootstrapMap.set(address, port);
            }
        });
    /*if(process.env.NODE_ENV !== 'develop') {
        bootstrapMap.delete(
            process.env.HOST!
        )
    }*/
    return bootstrapMap;
};
