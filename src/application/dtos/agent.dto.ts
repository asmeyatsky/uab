import type { AgentProtocolBinding, ProtocolId } from '../../domain/protocols/protocol.types.ts';
import type { AgentType } from '../../domain/entities/agent.ts';

export interface CreateAgentDTO {
  readonly name: string;
  readonly description: string;
  readonly type: AgentType;
  readonly prompt: string;
  readonly protocolBindings: readonly AgentProtocolBinding[];
  readonly capabilities?: readonly string[];
  readonly tags?: readonly string[];
}

export interface UpdateAgentDTO {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly prompt?: string;
  readonly protocolBindings?: readonly AgentProtocolBinding[];
  readonly capabilities?: readonly string[];
  readonly tags?: readonly string[];
}

export interface AgentSummaryDTO {
  readonly id: string;
  readonly name: string;
  readonly type: AgentType;
  readonly status: string;
  readonly protocolCount: number;
  readonly protocols: readonly ProtocolId[];
  readonly trustScore: number;
  readonly avatar: string;
  readonly verified: boolean;
}
