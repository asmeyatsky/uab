import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';

export interface DashboardStatsDTO {
  readonly totalAgents: number;
  readonly activeAgents: number;
  readonly totalRequests: number;
  readonly totalRevenue: string;
  readonly networkConfidence: number;
  readonly protocolMetrics: readonly ProtocolMetricDTO[];
}

export interface ProtocolMetricDTO {
  readonly protocolId: ProtocolId;
  readonly name: string;
  readonly color: string;
  readonly requestCount: number;
  readonly errorRate: number;
  readonly avgLatencyMs: number;
  readonly uptime: number;
}

export interface NetworkActivityDTO {
  readonly requests: readonly { timestamp: number; value: number }[];
  readonly errors: readonly { timestamp: number; value: number }[];
  readonly latency: readonly { timestamp: number; value: number }[];
}
