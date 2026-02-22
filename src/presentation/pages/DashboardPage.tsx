import { useDashboard } from '../hooks/useDashboard.ts';
import { StatsGrid } from '../components/dashboard/StatsGrid.tsx';
import { ProtocolMetricsPanel } from '../components/dashboard/ProtocolMetricsPanel.tsx';
import { NetworkActivityChart } from '../components/dashboard/NetworkActivityChart.tsx';
import { FleetOverview } from '../components/dashboard/FleetOverview.tsx';
import { EventStream } from '../components/dashboard/EventStream.tsx';

export function DashboardPage() {
  const { stats, networkActivity } = useDashboard();

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Command Center
          </span>
        </h1>
        <p className="mt-1 text-sm text-gray-400">Real-time protocol metrics and agent fleet status</p>
      </div>

      <div className="space-y-6">
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkActivityChart activity={networkActivity} />
          <ProtocolMetricsPanel metrics={stats.protocolMetrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FleetOverview />
          <EventStream />
        </div>
      </div>
    </div>
  );
}
