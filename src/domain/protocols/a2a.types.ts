/**
 * A2A v0.3 (Agent-to-Agent) — Google/Linux Foundation
 * Agent discovery (Agent Cards), task mgmt, collaboration. 150+ orgs.
 */

export interface A2AAgentCard {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly capabilities: readonly A2ACapability[];
  readonly skills: readonly A2ASkill[];
  readonly authentication: A2AAuthConfig;
}

export interface A2ACapability {
  readonly id: string;
  readonly name: string;
  readonly streaming: boolean;
  readonly pushNotifications: boolean;
}

export interface A2ASkill {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly inputModes: readonly string[];
  readonly outputModes: readonly string[];
}

export interface A2AAuthConfig {
  readonly type: 'none' | 'api-key' | 'oauth2' | 'jwt';
  readonly credentials?: Record<string, string>;
}

export interface A2ATaskConfig {
  readonly maxConcurrentTasks: number;
  readonly taskTimeout: number;
  readonly retryPolicy: { maxRetries: number; backoff: 'linear' | 'exponential' };
}

export interface A2AConfig {
  readonly agentCard: A2AAgentCard;
  readonly taskConfig: A2ATaskConfig;
  readonly discoveryEndpoint: string;
  readonly communicationPort: number;
  readonly securityLevel: 'basic' | 'enhanced' | 'strict';
}
