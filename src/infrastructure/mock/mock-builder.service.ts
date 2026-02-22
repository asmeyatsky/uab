/**
 * Mock Builder Service
 * Simulates agent build process with progress updates.
 */

import type { BuilderPort, BuildProgress, BuildResult, BuildStage } from '../../domain/ports/builder.port.ts';
import type { Agent } from '../../domain/entities/agent.ts';
import { generateConfig } from '../../domain/services/config-generator.service.ts';

const STAGES: { stage: BuildStage; message: string; duration: number }[] = [
  { stage: 'analyzing', message: 'Analyzing prompt and detecting intent...', duration: 1200 },
  { stage: 'configuring', message: 'Configuring protocol bindings...', duration: 1500 },
  { stage: 'validating', message: 'Validating protocol compatibility...', duration: 800 },
  { stage: 'generating', message: 'Generating agent configuration...', duration: 2000 },
  { stage: 'testing', message: 'Running simulated agent tests...', duration: 1800 },
  { stage: 'complete', message: 'Agent build complete!', duration: 0 },
];

export class MockBuilderService implements BuilderPort {
  private progressCallback: ((progress: BuildProgress) => void) | null = null;

  onProgress(callback: (progress: BuildProgress) => void): void {
    this.progressCallback = callback;
  }

  async startBuild(agent: Agent): Promise<BuildResult> {
    const startedAt = Date.now();
    const completedStages: BuildStage[] = [];

    for (const { stage, message, duration } of STAGES) {
      const progress: BuildProgress = {
        stage,
        progress: (STAGES.findIndex(s => s.stage === stage) / (STAGES.length - 1)) * 100,
        message,
        startedAt,
        completedStages: [...completedStages],
      };

      this.progressCallback?.(progress);

      if (duration > 0) {
        await new Promise(resolve => setTimeout(resolve, duration));
      }
      completedStages.push(stage);
    }

    const config = generateConfig(agent);

    return {
      success: true,
      agent: { ...agent, status: 'ready', updatedAt: Date.now() },
      config: config as unknown as Record<string, unknown>,
      duration: Date.now() - startedAt,
      warnings: agent.protocolBindings.length === 0 ? ['No protocols configured'] : [],
    };
  }
}
