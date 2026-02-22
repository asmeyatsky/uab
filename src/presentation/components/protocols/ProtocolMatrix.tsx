import { clsx } from 'clsx';
import { useProtocolRegistry } from '../../hooks/useProtocolRegistry.ts';
import { getCompatibilityMatrix } from '../../../domain/services/compatibility.service.ts';
import { ProtocolIcon } from '../ui/ProtocolIcon.tsx';
import { GlassPanel } from '../ui/GlassPanel.tsx';
export function ProtocolMatrix() {
  const { allProtocols } = useProtocolRegistry();
  const matrix = getCompatibilityMatrix();
  const ids = allProtocols.map(p => p.metadata.id);

  return (
    <GlassPanel padding="lg">
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Protocol Compatibility Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2" />
              {allProtocols.map(p => (
                <th key={p.metadata.id} className="p-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ProtocolIcon protocolId={p.metadata.id} size={14} color={p.metadata.color} />
                    <span className="font-mono text-[10px] text-gray-400">{p.metadata.shortName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ids.map(rowId => (
              <tr key={rowId}>
                <td className="p-2 text-right">
                  <span className="font-mono text-gray-400">{allProtocols.find(p => p.metadata.id === rowId)?.metadata.shortName}</span>
                </td>
                {ids.map(colId => {
                  const compatible = matrix[rowId]?.[colId] ?? false;
                  const isSelf = rowId === colId;
                  return (
                    <td key={colId} className="p-1 text-center">
                      <div
                        className={clsx(
                          'mx-auto h-6 w-6 rounded',
                          isSelf ? 'bg-white/10' : compatible ? 'bg-green-500/20' : 'bg-white/[0.02]',
                        )}
                      >
                        {!isSelf && compatible && (
                          <span className="text-green-400 text-xs">✓</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
