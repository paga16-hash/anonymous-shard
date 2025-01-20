import type { Peer } from '../domain/core/Peer'

export const composePeer = (id: string): Peer => {
  return {
    id: id
  }
}

export const composeMetricMessage = (metric: any): string => {
  const memoryUsed = metric.memory?.used || 'N/A'
  const memoryTotal = metric.memory?.total || 'N/A'
  const memoryPercentage =
    metric.memory?.used && metric.memory?.total
      ? ((metric.memory.used / metric.memory.total) * 100).toFixed(2) + '%'
      : 'N/A'

  const cpuLoad = metric.cpu?.load || 'N/A'
  const cpuModel = metric.cpu?.model || 'N/A'

  const gpuDetails = metric.gpu?.length
    ? metric.gpu
        .map((gpu: any) => `${gpu.model || 'Unknown model'} with ${gpu.memoryTotal || 'N/A'} memory`)
        .join('\n')
    : 'No GPU information available'

  return (
    `Memory: ${memoryUsed} used out of ${memoryTotal} total\n` +
    `Memory percentage: ${memoryPercentage}\n` +
    `CPU: ${cpuLoad}% load on ${cpuModel}\n` +
    `GPU:\n${gpuDetails}`
  )
}
