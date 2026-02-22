import { useCallback } from 'react';
import { useContainer } from '../store/useContainer.ts';
import { useAppStore } from '../store/app-store.ts';
import { BuildAgentUseCase } from '../../application/use-cases/build-agent.ts';
import type { AgentProtocolBinding } from '../../domain/protocols/protocol.types.ts';

export function useBuildAgent() {
  const { agentRepo, builder, protocolRegistry } = useContainer();
  const store = useAppStore();

  const buildAgent = useCallback(async () => {
    const { prompt, name, description, type, selectedProtocols, protocolConfigs } = store.builder;

    const bindings: AgentProtocolBinding[] = selectedProtocols.map(protocolId => {
      const spec = protocolRegistry.getById(protocolId);
      return {
        protocolId,
        enabled: true,
        config: protocolConfigs[protocolId] ?? spec?.defaultConfig ?? {},
        version: spec?.metadata.version ?? '0.0.0',
      };
    });

    const useCase = new BuildAgentUseCase(agentRepo, builder);

    store.setIsBuilding(true);
    store.setBuildProgress(null);

    try {
      const result = await useCase.execute(
        { name: name || 'Untitled Agent', description, type, prompt, protocolBindings: bindings },
        (progress) => store.setBuildProgress(progress),
      );

      store.setBuiltAgent(result.agent);
      store.setGeneratedConfig(result.config);
      return result;
    } finally {
      store.setIsBuilding(false);
    }
  }, [store, agentRepo, builder, protocolRegistry]);

  return { buildAgent };
}
