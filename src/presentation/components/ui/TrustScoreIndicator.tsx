import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import { getTrustLevel, getTrustColor, type TrustScore } from '../../../domain/value-objects/trust-score.ts';

interface TrustScoreIndicatorProps {
  score: TrustScore | number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TrustScoreIndicator({ score, size = 'md', showLabel = false, className }: TrustScoreIndicatorProps) {
  const overall = typeof score === 'number' ? score : score.overall;
  const trustScore = typeof score === 'number'
    ? { overall: score, reliability: score, security: score, performance: score, compliance: score }
    : score;
  const level = getTrustLevel(trustScore);
  const color = getTrustColor(trustScore);

  const sizeMap = {
    sm: { icon: 12, text: 'text-xs', gap: 'gap-1' },
    md: { icon: 14, text: 'text-sm', gap: 'gap-1.5' },
    lg: { icon: 18, text: 'text-base', gap: 'gap-2' },
  };

  const s = sizeMap[size];

  return (
    <div className={clsx('inline-flex items-center', s.gap, className)}>
      <Shield size={s.icon} style={{ color }} />
      <span className={clsx('font-mono font-semibold', s.text)} style={{ color }}>
        {overall}
      </span>
      {showLabel && (
        <span className={clsx('capitalize text-gray-400', s.text)}>{level}</span>
      )}
    </div>
  );
}
