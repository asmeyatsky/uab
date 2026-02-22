/**
 * Config Generator Service
 * Generates protocol-specific configuration JSON from agent bindings.
 */

import type { Agent } from '../entities/agent.ts';
import type { AgentProtocolBinding, ProtocolId } from '../protocols/protocol.types.ts';

export interface GeneratedConfig {
  readonly agentId: string;
  readonly agentName: string;
  readonly generatedAt: number;
  readonly protocols: Record<string, Record<string, unknown>>;
  readonly metadata: {
    readonly totalProtocols: number;
    readonly protocolIds: ProtocolId[];
  };
}

export function generateConfig(agent: Agent): GeneratedConfig {
  const enabledBindings = agent.protocolBindings.filter(b => b.enabled);
  const protocols: Record<string, Record<string, unknown>> = {};

  for (const binding of enabledBindings) {
    protocols[binding.protocolId] = {
      version: binding.version,
      ...binding.config,
    };
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    generatedAt: Date.now(),
    protocols,
    metadata: {
      totalProtocols: enabledBindings.length,
      protocolIds: enabledBindings.map(b => b.protocolId),
    },
  };
}

export function generateBindingConfig(
  protocolId: ProtocolId,
  config: Record<string, unknown>,
  version: string
): AgentProtocolBinding {
  return {
    protocolId,
    enabled: true,
    config,
    version,
  };
}

export function mergeConfigs(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}
