/**
 * GetDashboardStats Use Case
 * Aggregates dashboard metrics with protocol metadata.
 */

import type { MetricsPort } from '../../domain/ports/metrics.port.ts';
import type { ProtocolRegistryPort } from '../../domain/ports/protocol-registry.port.ts';
import type { DashboardStatsDTO, ProtocolMetricDTO, NetworkActivityDTO } from '../dtos/dashboard.dto.ts';

export class GetDashboardStatsUseCase {
  metrics: MetricsPort;
  registry: ProtocolRegistryPort;

  constructor(metrics: MetricsPort, registry: ProtocolRegistryPort) {
    this.metrics = metrics;
    this.registry = registry;
  }

  getStats(): DashboardStatsDTO {
    const stats = this.metrics.getDashboardStats();

    const protocolMetrics: ProtocolMetricDTO[] = stats.protocolMetrics.map(m => {
      const spec = this.registry.getById(m.protocolId);
      return {
        protocolId: m.protocolId,
        name: spec?.metadata.shortName ?? m.protocolId,
        color: spec?.metadata.color ?? '#888',
        requestCount: m.requestCount,
        errorRate: m.requestCount > 0 ? (m.errorCount / m.requestCount) * 100 : 0,
        avgLatencyMs: m.avgLatencyMs,
        uptime: m.uptime,
      };
    });

    return {
      totalAgents: stats.totalAgents,
      activeAgents: stats.activeAgents,
      totalRequests: stats.totalRequests,
      totalRevenue: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      networkConfidence: stats.networkConfidence,
      protocolMetrics,
    };
  }

  getNetworkActivity(hours: number = 24): NetworkActivityDTO {
    const activity = this.metrics.getNetworkActivity(hours);
    return {
      requests: [...activity.requests],
      errors: [...activity.errors],
      latency: [...activity.latency],
    };
  }
}
