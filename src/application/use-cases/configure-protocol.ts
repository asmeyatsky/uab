/**
 * ConfigureProtocol Use Case
 * Manages protocol configuration for agents.
 */

import type { ProtocolRegistryPort } from '../../domain/ports/protocol-registry.port.ts';
import type { AgentRepoPort } from '../../domain/ports/agent-repo.port.ts';
import type { ProtocolId, AgentProtocolBinding, ProtocolRecommendation } from '../../domain/protocols/protocol.types.ts';
import { addProtocolBinding, removeProtocolBinding } from '../../domain/entities/agent.ts';
import { recommendProtocols } from '../../domain/services/compatibility.service.ts';
import { generateBindingConfig, mergeConfigs } from '../../domain/services/config-generator.service.ts';
import { eventBus } from '../services/event-bus.ts';

export class ConfigureProtocolUseCase {
  registry: ProtocolRegistryPort;
  agentRepo: AgentRepoPort;

  constructor(registry: ProtocolRegistryPort, agentRepo: AgentRepoPort) {
    this.registry = registry;
    this.agentRepo = agentRepo;
  }

  getRecommendations(prompt: string, existingProtocols: ProtocolId[]): ProtocolRecommendation[] {
    return recommendProtocols(prompt, existingProtocols);
  }

  getDefaultConfig(protocolId: ProtocolId): Record<string, unknown> {
    const spec = this.registry.getById(protocolId);
    return spec ? { ...spec.defaultConfig } : {};
  }

  enableProtocol(agentId: string, protocolId: ProtocolId, config?: Record<string, unknown>): void {
    const agent = this.agentRepo.getById(agentId);
    if (!agent) return;

    const spec = this.registry.getById(protocolId);
    const defaultConfig = spec?.defaultConfig ?? {};
    const mergedConfig = config ? mergeConfigs(defaultConfig, config) : defaultConfig;
    const version = spec?.metadata.version ?? '0.0.0';

    const binding = generateBindingConfig(protocolId, mergedConfig, version);
    const updated = addProtocolBinding(agent, binding);
    this.agentRepo.save(updated);

    eventBus.publish('protocol:enabled', { agentId, protocolId });
  }

  disableProtocol(agentId: string, protocolId: ProtocolId): void {
    const agent = this.agentRepo.getById(agentId);
    if (!agent) return;

    const updated = removeProtocolBinding(agent, protocolId);
    this.agentRepo.save(updated);

    eventBus.publish('protocol:disabled', { agentId, protocolId });
  }

  updateConfig(agentId: string, protocolId: ProtocolId, config: Record<string, unknown>): void {
    const agent = this.agentRepo.getById(agentId);
    if (!agent) return;

    const existingBinding = agent.protocolBindings.find(b => b.protocolId === protocolId);
    if (!existingBinding) return;

    const newBinding: AgentProtocolBinding = {
      ...existingBinding,
      config: mergeConfigs(existingBinding.config, config),
    };

    const updated = addProtocolBinding(agent, newBinding);
    this.agentRepo.save(updated);

    eventBus.publish('protocol:config-updated', { agentId, protocolId });
  }
}
