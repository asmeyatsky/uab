import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';
import type { DashboardStats, NetworkActivity, ProtocolMetric, TimeSeriesPoint } from '../../domain/ports/metrics.port.ts';

function generateTimeSeries(hours: number, baseValue: number, variance: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    points.push({
      timestamp: now - i * 3600000,
      value: Math.max(0, baseValue + (Math.random() - 0.5) * variance * 2),
    });
  }
  return points;
}

export const SEED_PROTOCOL_METRICS: Record<ProtocolId, ProtocolMetric> = {
  mcp: { protocolId: 'mcp', requestCount: 45230, errorCount: 12, avgLatencyMs: 45, uptime: 99.97 },
  a2a: { protocolId: 'a2a', requestCount: 28100, errorCount: 34, avgLatencyMs: 120, uptime: 99.88 },
  adk: { protocolId: 'adk', requestCount: 18400, errorCount: 8, avgLatencyMs: 210, uptime: 99.95 },
  acp: { protocolId: 'acp', requestCount: 12300, errorCount: 5, avgLatencyMs: 89, uptime: 99.96 },
  ucp: { protocolId: 'ucp', requestCount: 9800, errorCount: 18, avgLatencyMs: 156, uptime: 99.82 },
  ap2: { protocolId: 'ap2', requestCount: 8500, errorCount: 2, avgLatencyMs: 67, uptime: 99.99 },
  'visa-tap': { protocolId: 'visa-tap', requestCount: 15600, errorCount: 0, avgLatencyMs: 34, uptime: 100 },
  a2ui: { protocolId: 'a2ui', requestCount: 22100, errorCount: 45, avgLatencyMs: 78, uptime: 99.80 },
  'ag-ui': { protocolId: 'ag-ui', requestCount: 31200, errorCount: 22, avgLatencyMs: 52, uptime: 99.93 },
  toon: { protocolId: 'toon', requestCount: 4200, errorCount: 8, avgLatencyMs: 340, uptime: 99.81 },
};

export function getSeedDashboardStats(): DashboardStats {
  const protocolMetrics = Object.values(SEED_PROTOCOL_METRICS);
  return {
    totalAgents: 8,
    activeAgents: 6,
    totalRequests: protocolMetrics.reduce((sum, m) => sum + m.requestCount, 0),
    totalRevenue: 12847.50,
    networkConfidence: 97.2,
    protocolMetrics,
  };
}

export function getSeedNetworkActivity(hours: number): NetworkActivity {
  return {
    requests: generateTimeSeries(hours, 1200, 400),
    errors: generateTimeSeries(hours, 5, 4),
    latency: generateTimeSeries(hours, 95, 50),
  };
}
