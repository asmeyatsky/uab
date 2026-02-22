import { useMemo, type ReactNode } from 'react';
import { createContainer } from '../../infrastructure/di/container.ts';
import { ContainerContext } from './container-context.ts';

export { ContainerContext };

export function ContainerProvider({ children }: { children: ReactNode }) {
  const container = useMemo(() => createContainer(), []);
  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
}
