/**
 * AgentOrchestrationUseCases - Application Layer
 * 
 * Contains use cases for advanced agent orchestration and planning
 */

import { AgentOrchestratorService } from '../domain/services/AgentOrchestratorService.js';

export class CreateAgenticPlanUseCase {
  /**
   * @param {AgentOrchestratorService} orchestratorService - Service for agent orchestration
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(orchestratorService, agentRepository) {
    this.orchestratorService = orchestratorService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to create an agentic plan
   * @param {Object} request - Request object containing plan details
   * @param {string} request.goal - High-level goal for the agent
   * @param {string} request.agentId - ID of the agent to create a plan for (optional)
   * @param {Array<string>} request.availableTools - List of available tools (optional, will use agent's tools if provided)
   * @param {string} request.frameworkType - Framework type for orchestration (optional, will infer from agent)
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.goal) {
        return {
          success: false,
          errors: ['Goal is required']
        };
      }

      let availableTools = request.availableTools || [];
      let frameworkType = request.frameworkType || 'ADK';

      // If agent ID is provided, get the agent's tools and framework
      if (request.agentId) {
        const agent = await this.agentRepository.findById(request.agentId);
        if (!agent) {
          return {
            success: false,
            errors: ['Agent not found']
          };
        }

        // Extract tools from agent configuration
        availableTools = this._extractToolsFromAgent(agent);
        frameworkType = this._inferFrameworkTypeFromAgent(agent);
      }

      // Create the plan using orchestrator service
      const plan = this.orchestratorService.createAgenticPlan(
        request.goal,
        availableTools,
        frameworkType
      );

      return {
        success: true,
        plan: plan,
        message: 'Agentic plan created successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Extracts tools from an agent
   * @private
   */
  _extractToolsFromAgent(agent) {
    // This is a simplified approach - in a real implementation, 
    // you would extract tools from the agent's framework configurations
    const tools = [];
    
    for (const config of agent.frameworkConfigs) {
      if (config.frameworkType === 'MCP' && config.configData.tools) {
        tools.push(...config.configData.tools);
      } else if (config.frameworkType === 'ADK' && config.configData.tools) {
        tools.push(...config.configData.tools);
      }
    }
    
    return tools.length > 0 ? tools : ['general_tools'];
  }

  /**
   * Infers framework type from an agent
   * @private
   */
  _inferFrameworkTypeFromAgent(agent) {
    // Prefer ADK for orchestration, fallback to first available framework
    if (agent.hasFramework('ADK')) return 'ADK';
    if (agent.hasFramework('A2A')) return 'A2A';
    if (agent.hasFramework('MCP')) return 'MCP';
    return 'ADK'; // Default to ADK
  }
}

export class EvaluateAgentForGoalUseCase {
  /**
   * @param {AgentOrchestratorService} orchestratorService - Service for agent orchestration
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(orchestratorService, agentRepository) {
    this.orchestratorService = orchestratorService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to evaluate an agent for a specific goal
   * @param {Object} request - Request object containing evaluation details
   * @param {string} request.agentId - ID of the agent to evaluate
   * @param {string} request.goal - Goal to evaluate the agent against
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.agentId || !request.goal) {
        return {
          success: false,
          errors: ['Agent ID and goal are required']
        };
      }

      // Get the agent
      const agent = await this.agentRepository.findById(request.agentId);
      if (!agent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      // Evaluate agent for the goal
      const evaluation = this.orchestratorService.evaluateAgentForGoal(agent, request.goal);

      return {
        success: true,
        evaluation: evaluation,
        message: 'Agent evaluation completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class CreateMultiAgentCoordinationUseCase {
  /**
   * @param {AgentOrchestratorService} orchestratorService - Service for agent orchestration
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(orchestratorService, agentRepository) {
    this.orchestratorService = orchestratorService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to create a multi-agent coordination plan
   * @param {Object} request - Request object containing coordination details
   * @param {Array<string>} request.agentIds - IDs of agents to coordinate
   * @param {string} request.coordinationGoal - Goal for the coordinated effort
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.agentIds || !Array.isArray(request.agentIds) || request.agentIds.length === 0) {
        return {
          success: false,
          errors: ['At least one agent ID is required']
        };
      }

      if (!request.coordinationGoal) {
        return {
          success: false,
          errors: ['Coordination goal is required']
        };
      }

      // Get the agents
      const agents = [];
      for (const agentId of request.agentIds) {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
          return {
            success: false,
            errors: [`Agent with ID ${agentId} not found`]
          };
        }
        agents.push(agent);
      }

      // Create the coordination plan
      const coordinationPlan = this.orchestratorService.createMultiAgentCoordinationPlan(
        agents,
        request.coordinationGoal
      );

      return {
        success: true,
        coordinationPlan: coordinationPlan,
        message: 'Multi-agent coordination plan created successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}