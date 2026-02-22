import { useContext } from 'react';
import { ContainerContext } from './container-context.ts';
import type { Container } from '../../infrastructure/di/container.ts';

export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (!container) throw new Error('useContainer must be used within ContainerProvider');
  return container;
}
