import { Users, Activity, DollarSign, Shield, Cpu } from 'lucide-react';
import { MetricCard } from '../ui/MetricCard.tsx';
import type { DashboardStatsDTO } from '../../../application/dtos/dashboard.dto.ts';

interface StatsGridProps {
  stats: DashboardStatsDTO;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        label="Total Agents"
        value={stats.totalAgents}
        change="+2 this week"
        changePositive
        icon={<Users size={18} />}
        color="#00f3ff"
      />
      <MetricCard
        label="Active Agents"
        value={stats.activeAgents}
        icon={<Activity size={18} />}
        color="#10B981"
      />
      <MetricCard
        label="Total Requests"
        value={stats.totalRequests.toLocaleString()}
        change="+12.4% MoM"
        changePositive
        icon={<Cpu size={18} />}
        color="#8B5CF6"
      />
      <MetricCard
        label="Revenue"
        value={stats.totalRevenue}
        change="+8.2% MoM"
        changePositive
        icon={<DollarSign size={18} />}
        color="#F59E0B"
      />
      <MetricCard
        label="Network Confidence"
        value={`${stats.networkConfidence}%`}
        icon={<Shield size={18} />}
        color="#00ff88"
      />
    </div>
  );
}
