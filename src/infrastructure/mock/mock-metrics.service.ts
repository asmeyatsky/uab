/**
 * Mock Metrics Service
 * Provides simulated dashboard metrics and network activity.
 */

import type { MetricsPort, DashboardStats, NetworkActivity, ProtocolMetric } from '../../domain/ports/metrics.port.ts';
import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';
import { getSeedDashboardStats, getSeedNetworkActivity, SEED_PROTOCOL_METRICS } from '../data/seed-metrics.ts';

export class MockMetricsService implements MetricsPort {
  getDashboardStats(): DashboardStats {
    return getSeedDashboardStats();
  }

  getNetworkActivity(hours: number): NetworkActivity {
    return getSeedNetworkActivity(hours);
  }

  getProtocolMetrics(protocolId: ProtocolId): ProtocolMetric {
    return SEED_PROTOCOL_METRICS[protocolId] ?? {
      protocolId,
      requestCount: 0,
      errorCount: 0,
      avgLatencyMs: 0,
      uptime: 0,
    };
  }
}
