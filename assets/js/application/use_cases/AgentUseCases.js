/**
 * Application Layer - Use Cases
 * 
 * Contains application-specific business rules and orchestrates domain objects
 */

import { AgentDomainService } from '../domain/services/AgentDomainService.js';
import { AgentName } from '../domain/value_objects/AgentName.js';
import { AgentPrompt } from '../domain/value_objects/AgentPrompt.js';
import { FrameworkConfig } from '../domain/value_objects/FrameworkConfig.js';

export class CreateAgentUseCase {
  /**
   * @param {AgentDomainService} agentDomainService - Domain service for agent operations
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentDomainService, agentRepository) {
    this.agentDomainService = agentDomainService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to create a new agent
   * @param {Object} request - Request object containing agent details
   * @param {string} request.name - Agent name
   * @param {string} request.prompt - Agent prompt
   * @param {Array<Object>} request.frameworkConfigs - Framework configurations
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.name || !request.prompt) {
        return {
          success: false,
          errors: ['Name and prompt are required']
        };
      }

      // Create the agent using domain service
      const agent = this.agentDomainService.createAgent(
        request.name,
        request.prompt,
        request.frameworkConfigs || []
      );

      // Validate the agent
      const validationErrors = this.agentDomainService.validateAgent(agent);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // Save the agent
      await this.agentRepository.save(agent);

      return {
        success: true,
        agent: agent,
        message: 'Agent created successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class UpdateAgentUseCase {
  /**
   * @param {AgentDomainService} agentDomainService - Domain service for agent operations
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentDomainService, agentRepository) {
    this.agentDomainService = agentDomainService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to update an existing agent
   * @param {Object} request - Request object containing agent details
   * @param {string} request.id - Agent ID to update
   * @param {string} [request.name] - New agent name
   * @param {string} [request.prompt] - New agent prompt
   * @param {Array<Object>} [request.frameworkConfigs] - New framework configurations
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Find the existing agent
      const existingAgent = await this.agentRepository.findById(request.id);
      if (!existingAgent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      // Update the agent properties
      let updatedAgent = existingAgent;

      if (request.name) {
        const newName = new AgentName(request.name);
        updatedAgent = updatedAgent.updateName(newName);
      }

      if (request.prompt) {
        const newPrompt = new AgentPrompt(request.prompt);
        updatedAgent = updatedAgent.updatePrompt(newPrompt);
      }

      if (request.frameworkConfigs) {
        // Clear existing framework configs and add new ones
        let tempAgent = updatedAgent;
        request.frameworkConfigs.forEach(configData => {
          const frameworkConfig = new FrameworkConfig(configData.frameworkType, configData.configData);
          tempAgent = tempAgent.addFrameworkConfig(frameworkConfig);
        });
        updatedAgent = tempAgent;
      }

      // Validate the updated agent
      const validationErrors = this.agentDomainService.validateAgent(updatedAgent);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // Save the updated agent
      await this.agentRepository.save(updatedAgent);

      return {
        success: true,
        agent: updatedAgent,
        message: 'Agent updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class GetAgentUseCase {
  /**
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentRepository) {
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to get an agent by ID
   * @param {Object} request - Request object containing agent ID
   * @param {string} request.id - Agent ID to retrieve
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      const agent = await this.agentRepository.findById(request.id);
      if (!agent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      return {
        success: true,
        agent: agent
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class ListAgentsUseCase {
  /**
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentRepository) {
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to list all agents
   * @returns {Promise<Object>} Result of the operation
   */
  async execute() {
    try {
      const agents = await this.agentRepository.findAll();

      return {
        success: true,
        agents: agents
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class DeleteAgentUseCase {
  /**
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentRepository) {
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to delete an agent
   * @param {Object} request - Request object containing agent ID
   * @param {string} request.id - Agent ID to delete
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Check if agent exists
      const agent = await this.agentRepository.findById(request.id);
      if (!agent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      // Delete the agent
      await this.agentRepository.delete(request.id);

      return {
        success: true,
        message: 'Agent deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class ConfigureAgentFrameworksUseCase {
  /**
   * @param {AgentDomainService} agentDomainService - Domain service for agent operations
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(agentDomainService, agentRepository) {
    this.agentDomainService = agentDomainService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to configure frameworks for an agent
   * @param {Object} request - Request object containing agent details
   * @param {string} request.id - Agent ID
   * @param {Array<Object>} request.frameworkConfigs - Framework configurations to set
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Find the existing agent
      const existingAgent = await this.agentRepository.findById(request.id);
      if (!existingAgent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      // Update framework configurations
      let updatedAgent = existingAgent;
      
      // Clear existing framework configs by removing all and adding new ones
      request.frameworkConfigs.forEach(configData => {
        const frameworkConfig = new FrameworkConfig(configData.frameworkType, configData.configData);
        updatedAgent = updatedAgent.addFrameworkConfig(frameworkConfig);
      });

      // Validate the updated agent
      const validationErrors = this.agentDomainService.validateAgent(updatedAgent);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // Save the updated agent
      await this.agentRepository.save(updatedAgent);

      return {
        success: true,
        agent: updatedAgent,
        message: 'Agent frameworks configured successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}