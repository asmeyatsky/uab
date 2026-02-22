import { useMemo } from 'react';
import { useContainer } from '../store/useContainer.ts';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.ts';

export function useDashboard() {
  const { metrics, protocolRegistry } = useContainer();

  const useCase = useMemo(
    () => new GetDashboardStatsUseCase(metrics, protocolRegistry),
    [metrics, protocolRegistry]
  );

  const stats = useMemo(() => useCase.getStats(), [useCase]);
  const networkActivity = useMemo(() => useCase.getNetworkActivity(24), [useCase]);

  return { stats, networkActivity };
}
