/**
 * Agent Entity - Domain Layer
 * 
 * Architectural Intent:
 * - This module handles agent lifecycle management following DDD principles
 * - Agent aggregate is the consistency boundary
 * - All state changes go through domain methods to ensure invariants
 * - External framework configuration is handled via ports/adapters pattern
 * - Events are published for other bounded contexts to react
 * 
 * Key Design Decisions:
 * 1. Agents are immutable to prevent accidental state corruption
 * 2. Framework configurations are abstracted behind FrameworkConfigPort
 * 3. Agent status transitions are validated in domain model
 * 4. Complex configuration logic is delegated to AgentDomainService
 */

import { AgentId } from '../value_objects/AgentId.js';
import { AgentName } from '../value_objects/AgentName.js';
import { AgentPrompt } from '../value_objects/AgentPrompt.js';
import { FrameworkConfig } from '../value_objects/FrameworkConfig.js';
import { AgentStatus } from '../value_objects/AgentStatus.js';
import { DateTime } from '../value_objects/DateTime.js';

/**
 * @class Agent
 * @description Agent Aggregate Root
 * 
 * Invariants:
 * - Agent name must be valid
 * - Agent prompt must be provided
 * - Framework configurations must be valid
 * - Status transitions must follow defined state machine
 * - Created agents cannot be modified directly
 */
export class Agent {
  /**
   * Creates a new Agent instance
   * @param {AgentId} id - Unique identifier for the agent
   * @param {AgentName} name - Name of the agent
   * @param {AgentPrompt} prompt - Prompt describing the agent's purpose
   * @param {Array<FrameworkConfig>} frameworkConfigs - Framework configurations
   * @param {AgentStatus} status - Current status of the agent
   * @param {DateTime} createdAt - Creation timestamp
   * @param {DateTime} updatedAt - Last update timestamp
   */
  constructor(id, name, prompt, frameworkConfigs = [], status, createdAt, updatedAt) {
    this._validateInvariants(id, name, prompt, frameworkConfigs);
    
    this._id = id;
    this._name = name;
    this._prompt = prompt;
    this._frameworkConfigs = frameworkConfigs;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Properties (getter methods only to enforce immutability)
  get id() { return this._id; }
  get name() { return this._name; }
  get prompt() { return this._prompt; }
  get frameworkConfigs() { return [...this._frameworkConfigs]; } // Return copy to prevent mutation
  get status() { return this._status; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  /**
   * Validates entity invariants
   * @private
   * @param {AgentId} id
   * @param {AgentName} name
   * @param {AgentPrompt} prompt
   * @param {Array<FrameworkConfig>} frameworkConfigs
   */
  _validateInvariants(id, name, prompt, frameworkConfigs) {
    if (!(id instanceof AgentId)) {
      throw new Error('Agent ID must be an instance of AgentId value object');
    }
    if (!(name instanceof AgentName)) {
      throw new Error('Agent name must be an instance of AgentName value object');
    }
    if (!(prompt instanceof AgentPrompt)) {
      throw new Error('Agent prompt must be an instance of AgentPrompt value object');
    }
    if (frameworkConfigs.some(config => !(config instanceof FrameworkConfig))) {
      throw new Error('All framework configs must be instances of FrameworkConfig value object');
    }
    if (!(status instanceof AgentStatus)) {
      throw new Error('Agent status must be an instance of AgentStatus value object');
    }
    if (!(createdAt instanceof DateTime)) {
      throw new Error('Created at must be an instance of DateTime value object');
    }
    if (!(updatedAt instanceof DateTime)) {
      throw new Error('Updated at must be an instance of DateTime value object');
    }
  }

  /**
   * Updates the agent's name
   * @param {AgentName} newName - New name for the agent
   * @returns {Agent} New instance with updated name
   */
  updateName(newName) {
    if (!(newName instanceof AgentName)) {
      throw new Error('New name must be an instance of AgentName value object');
    }
    
    return new Agent(
      this._id,
      newName,
      this._prompt,
      this._frameworkConfigs,
      this._status,
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Updates the agent's prompt
   * @param {AgentPrompt} newPrompt - New prompt for the agent
   * @returns {Agent} New instance with updated prompt
   */
  updatePrompt(newPrompt) {
    if (!(newPrompt instanceof AgentPrompt)) {
      throw new Error('New prompt must be an instance of AgentPrompt value object');
    }
    
    return new Agent(
      this._id,
      this._name,
      newPrompt,
      this._frameworkConfigs,
      this._status,
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Adds a framework configuration to the agent
   * @param {FrameworkConfig} frameworkConfig - Framework configuration to add
   * @returns {Agent} New instance with added framework configuration
   */
  addFrameworkConfig(frameworkConfig) {
    if (!(frameworkConfig instanceof FrameworkConfig)) {
      throw new Error('Framework configuration must be an instance of FrameworkConfig value object');
    }
    
    // Check if framework already exists
    const existingConfigIndex = this._frameworkConfigs.findIndex(
      config => config.frameworkType === frameworkConfig.frameworkType
    );
    
    if (existingConfigIndex !== -1) {
      // Replace existing configuration
      const newConfigs = [...this._frameworkConfigs];
      newConfigs[existingConfigIndex] = frameworkConfig;
      return new Agent(
        this._id,
        this._name,
        this._prompt,
        newConfigs,
        this._status,
        this._createdAt,
        DateTime.now()
      );
    } else {
      // Add new configuration
      const newConfigs = [...this._frameworkConfigs, frameworkConfig];
      return new Agent(
        this._id,
        this._name,
        this._prompt,
        newConfigs,
        this._status,
        this._createdAt,
        DateTime.now()
      );
    }
  }

  /**
   * Removes a framework configuration from the agent
   * @param {string} frameworkType - Type of framework to remove
   * @returns {Agent} New instance without the specified framework configuration
   */
  removeFrameworkConfig(frameworkType) {
    const newConfigs = this._frameworkConfigs.filter(
      config => config.frameworkType !== frameworkType
    );
    
    return new Agent(
      this._id,
      this._name,
      this._prompt,
      newConfigs,
      this._status,
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Changes the agent's status
   * @param {AgentStatus} newStatus - New status for the agent
   * @returns {Agent} New instance with updated status
   */
  changeStatus(newStatus) {
    if (!(newStatus instanceof AgentStatus)) {
      throw new Error('New status must be an instance of AgentStatus value object');
    }
    
    return new Agent(
      this._id,
      this._name,
      this._prompt,
      this._frameworkConfigs,
      newStatus,
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Generates the agent configuration as a JSON object
   * @returns {Object} Configuration object in the format expected by frameworks
   */
  generateConfiguration() {
    const config = {
      agent: {
        id: this._id.value,
        name: this._name.value,
        description: this._prompt.value.substring(0, 200) + (this._prompt.value.length > 200 ? '...' : ''),
        prompt: this._prompt.value,
        frameworks: this._frameworkConfigs.map(config => config.frameworkType),
        created: this._createdAt.value,
        status: this._status.value
      }
    };

    // Add framework-specific configurations
    this._frameworkConfigs.forEach(config => {
      config.addToAgentConfig(config);
    });

    return config;
  }

  /**
   * Checks if the agent has a specific framework configured
   * @param {string} frameworkType - Type of framework to check
   * @returns {boolean} True if the agent has the specified framework configured
   */
  hasFramework(frameworkType) {
    return this._frameworkConfigs.some(config => config.frameworkType === frameworkType);
  }

  /**
   * Gets a specific framework configuration
   * @param {string} frameworkType - Type of framework to get
   * @returns {FrameworkConfig|null} The framework configuration or null if not found
   */
  getFrameworkConfig(frameworkType) {
    return this._frameworkConfigs.find(config => config.frameworkType === frameworkType) || null;
  }
}