import { useAppStore } from '../../store/app-store.ts';
import { JsonPreview } from '../ui/JsonPreview.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import { GlassPanel } from '../ui/GlassPanel.tsx';

export function ConfigPreview() {
  const { generatedConfig, builtAgent } = useAppStore(s => s.builder);

  if (!generatedConfig) return null;

  return (
    <div className="space-y-4">
      {builtAgent && (
        <GlassPanel>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{builtAgent.avatar}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-100">{builtAgent.name}</h3>
              <p className="text-xs text-gray-400">{builtAgent.type} agent · {builtAgent.protocolBindings.length} protocols</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {builtAgent.protocolBindings.map(b => (
              <ProtocolBadge key={b.protocolId} protocolId={b.protocolId} size="xs" />
            ))}
          </div>
        </GlassPanel>
      )}
      <JsonPreview data={generatedConfig} title="Generated Agent Configuration" maxHeight="500px" />
    </div>
  );
}
