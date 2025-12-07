/**
 * In-Memory Agent Repository - Infrastructure Layer
 * 
 * Implements the AgentRepositoryPort using in-memory storage with localStorage backup
 */
import { AgentRepositoryPort } from '../../domain/ports/index.js';

export class InMemoryAgentRepository extends AgentRepositoryPort {
  constructor() {
    super();
    this.agents = new Map();
    this.storageKey = 'uab_agents';
    this.loadFromStorage();
  }

  /**
   * Save an agent to the repository
   * @param {Agent} agent - Agent to save
   * @returns {Promise<void>}
   */
  async save(agent) {
    this.agents.set(agent.id.value, agent);
    this.saveToStorage();
  }

  /**
   * Find an agent by ID
   * @param {string} id - Agent ID
   * @returns {Promise<Agent|null>} Found agent or null
   */
  async findById(id) {
    return this.agents.get(id) || null;
  }

  /**
   * Find all agents
   * @returns {Promise<Array<Agent>>} List of all agents
   */
  async findAll() {
    return Array.from(this.agents.values());
  }

  /**
   * Delete an agent
   * @param {string} id - Agent ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    this.agents.delete(id);
    this.saveToStorage();
  }

  /**
   * Serialize agents to JSON for storage
   * @private
   */
  _serializeAgent(agent) {
    return {
      id: agent.id.value,
      name: agent.name.value,
      prompt: agent.prompt.value,
      frameworkConfigs: agent.frameworkConfigs.map(config => ({
        frameworkType: config.frameworkType,
        configData: config.configData
      })),
      status: agent.status.value,
      createdAt: agent.createdAt.value,
      updatedAt: agent.updatedAt.value
    };
  }

  /**
   * Deserialize agents from JSON
   * @private
   */
  _deserializeAgent(data) {
    // Note: This is a simplified deserialization
    // In a real implementation, we would need to reconstruct value objects properly
    return {
      id: data.id,
      name: data.name,
      prompt: data.prompt,
      frameworkConfigs: data.frameworkConfigs,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      // This would need proper reconstruction of value objects in a full implementation
    };
  }

  /**
   * Save agents to localStorage
   */
  saveToStorage() {
    try {
      const serializedAgents = Array.from(this.agents.values()).map(agent => 
        this._serializeAgent(agent)
      );
      localStorage.setItem(this.storageKey, JSON.stringify(serializedAgents));
    } catch (error) {
      console.error('Failed to save agents to localStorage:', error);
    }
  }

  /**
   * Load agents from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const serializedAgents = JSON.parse(stored);
        // In a real implementation, we would reconstruct the agents properly
        // This is a simplified version for demonstration
        console.log(`Loaded ${serializedAgents.length} agents from storage`);
      }
    } catch (error) {
      console.error('Failed to load agents from localStorage:', error);
    }
  }
}