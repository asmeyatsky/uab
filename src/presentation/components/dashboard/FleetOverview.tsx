import { useContainer } from '../../store/useContainer.ts';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import { StatusPulse } from '../ui/StatusPulse.tsx';
import { TrustScoreIndicator } from '../ui/TrustScoreIndicator.tsx';

export function FleetOverview() {
  const { agentRepo } = useContainer();
  const agents = agentRepo.getAll().filter(a => a.status === 'deployed' || a.status === 'ready');

  return (
    <GlassPanel>
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Agent Fleet</h3>
      <div className="space-y-3">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
          >
            <span className="text-xl shrink-0">{agent.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-200 truncate">{agent.name}</span>
                <StatusPulse status={agent.status === 'deployed' ? 'active' : 'degraded'} />
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {agent.protocolBindings.filter(b => b.enabled).slice(0, 3).map(b => (
                  <ProtocolBadge key={b.protocolId} protocolId={b.protocolId} size="xs" />
                ))}
                {agent.protocolBindings.filter(b => b.enabled).length > 3 && (
                  <span className="text-[10px] text-gray-500">+{agent.protocolBindings.filter(b => b.enabled).length - 3}</span>
                )}
              </div>
            </div>
            <TrustScoreIndicator score={agent.trustScore} size="sm" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
