import si from 'systeminformation';

export async function getSystemMetrics() {
    const memory = await si.mem();
    const cpu = await si.currentLoad();
    return {
        memory: {
            total: memory.total,
            free: memory.free,
            used: memory.used,
        },
        cpu: {
            load: cpu.currentLoad,
            cores: cpu.cpus.length,
        }
    };
}