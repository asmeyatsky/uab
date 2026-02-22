/**
 * TrustScore Value Object
 * Composite trust metric for agents, combining multiple dimensions.
 */

export interface TrustScore {
  readonly overall: number;
  readonly reliability: number;
  readonly security: number;
  readonly performance: number;
  readonly compliance: number;
}

export function createTrustScore(partial?: Partial<TrustScore>): TrustScore {
  const score = {
    overall: 0,
    reliability: 0,
    security: 0,
    performance: 0,
    compliance: 0,
    ...partial,
  };
  return { ...score, overall: computeOverall(score) };
}

function computeOverall(score: Omit<TrustScore, 'overall'>): number {
  const weights = { reliability: 0.3, security: 0.3, performance: 0.2, compliance: 0.2 };
  return Math.round(
    score.reliability * weights.reliability +
    score.security * weights.security +
    score.performance * weights.performance +
    score.compliance * weights.compliance
  );
}

export function getTrustLevel(score: TrustScore): 'critical' | 'low' | 'medium' | 'high' | 'excellent' {
  if (score.overall >= 90) return 'excellent';
  if (score.overall >= 70) return 'high';
  if (score.overall >= 50) return 'medium';
  if (score.overall >= 30) return 'low';
  return 'critical';
}

export function getTrustColor(score: TrustScore): string {
  const level = getTrustLevel(score);
  const colors: Record<string, string> = {
    excellent: '#00ff88',
    high: '#00f3ff',
    medium: '#ffaa00',
    low: '#ff6600',
    critical: '#ff0044',
  };
  return colors[level];
}
