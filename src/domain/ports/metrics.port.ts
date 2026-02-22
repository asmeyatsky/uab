/**
 * Metrics Port
 * Interface for dashboard metrics and analytics.
 */

import type { ProtocolId } from '../protocols/protocol.types.ts';

export interface ProtocolMetric {
  readonly protocolId: ProtocolId;
  readonly requestCount: number;
  readonly errorCount: number;
  readonly avgLatencyMs: number;
  readonly uptime: number;
}

export interface DashboardStats {
  readonly totalAgents: number;
  readonly activeAgents: number;
  readonly totalRequests: number;
  readonly totalRevenue: number;
  readonly networkConfidence: number;
  readonly protocolMetrics: readonly ProtocolMetric[];
}

export interface TimeSeriesPoint {
  readonly timestamp: number;
  readonly value: number;
}

export interface NetworkActivity {
  readonly requests: readonly TimeSeriesPoint[];
  readonly errors: readonly TimeSeriesPoint[];
  readonly latency: readonly TimeSeriesPoint[];
}

export interface MetricsPort {
  getDashboardStats(): DashboardStats;
  getNetworkActivity(hours: number): NetworkActivity;
  getProtocolMetrics(protocolId: ProtocolId): ProtocolMetric;
}
