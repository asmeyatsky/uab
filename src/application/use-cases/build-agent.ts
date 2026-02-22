/**
 * BuildAgent Use Case
 * Orchestrates the agent creation and build process.
 */

import type { AgentRepoPort } from '../../domain/ports/agent-repo.port.ts';
import type { BuilderPort, BuildProgress, BuildResult } from '../../domain/ports/builder.port.ts';
import type { CreateAgentDTO } from '../dtos/agent.dto.ts';
import { createAgent } from '../../domain/entities/agent.ts';
import { nanoid } from 'nanoid';
import { eventBus } from '../services/event-bus.ts';

export class BuildAgentUseCase {
  agentRepo: AgentRepoPort;
  builder: BuilderPort;

  constructor(agentRepo: AgentRepoPort, builder: BuilderPort) {
    this.agentRepo = agentRepo;
    this.builder = builder;
  }

  async execute(
    dto: CreateAgentDTO,
    onProgress?: (progress: BuildProgress) => void,
  ): Promise<BuildResult> {
    const agent = createAgent({
      id: nanoid(),
      name: dto.name,
      description: dto.description,
      type: dto.type,
      prompt: dto.prompt,
      protocolBindings: [...dto.protocolBindings],
      capabilities: dto.capabilities ? [...dto.capabilities] : [],
      tags: dto.tags ? [...dto.tags] : [],
      status: 'building',
    });

    this.agentRepo.save(agent);
    eventBus.publish('agent:build-started', { agentId: agent.id, name: agent.name });

    if (onProgress) {
      this.builder.onProgress(onProgress);
    }

    const result = await this.builder.startBuild(agent);

    this.agentRepo.save(result.agent);
    eventBus.publish('agent:build-completed', {
      agentId: result.agent.id,
      success: result.success,
      duration: result.duration,
    });

    return result;
  }
}
