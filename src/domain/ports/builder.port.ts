/**
 * Builder Port
 * Interface for agent build process simulation.
 */

import type { Agent } from '../entities/agent.ts';

export type BuildStage = 'analyzing' | 'configuring' | 'validating' | 'generating' | 'testing' | 'complete' | 'error';

export interface BuildProgress {
  readonly stage: BuildStage;
  readonly progress: number;
  readonly message: string;
  readonly startedAt: number;
  readonly completedStages: readonly BuildStage[];
}

export interface BuildResult {
  readonly success: boolean;
  readonly agent: Agent;
  readonly config: Record<string, unknown>;
  readonly duration: number;
  readonly warnings: readonly string[];
}

export interface BuilderPort {
  startBuild(agent: Agent): Promise<BuildResult>;
  onProgress(callback: (progress: BuildProgress) => void): void;
}
