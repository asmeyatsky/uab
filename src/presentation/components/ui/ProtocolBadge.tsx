import { clsx } from 'clsx';
import { useProtocolRegistry } from '../../hooks/useProtocolRegistry.ts';
import type { ProtocolId } from '../../../domain/protocols/protocol.types.ts';

interface ProtocolBadgeProps {
  protocolId: ProtocolId;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function ProtocolBadge({ protocolId, size = 'sm', className }: ProtocolBadgeProps) {
  const { getById } = useProtocolRegistry();
  const spec = getById(protocolId);

  if (!spec) return null;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border font-mono font-medium',
        sizeMap[size],
        className,
      )}
      style={{
        borderColor: `${spec.metadata.color}40`,
        backgroundColor: `${spec.metadata.color}15`,
        color: spec.metadata.color,
      }}
    >
      {spec.metadata.shortName}
    </span>
  );
}
