/**
 * ADK (Agent Development Kit) — Google
 * Code-first multi-agent framework. Sequential/Parallel/Loop workflows.
 */

export type ADKWorkflowType = 'sequential' | 'parallel' | 'loop' | 'dag' | 'custom';

export interface ADKWorkflowStep {
  readonly id: string;
  readonly name: string;
  readonly agentId?: string;
  readonly toolId?: string;
  readonly dependsOn: readonly string[];
  readonly config?: Record<string, unknown>;
}

export interface ADKWorkflow {
  readonly id: string;
  readonly name: string;
  readonly type: ADKWorkflowType;
  readonly steps: readonly ADKWorkflowStep[];
  readonly maxParallelism: number;
}

export interface ADKResourceLimits {
  readonly maxMemoryMB: number;
  readonly maxCPUPercent: number;
  readonly maxExecutionTimeMs: number;
  readonly maxTokensPerStep: number;
}

export interface ADKConfig {
  readonly workflows: readonly ADKWorkflow[];
  readonly executionEnvironment: 'local' | 'cloud' | 'hybrid';
  readonly resourceLimits: ADKResourceLimits;
  readonly loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  readonly callbackUrl?: string;
}
