/**
 * Agent Repository Port
 * Interface for agent persistence. Adapters implement this in infrastructure layer.
 */

import type { Agent, AgentStatus, AgentType } from '../entities/agent.ts';

export interface AgentFilter {
  readonly status?: AgentStatus;
  readonly type?: AgentType;
  readonly search?: string;
  readonly protocols?: readonly string[];
  readonly tags?: readonly string[];
}

export interface AgentRepoPort {
  getAll(): Agent[];
  getById(id: string): Agent | undefined;
  save(agent: Agent): void;
  delete(id: string): void;
  filter(filter: AgentFilter): Agent[];
}
