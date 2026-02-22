import { type ReactNode } from 'react';
import { GlassPanel } from './GlassPanel.tsx';
import { clsx } from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export function MetricCard({ label, value, change, changePositive, icon, color, className }: MetricCardProps) {
  return (
    <GlassPanel
      className={clsx('relative overflow-hidden', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold font-mono" style={{ color: color ?? '#fff' }}>
            {value}
          </p>
          {change && (
            <p className={clsx('mt-1 text-xs font-medium', changePositive ? 'text-green-400' : 'text-red-400')}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-white/5 p-2" style={{ color: color ?? '#00f3ff' }}>
            {icon}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
