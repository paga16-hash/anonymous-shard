import {providerNodeService} from "../../../index.js";
import {Metric} from "../../../domain/core/metric/Metric.js";

export const peerController = {
    getPeers: (): string[] => {
        return providerNodeService.getKnownPeers()
    },

    getPeerMetric: async (peerId: string): Promise<Metric> => {
        const metrics: Map<string, Metric> = await providerNodeService.getKnownMetrics()
        return metrics.get(peerId)!
    }
}

