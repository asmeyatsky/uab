/**
 * Ports - Domain Layer
 * 
 * Defines interfaces for external dependencies using ports and adapters pattern
 */

/**
 * @interface AgentRepositoryPort
 * @description Port for agent persistence operations
 */
export class AgentRepositoryPort {
  /**
   * Saves an agent
   * @param {Agent} agent - Agent to save
   * @returns {Promise<void>}
   */
  async save(agent) {
    throw new Error('Method save must be implemented');
  }

  /**
   * Finds an agent by ID
   * @param {string} id - Agent ID
   * @returns {Promise<Agent|null>} Found agent or null
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Finds all agents
   * @returns {Promise<Array<Agent>>} List of all agents
   */
  async findAll() {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Deletes an agent
   * @param {string} id - Agent ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }
}

/**
 * @interface FrameworkConfigurationPort
 * @description Port for framework configuration operations
 */
export class FrameworkConfigurationPort {
  /**
   * Applies configuration to a framework
   * @param {string} frameworkType - Type of framework (A2A, ADK, MCP)
   * @param {Object} config - Configuration to apply
   * @returns {Promise<Object>} Result of configuration application
   */
  async applyConfiguration(frameworkType, config) {
    throw new Error('Method applyConfiguration must be implemented');
  }

  /**
   * Validates framework configuration
   * @param {string} frameworkType - Type of framework
   * @param {Object} config - Configuration to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateConfiguration(frameworkType, config) {
    throw new Error('Method validateConfiguration must be implemented');
  }
}

/**
 * @interface AgentDeploymentPort
 * @description Port for agent deployment operations
 */
export class AgentDeploymentPort {
  /**
   * Deploys an agent
   * @param {Agent} agent - Agent to deploy
   * @param {Object} deploymentConfig - Deployment configuration
   * @returns {Promise<Object>} Deployment result
   */
  async deploy(agent, deploymentConfig) {
    throw new Error('Method deploy must be implemented');
  }

  /**
   * Undeploys an agent
   * @param {string} agentId - Agent ID to undeploy
   * @returns {Promise<Object>} Undeployment result
   */
  async undeploy(agentId) {
    throw new Error('Method undeploy must be implemented');
  }

  /**
   * Gets deployment status for an agent
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} Deployment status
   */
  async getStatus(agentId) {
    throw new Error('Method getStatus must be implemented');
  }
}

/**
 * @interface AgentTestingPort
 * @description Port for agent testing operations
 */
export class AgentTestingPort {
  /**
   * Runs tests on an agent
   * @param {Agent} agent - Agent to test
   * @param {Array<Object>} testCases - Test cases to run
   * @returns {Promise<Object>} Test results
   */
  async runTests(agent, testCases) {
    throw new Error('Method runTests must be implemented');
  }

  /**
   * Simulates agent interaction
   * @param {Agent} agent - Agent to simulate
   * @param {string} input - Input to provide to the agent
   * @returns {Promise<string>} Agent's response
   */
  async simulateInteraction(agent, input) {
    throw new Error('Method simulateInteraction must be implemented');
  }
}