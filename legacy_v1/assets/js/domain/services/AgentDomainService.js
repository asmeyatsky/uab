/**
 * AgentDomainService - Domain Layer
 * 
 * Service for handling complex domain logic related to agents
 */
import { Agent } from '../entities/Agent.js';
import { AgentId } from '../value_objects/AgentId.js';
import { AgentName } from '../value_objects/AgentName.js';
import { AgentPrompt } from '../value_objects/AgentPrompt.js';
import { FrameworkConfig } from '../value_objects/FrameworkConfig.js';
import { AgentStatus } from '../value_objects/AgentStatus.js';
import { DateTime } from '../value_objects/DateTime.js';

export class AgentDomainService {
  /**
   * Creates a new agent
   * @param {string} name - Agent name
   * @param {string} prompt - Agent prompt
   * @param {Array<Object>} frameworkConfigs - Framework configurations (as plain objects)
   * @returns {Agent} New agent instance
   */
  createAgent(name, prompt, frameworkConfigs = []) {
    const agentId = new AgentId(this._generateId());
    const agentName = new AgentName(name);
    const agentPrompt = new AgentPrompt(prompt);
    const status = new AgentStatus('DRAFT');
    const createdAt = DateTime.now();
    
    // Convert plain config objects to FrameworkConfig value objects
    const configObjects = frameworkConfigs.map(config => 
      new FrameworkConfig(config.frameworkType, config.configData)
    );
    
    return new Agent(
      agentId,
      agentName,
      agentPrompt,
      configObjects,
      status,
      createdAt,
      createdAt
    );
  }

  /**
   * Determines which frameworks to recommend based on the agent prompt
   * @param {string} prompt - Agent prompt
   * @returns {Array<string>} Recommended framework types
   */
  recommendFrameworks(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const frameworks = new Set();

    if (lowerPrompt.includes('agent-to-agent') || 
        lowerPrompt.includes('a2a') || 
        lowerPrompt.includes('collaboration') || 
        lowerPrompt.includes('multi-agent') ||
        lowerPrompt.includes('communication')) {
      frameworks.add('A2A');
    }

    if (lowerPrompt.includes('development kit') || 
        lowerPrompt.includes('adk') || 
        lowerPrompt.includes('workflow') ||
        lowerPrompt.includes('orchestration') ||
        lowerPrompt.includes('process')) {
      frameworks.add('ADK');
    }

    if (lowerPrompt.includes('model context') || 
        lowerPrompt.includes('mcp') || 
        lowerPrompt.includes('external tools') || 
        lowerPrompt.includes('data sources') ||
        lowerPrompt.includes('tool integration') ||
        lowerPrompt.includes('resource access')) {
      frameworks.add('MCP');
    }

    return Array.from(frameworks);
  }

  /**
   * Validates an agent configuration
   * @param {Agent} agent - Agent to validate
   * @returns {Array<string>} List of validation errors, empty if valid
   */
  validateAgent(agent) {
    const errors = [];

    if (!agent.name.value || agent.name.value.trim().length === 0) {
      errors.push('Agent name is required');
    }

    if (!agent.prompt.value || agent.prompt.value.trim().length === 0) {
      errors.push('Agent prompt is required');
    }

    if (agent.frameworkConfigs.length === 0) {
      errors.push('At least one framework must be configured');
    }

    return errors;
  }

  /**
   * Generates recommended tools based on the agent prompt
   * @param {string} prompt - Agent prompt
   * @param {Array<string>} frameworks - Selected frameworks
   * @returns {Array<string>} Recommended tools
   */
  recommendTools(prompt, frameworks) {
    const lowerPrompt = prompt.toLowerCase();
    const tools = [];

    // Data-related tools
    if (lowerPrompt.includes('data') || lowerPrompt.includes('analysis') || lowerPrompt.includes('analytics')) {
      tools.push('data_processor', 'visualization');
    }

    // File/document tools
    if (lowerPrompt.includes('file') || lowerPrompt.includes('document') || lowerPrompt.includes('pdf')) {
      tools.push('file_handler', 'document_parser');
    }

    // Web/api tools
    if (lowerPrompt.includes('web') || lowerPrompt.includes('api') || lowerPrompt.includes('http')) {
      tools.push('web_client', 'api_connector');
    }

    // Database tools
    if (lowerPrompt.includes('database') || lowerPrompt.includes('storage') || lowerPrompt.includes('sql')) {
      tools.push('database_connector', 'data_storage');
    }

    // Communication tools
    if (lowerPrompt.includes('email') || lowerPrompt.includes('message') || lowerPrompt.includes('notification')) {
      tools.push('email_sender', 'notification_service');
    }

    // Default tools if no specific needs detected
    if (tools.length === 0 && frameworks.includes('MCP')) {
      tools.push('general_tools');
    }

    return tools;
  }

  /**
   * Generates a unique ID for new agents
   * @private
   * @returns {string} Unique agent ID
   */
  _generateId() {
    return 'agent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Creates an agent configuration based on a template
   * @param {Object} template - Agent template
   * @returns {Agent} New agent based on template
   */
  createAgentFromTemplate(template) {
    const agentId = new AgentId(this._generateId());
    const agentName = new AgentName(template.name || 'Template Agent');
    const agentPrompt = new AgentPrompt(template.prompt);
    const status = new AgentStatus('CONFIGURED');
    const createdAt = DateTime.now();
    
    // Convert template framework configs to value objects
    const frameworkConfigs = template.frameworks.map(framework => {
      // Use default config for each framework type
      const defaultConfigs = {
        'A2A': { 
          name: template.name || 'Generated Agent',
          discovery: 'multicast',
          port: 8080,
          security: 'tls',
          capabilities: ['chat', 'task-execution', 'collaboration']
        },
        'ADK': { 
          workflow: 'sequential',
          environment: 'local',
          resources: 'CPU: 1, Memory: 512MB',
          retry: 'exponential',
          tools: template.tools || ['general_tools']
        },
        'MCP': { 
          server: 'stdio',
          tools: template.tools?.map(t => t.replace(/_/g, ' ')) || ['filesystem', 'database', 'web'],
          resources: ['files', 'databases', 'apis'],
          context_window: 4096
        }
      };

      return new FrameworkConfig(framework, defaultConfigs[framework] || {});
    });
    
    return new Agent(
      agentId,
      agentName,
      agentPrompt,
      frameworkConfigs,
      status,
      createdAt,
      createdAt
    );
  }
}