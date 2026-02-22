import {
  Cpu, Network, GitBranch, ShoppingCart, Store,
  CreditCard, ShieldCheck, Layout, Radio, FileSignature,
  type LucideIcon,
} from 'lucide-react';
import type { ProtocolId } from '../../../domain/protocols/protocol.types.ts';

const iconMap: Record<ProtocolId, LucideIcon> = {
  mcp: Cpu,
  a2a: Network,
  adk: GitBranch,
  acp: ShoppingCart,
  ucp: Store,
  ap2: CreditCard,
  'visa-tap': ShieldCheck,
  a2ui: Layout,
  'ag-ui': Radio,
  toon: FileSignature,
};

interface ProtocolIconProps {
  protocolId: ProtocolId;
  size?: number;
  color?: string;
  className?: string;
}

export function ProtocolIcon({ protocolId, size = 16, color, className }: ProtocolIconProps) {
  const Icon = iconMap[protocolId];
  if (!Icon) return null;
  return <Icon size={size} color={color} className={className} />;
}
