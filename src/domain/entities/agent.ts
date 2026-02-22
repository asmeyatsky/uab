/**
 * Agent Entity
 * Core aggregate representing an AI agent with protocol bindings.
 * Immutable — state changes produce new instances.
 */

import type { AgentProtocolBinding, ProtocolId } from '../protocols/protocol.types.ts';
import type { TrustScore } from '../value-objects/trust-score.ts';
import type { AgentPricing } from '../value-objects/agent-pricing.ts';

export type AgentStatus = 'draft' | 'building' | 'ready' | 'deployed' | 'paused' | 'error';
export type AgentType = 'assistant' | 'commerce' | 'analytics' | 'orchestrator' | 'creative' | 'security';

export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: AgentType;
  readonly status: AgentStatus;
  readonly prompt: string;
  readonly protocolBindings: readonly AgentProtocolBinding[];
  readonly trustScore: TrustScore;
  readonly pricing: AgentPricing;
  readonly capabilities: readonly string[];
  readonly tags: readonly string[];
  readonly avatar: string;
  readonly verified: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export function createAgent(partial: Partial<Agent> & Pick<Agent, 'id' | 'name'>): Agent {
  return {
    description: '',
    type: 'assistant',
    status: 'draft',
    prompt: '',
    protocolBindings: [],
    trustScore: { overall: 0, reliability: 0, security: 0, performance: 0, compliance: 0 },
    pricing: { amount: 0, currency: 'USD', model: 'per-request' },
    capabilities: [],
    tags: [],
    avatar: '🤖',
    verified: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...partial,
  };
}

export function updateAgent(agent: Agent, changes: Partial<Agent>): Agent {
  return { ...agent, ...changes, updatedAt: Date.now() };
}

export function addProtocolBinding(agent: Agent, binding: AgentProtocolBinding): Agent {
  const filtered = agent.protocolBindings.filter(b => b.protocolId !== binding.protocolId);
  return updateAgent(agent, { protocolBindings: [...filtered, binding] });
}

export function removeProtocolBinding(agent: Agent, protocolId: ProtocolId): Agent {
  return updateAgent(agent, {
    protocolBindings: agent.protocolBindings.filter(b => b.protocolId !== protocolId),
  });
}

export function hasProtocol(agent: Agent, protocolId: ProtocolId): boolean {
  return agent.protocolBindings.some(b => b.protocolId === protocolId && b.enabled);
}

export function getEnabledProtocols(agent: Agent): ProtocolId[] {
  return agent.protocolBindings.filter(b => b.enabled).map(b => b.protocolId);
}
