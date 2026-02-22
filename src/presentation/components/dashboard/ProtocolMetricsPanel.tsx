import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolIcon } from '../ui/ProtocolIcon.tsx';
import type { ProtocolMetricDTO } from '../../../application/dtos/dashboard.dto.ts';

interface ProtocolMetricsPanelProps {
  metrics: readonly ProtocolMetricDTO[];
}

export function ProtocolMetricsPanel({ metrics }: ProtocolMetricsPanelProps) {
  const maxRequests = Math.max(...metrics.map(m => m.requestCount));

  return (
    <GlassPanel>
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Protocol Metrics</h3>
      <div className="space-y-3">
        {metrics
          .slice()
          .sort((a, b) => b.requestCount - a.requestCount)
          .map((metric) => (
          <div key={metric.protocolId} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <ProtocolIcon protocolId={metric.protocolId} size={14} color={metric.color} />
                <span className="text-xs font-medium text-gray-300">{metric.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                <span>{metric.requestCount.toLocaleString()} req</span>
                <span>{metric.avgLatencyMs}ms</span>
                <span className="text-green-400">{metric.uptime}%</span>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(metric.requestCount / maxRequests) * 100}%`,
                  backgroundColor: metric.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
