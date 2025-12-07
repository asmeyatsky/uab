/**
 * FrameworkConfig Value Object - Domain Layer
 * 
 * Immutable value object for framework configurations
 */
export class FrameworkConfig {
  constructor(frameworkType, configData) {
    if (!frameworkType || typeof frameworkType !== 'string') {
      throw new Error('Framework type must be a non-empty string');
    }
    
    // Validate framework type
    const validFrameworks = ['A2A', 'ADK', 'MCP'];
    if (!validFrameworks.includes(frameworkType.toUpperCase())) {
      throw new Error(`Invalid framework type: ${frameworkType}. Must be one of: ${validFrameworks.join(', ')}`);
    }
    
    if (configData && typeof configData !== 'object') {
      throw new Error('Config data must be an object or null/undefined');
    }
    
    this._frameworkType = frameworkType.toUpperCase();
    this._configData = configData || {};
  }

  get frameworkType() {
    return this._frameworkType;
  }

  get configData() {
    return { ...this._configData }; // Return a copy to prevent external mutation
  }

  equals(other) {
    if (!(other instanceof FrameworkConfig)) {
      return false;
    }
    return this._frameworkType === other.frameworkType && 
           JSON.stringify(this._configData) === JSON.stringify(other.configData);
  }

  toString() {
    return `${this._frameworkType}: ${JSON.stringify(this._configData)}`;
  }

  /**
   * Adds the framework configuration to an agent configuration object
   * @param {Object} agentConfig - The agent configuration object to update
   */
  addToAgentConfig(agentConfig) {
    switch (this._frameworkType) {
      case 'A2A':
        agentConfig.a2a = this._configData;
        break;
      case 'ADK':
        agentConfig.adk = this._configData;
        break;
      case 'MCP':
        agentConfig.mcp = this._configData;
        break;
      default:
        // Should not happen due to validation in constructor
        break;
    }
  }
}