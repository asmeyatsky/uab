import { useCallback, useMemo } from 'react';
import { useContainer } from '../store/useContainer.ts';
import { useAppStore } from '../store/app-store.ts';
import { ConfigureProtocolUseCase } from '../../application/use-cases/configure-protocol.ts';
import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';

export function useProtocolConfig() {
  const { protocolRegistry, agentRepo } = useContainer();
  const { prompt, selectedProtocols } = useAppStore(s => s.builder);

  const useCase = useMemo(
    () => new ConfigureProtocolUseCase(protocolRegistry, agentRepo),
    [protocolRegistry, agentRepo]
  );

  const recommendations = useMemo(
    () => useCase.getRecommendations(prompt, selectedProtocols),
    [useCase, prompt, selectedProtocols]
  );

  const getDefaultConfig = useCallback(
    (protocolId: ProtocolId) => useCase.getDefaultConfig(protocolId),
    [useCase]
  );

  return { recommendations, getDefaultConfig };
}
