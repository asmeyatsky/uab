import { clsx } from 'clsx';

interface StatusPulseProps {
  status: 'active' | 'degraded' | 'inactive' | 'building';
  size?: 'sm' | 'md';
  label?: string;
}

const statusColors = {
  active: 'bg-green-500',
  degraded: 'bg-yellow-500',
  inactive: 'bg-gray-500',
  building: 'bg-primary',
};

export function StatusPulse({ status, size = 'sm', label }: StatusPulseProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="relative flex">
        <span className={clsx(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          statusColors[status],
          status === 'inactive' && 'animate-none',
        )} />
        <span className={clsx(
          'relative inline-flex rounded-full',
          statusColors[status],
          size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
        )} />
      </span>
      {label && <span className="text-xs text-gray-400 capitalize">{label ?? status}</span>}
    </div>
  );
}
