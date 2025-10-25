/**
 * AgentOrchestratorService - Domain Layer
 * 
 * Service for handling complex orchestration and planning capabilities for agents
 */

import { Agent } from '../entities/Agent.js';
import { AgentDomainService } from './AgentDomainService.js';

export class AgentOrchestratorService {
  constructor() {
    this.agentDomainService = new AgentDomainService();
  }

  /**
   * Creates an agentic plan based on a high-level goal
   * @param {string} goal - High-level goal for the agent to achieve
   * @param {Array<string>} availableTools - List of tools available to the agent
   * @param {string} frameworkType - Type of framework to use for orchestration (A2A, ADK, MCP)
   * @returns {Object} Plan with steps and required resources
   */
  createAgenticPlan(goal, availableTools, frameworkType) {
    const plan = {
      goal: goal,
      frameworkType: frameworkType,
      steps: [],
      requiredTools: [],
      estimatedTime: 0,
      successCriteria: []
    };

    // Analyze the goal and create appropriate steps
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes('research') || goalLower.includes('analyze')) {
      plan.steps.push(
        { id: 1, action: 'gather_information', description: 'Collect relevant information for analysis', dependencies: [] },
        { id: 2, action: 'analyze_data', description: 'Process and analyze the collected data', dependencies: [1] },
        { id: 3, action: 'generate_report', description: 'Create summary report of findings', dependencies: [2] }
      );
    } else if (goalLower.includes('create') || goalLower.includes('generate')) {
      plan.steps.push(
        { id: 1, action: 'collect_requirements', description: 'Gather necessary requirements', dependencies: [] },
        { id: 2, action: 'create_draft', description: 'Generate initial draft', dependencies: [1] },
        { id: 3, action: 'review_draft', description: 'Review and refine the draft', dependencies: [2] },
        { id: 4, action: 'finalize_output', description: 'Produce final output', dependencies: [3] }
      );
    } else if (goalLower.includes('coordinate') || goalLower.includes('manage')) {
      plan.steps.push(
        { id: 1, action: 'identify_agents', description: 'Discover and identify relevant agents', dependencies: [] },
        { id: 2, action: 'delegate_tasks', description: 'Assign tasks to appropriate agents', dependencies: [1] },
        { id: 3, action: 'monitor_progress', description: 'Track task progress', dependencies: [2] },
        { id: 4, action: 'coordinate_completion', description: 'Coordinate final deliverables', dependencies: [3] }
      );
    } else {
      // Default workflow for other goals
      plan.steps.push(
        { id: 1, action: 'understand_request', description: 'Comprehend the user request', dependencies: [] },
        { id: 2, action: 'plan_execution', description: 'Plan how to fulfill the request', dependencies: [1] },
        { id: 3, action: 'execute_plan', description: 'Carry out the planned actions', dependencies: [2] },
        { id: 4, action: 'verify_result', description: 'Ensure the result meets requirements', dependencies: [3] },
        { id: 5, action: 'present_result', description: 'Deliver the result to the user', dependencies: [4] }
      );
    }

    // Identify required tools based on goal
    plan.requiredTools = this._identifyRequiredTools(goal, availableTools);
    
    // Set success criteria based on goal
    plan.successCriteria = this._generateSuccessCriteria(goal);
    
    // Estimate time based on number of steps
    plan.estimatedTime = plan.steps.length * 5; // 5 minutes per step as a rough estimate
    
    return plan;
  }

  /**
   * Identifies required tools based on the goal
   * @private
   */
  _identifyRequiredTools(goal, availableTools) {
    const requiredTools = [];
    const goalLower = goal.toLowerCase();
    
    // Add tools based on goal keywords
    if (goalLower.includes('data') || goalLower.includes('analyze') || goalLower.includes('research')) {
      if (availableTools.includes('data_processor')) requiredTools.push('data_processor');
      if (availableTools.includes('database_connector')) requiredTools.push('database_connector');
      if (availableTools.includes('visualization')) requiredTools.push('visualization');
    }
    
    if (goalLower.includes('document') || goalLower.includes('text') || goalLower.includes('content')) {
      if (availableTools.includes('document_parser')) requiredTools.push('document_parser');
      if (availableTools.includes('content_generator')) requiredTools.push('content_generator');
      if (availableTools.includes('file_handler')) requiredTools.push('file_handler');
    }
    
    if (goalLower.includes('web') || goalLower.includes('api') || goalLower.includes('internet')) {
      if (availableTools.includes('web_client')) requiredTools.push('web_client');
      if (availableTools.includes('api_connector')) requiredTools.push('api_connector');
    }
    
    if (goalLower.includes('email') || goalLower.includes('message') || goalLower.includes('notify')) {
      if (availableTools.includes('email_sender')) requiredTools.push('email_sender');
      if (availableTools.includes('notification_service')) requiredTools.push('notification_service');
    }
    
    // Add general tools if no specific ones found
    if (requiredTools.length === 0 && availableTools.includes('general_tools')) {
      requiredTools.push('general_tools');
    }
    
    return requiredTools;
  }

  /**
   * Generates success criteria based on the goal
   * @private
   */
  _generateSuccessCriteria(goal) {
    const criteria = [];
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes('report') || goalLower.includes('analyze')) {
      criteria.push('Analysis is comprehensive and accurate');
      criteria.push('Report is well-structured and clear');
      criteria.push('Key insights are identified and highlighted');
    } else if (goalLower.includes('create') || goalLower.includes('generate')) {
      criteria.push('Output meets the specified requirements');
      criteria.push('Content is coherent and well-organized');
      criteria.push('All necessary elements are included');
    } else if (goalLower.includes('solve') || goalLower.includes('resolve')) {
      criteria.push('Problem is correctly identified');
      criteria.push('Solution is appropriate and effective');
      criteria.push('Solution addresses root cause, not just symptoms');
    } else {
      criteria.push('Goal is successfully achieved');
      criteria.push('Output quality meets expectations');
      criteria.push('Process is efficient and follows best practices');
    }
    
    return criteria;
  }

  /**
   * Creates a multi-agent coordination plan
   * @param {Array<Agent>} agents - Array of agents to coordinate
   * @param {string} coordinationGoal - Goal for the coordinated effort
   * @returns {Object} Coordination plan
   */
  createMultiAgentCoordinationPlan(agents, coordinationGoal) {
    const plan = {
      goal: coordinationGoal,
      agents: agents.map(agent => ({
        id: agent.id.value,
        name: agent.name.value,
        capabilities: agent.frameworkConfigs.map(config => config.frameworkType),
        role: this._assignRole(coordinationGoal, agent)
      })),
      communicationProtocol: 'a2a', // Default to A2A for multi-agent communication
      taskDistribution: this._distributeTasks(agents, coordinationGoal),
      coordinationSteps: [
        { id: 1, action: 'initialize_coordination', description: 'Set up communication channels between agents' },
        { id: 2, action: 'assign_roles', description: 'Assign specific roles to each agent' },
        { id: 3, action: 'distribute_tasks', description: 'Assign tasks based on agent capabilities' },
        { id: 4, action: 'monitor_progress', description: 'Track progress across all agents' },
        { id: 5, action: 'integrate_results', description: 'Combine outputs from all agents' },
        { id: 6, action: 'validate_solution', description: 'Verify the coordinated solution' }
      ]
    };

    return plan;
  }

  /**
   * Assigns a role to an agent based on the coordination goal and agent capabilities
   * @private
   */
  _assignRole(coordinationGoal, agent) {
    const goalLower = coordinationGoal.toLowerCase();
    const capabilities = agent.frameworkConfigs.map(config => config.frameworkType);
    
    // Determine the most appropriate role based on capabilities and goal
    if (goalLower.includes('analysis') || goalLower.includes('data')) {
      if (capabilities.includes('ADK')) return 'workflow_coordinator';
      if (capabilities.includes('MCP')) return 'data_processor';
      return 'general_agent';
    } else if (goalLower.includes('communication') || goalLower.includes('coordinate')) {
      if (capabilities.includes('A2A')) return 'communication_hub';
      return 'task_coordinator';
    } else if (goalLower.includes('create') || goalLower.includes('generate')) {
      if (capabilities.includes('MCP')) return 'content_generator';
      return 'output_producer';
    } else {
      return 'general_agent';
    }
  }

  /**
   * Distributes tasks among agents based on their capabilities
   * @private
   */
  _distributeTasks(agents, coordinationGoal) {
    const taskDistribution = [];
    
    agents.forEach(agent => {
      const capabilities = agent.frameworkConfigs.map(config => config.frameworkType);
      let tasks = [];
      
      // Assign tasks based on capabilities and coordination goal
      if (capabilities.includes('A2A')) {
        tasks.push('coordinate_with_other_agents', 'manage_communication');
      }
      
      if (capabilities.includes('ADK')) {
        tasks.push('workflow_management', 'task_sequencing');
      }
      
      if (capabilities.includes('MCP')) {
        tasks.push('external_tool_integration', 'data_access');
      }
      
      taskDistribution.push({
        agentId: agent.id.value,
        tasks: tasks
      });
    });
    
    return taskDistribution;
  }

  /**
   * Evaluates whether an agent configuration is suitable for a given goal
   * @param {Agent} agent - Agent to evaluate
   * @param {string} goal - Goal to evaluate against
   * @returns {Object} Evaluation result with score and feedback
   */
  evaluateAgentForGoal(agent, goal) {
    const evaluation = {
      agentId: agent.id.value,
      goal: goal,
      score: 0,
      feedback: [],
      recommendations: []
    };
    
    // Calculate score based on framework fit
    const goalLower = goal.toLowerCase();
    let frameworkScore = 0;
    let feedback = [];
    
    // Check A2A fit
    if ((goalLower.includes('communication') || goalLower.includes('coordinate') || goalLower.includes('multi-agent')) && agent.hasFramework('A2A')) {
      frameworkScore += 25;
      feedback.push('A2A framework well-suited for communication tasks');
    } else if ((goalLower.includes('communication') || goalLower.includes('coordinate')) && !agent.hasFramework('A2A')) {
      feedback.push('A2A framework recommended for communication tasks');
      evaluation.recommendations.push('Consider adding A2A framework for better communication capabilities');
    }
    
    // Check ADK fit
    if ((goalLower.includes('workflow') || goalLower.includes('process') || goalLower.includes('orchestrate')) && agent.hasFramework('ADK')) {
      frameworkScore += 25;
      feedback.push('ADK framework well-suited for workflow tasks');
    } else if ((goalLower.includes('workflow') || goalLower.includes('process')) && !agent.hasFramework('ADK')) {
      feedback.push('ADK framework recommended for workflow tasks');
      evaluation.recommendations.push('Consider adding ADK framework for workflow orchestration');
    }
    
    // Check MCP fit
    if ((goalLower.includes('data') || goalLower.includes('tool') || goalLower.includes('access')) && agent.hasFramework('MCP')) {
      frameworkScore += 25;
      feedback.push('MCP framework well-suited for data/tool access tasks');
    } else if ((goalLower.includes('data') || goalLower.includes('tool')) && !agent.hasFramework('MCP')) {
      feedback.push('MCP framework recommended for data/tool access tasks');
      evaluation.recommendations.push('Consider adding MCP framework for external resource access');
    }
    
    // Check prompt relevance
    const agentPrompt = agent.prompt.value.toLowerCase();
    if (agentPrompt.includes(goalLower.substring(0, 20)) || goalLower.includes(agentPrompt.substring(0, 20).split(' ')[0])) {
      frameworkScore += 25;
      feedback.push('Agent prompt aligns well with the goal');
    } else {
      feedback.push('Agent prompt could be more specific to the goal');
      evaluation.recommendations.push('Consider updating the agent prompt to be more specific to the goal');
    }
    
    evaluation.score = frameworkScore;
    evaluation.feedback = feedback;
    
    return evaluation;
  }
}