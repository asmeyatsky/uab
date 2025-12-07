/**
 * Framework Configuration Adapter - Infrastructure Layer
 * 
 * Adapter implementation for framework configuration operations
 */
import { FrameworkConfigurationPort } from '../../domain/ports/index.js';

export class FrameworkConfigurationAdapter extends FrameworkConfigurationPort {
  /**
   * Applies configuration to a framework
   * @param {string} frameworkType - Type of framework (A2A, ADK, MCP)
   * @param {Object} config - Configuration to apply
   * @returns {Promise<Object>} Result of configuration application
   */
  async applyConfiguration(frameworkType, config) {
    try {
      // Validate framework type
      const validFrameworks = ['A2A', 'ADK', 'MCP'];
      if (!validFrameworks.includes(frameworkType.toUpperCase())) {
        throw new Error(`Invalid framework type: ${frameworkType}`);
      }

      // Apply configuration based on framework type
      switch (frameworkType.toUpperCase()) {
        case 'A2A':
          return this._applyA2AConfiguration(config);
        case 'ADK':
          return this._applyADKConfiguration(config);
        case 'MCP':
          return this._applyMCPConfiguration(config);
        default:
          throw new Error(`Unsupported framework type: ${frameworkType}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validates framework configuration
   * @param {string} frameworkType - Type of framework
   * @param {Object} config - Configuration to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateConfiguration(frameworkType, config) {
    try {
      // Validate framework type
      const validFrameworks = ['A2A', 'ADK', 'MCP'];
      if (!validFrameworks.includes(frameworkType.toUpperCase())) {
        return {
          success: false,
          errors: [`Invalid framework type: ${frameworkType}`]
        };
      }

      // Validate configuration based on framework type
      switch (frameworkType.toUpperCase()) {
        case 'A2A':
          return this._validateA2AConfiguration(config);
        case 'ADK':
          return this._validateADKConfiguration(config);
        case 'MCP':
          return this._validateMCPConfiguration(config);
        default:
          return {
            success: false,
            errors: [`Unsupported framework type: ${frameworkType}`]
          };
      }
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // A2A Configuration Methods
  _applyA2AConfiguration(config) {
    // Apply A2A-specific configuration
    const validatedConfig = this._validateA2AConfiguration(config);
    if (!validatedConfig.success) {
      return {
        success: false,
        errors: validatedConfig.errors
      };
    }

    // Here we would apply the actual A2A configuration
    // For now, just return the validated config
    return {
      success: true,
      config: validatedConfig.config,
      message: 'A2A configuration applied successfully'
    };
  }

  _validateA2AConfiguration(config) {
    const errors = [];

    if (typeof config !== 'object' || config === null) {
      errors.push('A2A configuration must be an object');
      return { success: false, errors };
    }

    // Validate required A2A properties
    if (!config.name) {
      errors.push('A2A configuration requires "name" property');
    }

    if (!config.discovery || !['multicast', 'registry', 'static'].includes(config.discovery)) {
      errors.push('A2A discovery must be one of: multicast, registry, static');
    }

    if (!config.port || typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
      errors.push('A2A port must be a number between 1 and 65535');
    }

    if (!config.security || !['tls', 'mutual', 'none'].includes(config.security)) {
      errors.push('A2A security must be one of: tls, mutual, none');
    }

    // Validate additional A2A properties
    if (config.capabilities && !Array.isArray(config.capabilities)) {
      errors.push('A2A capabilities must be an array');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      config: {
        name: config.name,
        discovery: config.discovery,
        port: config.port,
        security: config.security,
        capabilities: config.capabilities || ['chat', 'task-execution', 'collaboration']
      }
    };
  }

  // ADK Configuration Methods
  _applyADKConfiguration(config) {
    // Apply ADK-specific configuration
    const validatedConfig = this._validateADKConfiguration(config);
    if (!validatedConfig.success) {
      return {
        success: false,
        errors: validatedConfig.errors
      };
    }

    // Here we would apply the actual ADK configuration
    return {
      success: true,
      config: validatedConfig.config,
      message: 'ADK configuration applied successfully'
    };
  }

  _validateADKConfiguration(config) {
    const errors = [];

    if (typeof config !== 'object' || config === null) {
      errors.push('ADK configuration must be an object');
      return { success: false, errors };
    }

    // Validate required ADK properties
    if (!config.workflow || !['sequential', 'parallel', 'conditional', 'event-driven'].includes(config.workflow)) {
      errors.push('ADK workflow must be one of: sequential, parallel, conditional, event-driven');
    }

    if (!config.environment || !['local', 'container', 'serverless', 'distributed'].includes(config.environment)) {
      errors.push('ADK environment must be one of: local, container, serverless, distributed');
    }

    if (!config.retry || !['exponential', 'linear', 'immediate', 'none'].includes(config.retry)) {
      errors.push('ADK retry must be one of: exponential, linear, immediate, none');
    }

    // Validate additional ADK properties
    if (config.resources && typeof config.resources !== 'string') {
      errors.push('ADK resources must be a string');
    }

    if (config.tools && !Array.isArray(config.tools)) {
      errors.push('ADK tools must be an array');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      config: {
        workflow: config.workflow || 'sequential',
        environment: config.environment || 'local',
        resources: config.resources || 'CPU: 1, Memory: 512MB',
        retry: config.retry || 'exponential',
        tools: config.tools || ['general_tools']
      }
    };
  }

  // MCP Configuration Methods
  _applyMCPConfiguration(config) {
    // Apply MCP-specific configuration
    const validatedConfig = this._validateMCPConfiguration(config);
    if (!validatedConfig.success) {
      return {
        success: false,
        errors: validatedConfig.errors
      };
    }

    // Here we would apply the actual MCP configuration
    return {
      success: true,
      config: validatedConfig.config,
      message: 'MCP configuration applied successfully'
    };
  }

  _validateMCPConfiguration(config) {
    const errors = [];

    if (typeof config !== 'object' || config === null) {
      errors.push('MCP configuration must be an object');
      return { success: false, errors };
    }

    // Validate required MCP properties
    if (!config.server || !['stdio', 'websocket', 'http', 'grpc'].includes(config.server)) {
      errors.push('MCP server must be one of: stdio, websocket, http, grpc');
    }

    if (typeof config.context_window !== 'number' || config.context_window <= 0) {
      errors.push('MCP context_window must be a positive number');
    }

    // Validate additional MCP properties
    if (config.tools && !Array.isArray(config.tools)) {
      errors.push('MCP tools must be an array');
    }

    if (config.resources && !Array.isArray(config.resources)) {
      errors.push('MCP resources must be an array');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      config: {
        server: config.server || 'stdio',
        tools: Array.isArray(config.tools) ? config.tools : ['filesystem', 'database', 'web'],
        resources: Array.isArray(config.resources) ? config.resources : ['files', 'databases', 'apis'],
        context_window: typeof config.context_window === 'number' ? config.context_window : 4096
      }
    };
  }
}