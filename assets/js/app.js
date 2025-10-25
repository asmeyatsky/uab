// Import dependency injection container
import { container } from './infrastructure/config/DependencyInjection.js';

// Application state (now uses domain entities)
const appState = {
  currentAgent: null, // Will hold an Agent entity
  selectedTemplate: null,
  deploymentConfig: {},
  agentsList: [] // List of all agents
};

// Application data
const appData = {
  templates: [
    {
      id: "customer-service",
      name: "Customer Service Agent",
      description: "Handles customer inquiries, support tickets, and escalations",
      prompt: "Create a customer service agent that can handle product inquiries, process returns, and escalate complex issues to human agents. The agent should be friendly, professional, and have access to order history and product information.",
      frameworks: ["A2A", "MCP"],
      tools: ["order_lookup", "product_database", "escalation_system"]
    },
    {
      id: "data-analyst",
      name: "Data Analysis Agent",
      description: "Analyzes data, generates reports, and provides insights",
      prompt: "Build a data analysis agent that can process CSV files, generate statistical reports, create visualizations, and provide actionable business insights. The agent should be able to handle large datasets and provide clear explanations of findings.",
      frameworks: ["ADK", "MCP"],
      tools: ["csv_processor", "visualization_engine", "statistical_analysis"]
    },
    {
      id: "content-creator",
      name: "Content Creation Agent",
      description: "Creates various types of content based on requirements",
      prompt: "Design a content creation agent that can write blog posts, social media content, and marketing copy. The agent should adapt its tone and style based on brand guidelines and target audience requirements.",
      frameworks: ["A2A", "ADK"],
      tools: ["content_generator", "style_analyzer", "brand_guidelines"]
    },
    {
      id: "multi-agent-coordinator",
      name: "Multi-Agent Coordinator",
      description: "Orchestrates multiple specialized agents",
      prompt: "Create a coordinator agent that manages a team of specialized agents for complex workflows. It should delegate tasks, monitor progress, and ensure quality control across all agent interactions.",
      frameworks: ["A2A", "ADK", "MCP"],
      tools: ["task_delegation", "progress_monitoring", "quality_control"]
    }
  ],
  frameworks: {
    "A2A": {
      name: "Agent-to-Agent Protocol",
      description: "Enables seamless communication and collaboration between AI agents",
      features: ["Agent Discovery", "Task Management", "Message Exchange", "Enterprise Security"],
      use_cases: ["Multi-agent collaboration", "Task delegation", "Cross-platform agent communication"]
    },
    "ADK": {
      name: "Agent Development Kit",
      description: "Framework for building sophisticated multi-agent systems",
      features: ["Workflow Orchestration", "Tool Integration", "Deployment Ready", "Multi-Modal Support"],
      use_cases: ["Complex agent workflows", "Production deployment", "Enterprise applications"]
    },
    "MCP": {
      name: "Model Context Protocol",
      description: "Connects LLMs to external tools and data sources",
      features: ["Tool Integration", "Resource Access", "Context Management", "Standardized APIs"],
      use_cases: ["LLM tool integration", "External data access", "Context-aware agents"]
    }
  },
  deploymentOptions: [
    { name: "Local Development", description: "Run agent locally for testing and development" },
    { name: "Cloud Deployment", description: "Deploy to cloud platforms like AWS, GCP, or Azure" },
    { name: "Container Deployment", description: "Package agent in Docker containers" },
    { name: "Edge Deployment", description: "Deploy to edge devices and local infrastructure" }
  ]
};

// Add error handling and logging
class Logger {
  static log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console[type](`[${timestamp}] ${message}`);
  }

  static error(message, error) {
    this.log(`ERROR: ${message}`, 'error');
    if (error) console.error(error);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  renderTemplates();
  renderFrameworkInfo();
  setupEventListeners();
  
  // Ensure main content is visible
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';
  }
}

function renderTemplates() {
  const templateList = document.getElementById('templateList');
  templateList.innerHTML = '';

  appData.templates.forEach(template => {
    const templateCard = document.createElement('div');
    templateCard.className = 'template-card';
    templateCard.dataset.templateId = template.id;
    
    templateCard.innerHTML = `
      <div class="template-card__name">${template.name}</div>
      <div class="template-card__description">${template.description}</div>
      <div class="template-frameworks">
        ${template.frameworks.map(fw => `<span class="framework-badge">${fw}</span>`).join('')}
      </div>
    `;
    
    templateCard.addEventListener('click', () => selectTemplate(template));
    templateList.appendChild(templateCard);
  });
}

function renderFrameworkInfo() {
  const frameworkInfo = document.getElementById('frameworkInfo');
  frameworkInfo.innerHTML = '';

  Object.entries(appData.frameworks).forEach(([key, framework]) => {
    const infoCard = document.createElement('div');
    infoCard.className = 'framework-info-card';
    
    infoCard.innerHTML = `
      <div class="framework-info-card__name">${framework.name}</div>
      <div class="framework-info-card__description">${framework.description}</div>
    `;
    
    frameworkInfo.appendChild(infoCard);
  });
}

function setupEventListeners() {
  // Prompt input
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.addEventListener('input', handlePromptChange);
  }
  
  // Clear prompt button
  const clearPromptBtn = document.getElementById('clearPrompt');
  if (clearPromptBtn) {
    clearPromptBtn.addEventListener('click', clearPrompt);
  }
  
  // Framework checkboxes
  document.querySelectorAll('.framework-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleFrameworkChange);
  });
  
  // Framework cards - clicking card toggles checkbox
  document.querySelectorAll('.framework-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking the checkbox directly
      if (e.target.type === 'checkbox') return;
      
      const checkbox = card.querySelector('.framework-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });
  
  // Tab switching - fix the tab functionality
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', switchTab);
  });
  
  // Test interface
  const sendTestBtn = document.getElementById('sendTest');
  const testInput = document.getElementById('testInput');
  const fileUploadInput = document.getElementById('fileUpload');
  
  if (sendTestBtn) {
    sendTestBtn.addEventListener('click', sendTestMessage);
  }
  
  if (testInput) {
    testInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendTestMessage();
      }
    });
  }

  if (fileUploadInput) {
    fileUploadInput.addEventListener('change', handleFileUpload);
  }
  
  // Deployment options - fix deployment modal opening
  document.querySelectorAll('.deployment-option button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const deploymentType = e.target.closest('.deployment-option').dataset.deployment;
      showDeploymentModal(deploymentType);
    });
  });
  
  // Also add click handlers to the deployment option containers
  document.querySelectorAll('.deployment-option').forEach(option => {
    option.addEventListener('click', function(e) {
      if (e.target.tagName !== 'BUTTON') {
        const deploymentType = option.dataset.deployment;
        showDeploymentModal(deploymentType);
      }
    });
  });
  
  // Generate and export buttons
  const generateAgentBtn = document.getElementById('generateAgent');
  const exportConfigBtn = document.getElementById('exportConfig');
  
  if (generateAgentBtn) {
    generateAgentBtn.addEventListener('click', generateAgent);
  }
  
  if (exportConfigBtn) {
    exportConfigBtn.addEventListener('click', exportConfiguration);
  }
  
  // Add orchestration-related event listeners if elements exist
  const planAgentBtn = document.getElementById('planAgent');
  if (planAgentBtn) {
    planAgentBtn.addEventListener('click', planAgent);
  }
  
  // Add event listener for evaluation button (using class selector since no ID)
  document.querySelectorAll('.capability-card button').forEach(button => {
    if (button.textContent.trim() === 'Evaluate') {
      button.addEventListener('click', evaluateAgentForGoal);
    } else if (button.textContent.trim() === 'Configure' && button.closest('.capability-card').querySelector('h4').textContent.trim() === 'Multi-Agent Coordination') {
      button.addEventListener('click', configureMultiAgentCoordination);
    } else if (button.textContent.trim() === 'Configure' && button.closest('.capability-card').querySelector('h4').textContent.trim() === 'AP2 Payment Integration') {
      button.addEventListener('click', configureAP2Payment);
    }
  });
  
  // Modal controls
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('confirmModal').addEventListener('click', confirmModalAction);
  document.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

function selectTemplate(template) {
  // Update UI
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector(`[data-template-id="${template.id}"]`).classList.add('active');
  
  // Update state
  appState.selectedTemplate = template;
  
  // Create agent from template using domain service
  const agentDomainService = container.getAgentDomainService();
  const newAgent = agentDomainService.createAgentFromTemplate(template);
  appState.currentAgent = newAgent;
  
  // Update UI with agent details
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.value = appState.currentAgent.prompt.value;
  }
  
  updateCharCount();
  updateFrameworkCards();
  updateConfiguration();
  generatePreview();
}

async function handlePromptChange(e) {
  const newPrompt = e.target.value;
  
  // If we have a current agent, update its prompt
  if (appState.currentAgent) {
    const { AgentPrompt } = await import('./domain/value_objects/AgentPrompt.js');
    const agentPrompt = new AgentPrompt(newPrompt);
    appState.currentAgent = appState.currentAgent.updatePrompt(agentPrompt);
  }
  
  updateCharCount();
  generatePreview();
  
  // Clear template selection if prompt is manually changed
  if (appState.selectedTemplate && newPrompt !== appState.selectedTemplate.prompt) {
    appState.selectedTemplate = null;
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('active');
    });
  }
}

function updateCharCount() {
  const charCount = document.getElementById('charCount');
  if (!charCount) return;
  
  const prompt = appState.currentAgent?.prompt?.value || '';
  const count = prompt.length;
  charCount.textContent = `${count} characters`;
  
  if (count < 50) {
    charCount.style.color = 'var(--color-warning)';
  } else if (count > 1000) {
    charCount.style.color = 'var(--color-error)';
  } else {
    charCount.style.color = 'var(--color-text-secondary)';
  }
}

function clearPrompt() {
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.value = '';
  }
  
  appState.currentAgent = null;
  appState.selectedTemplate = null;
  
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  
  updateCharCount();
  generatePreview();
}

async function handleFrameworkChange(e) {
  const framework = e.target.id.toUpperCase();
  if (!appState.currentAgent) return;
  
  // Update framework configuration based on checkbox state
  const frameworkConfigs = appState.currentAgent.frameworkConfigs;
  
  if (e.target.checked) {
    // Add framework with default configuration
    const { FrameworkConfig } = await import('./domain/value_objects/FrameworkConfig.js');
    
    const defaultConfigs = {
      'A2A': { 
        name: appState.currentAgent.name.value || 'Generated Agent',
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
        tools: ['general_tools']
      },
      'MCP': { 
        server: 'stdio',
        tools: ['filesystem', 'database', 'web'],
        resources: ['files', 'databases', 'apis'],
        context_window: 4096
      }
    };
    
    const frameworkConfig = new FrameworkConfig(framework, defaultConfigs[framework] || {});
    appState.currentAgent = appState.currentAgent.addFrameworkConfig(frameworkConfig);
  } else {
    // Remove framework
    appState.currentAgent = appState.currentAgent.removeFrameworkConfig(framework);
  }
  
  updateFrameworkCards();
  updateConfiguration();
  generatePreview();
}

function updateFrameworkCards() {
  document.querySelectorAll('.framework-card').forEach(card => {
    const framework = card.dataset.framework;
    const isSelected = appState.currentAgent?.hasFramework(framework) || false;
    
    if (isSelected) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function updateConfiguration() {
  const configContent = document.getElementById('configContent');
  if (!configContent) return;

  if (!appState.currentAgent || appState.currentAgent.frameworkConfigs.length === 0) {
    configContent.innerHTML = `
      <div class="config-placeholder">
        <p>Select one or more frameworks above to configure your agent.</p>
      </div>
    `;
    return;
  }

  // Clear existing config sections
  configContent.innerHTML = '';

  // Add configuration sections for each selected framework
  appState.currentAgent.frameworkConfigs.forEach(frameworkConfig => {
    const configSection = document.createElement('div');
    configSection.dataset.framework = frameworkConfig.frameworkType;
    configSection.innerHTML = generateFrameworkConfig(frameworkConfig.frameworkType, frameworkConfig.configData);
    configContent.appendChild(configSection);
  });

  // Add event listeners to new config inputs
  const newInputs = configContent.querySelectorAll('.config-input:not([data-has-listener])');
  newInputs.forEach(input => {
    input.addEventListener('input', handleConfigChange);
    input.dataset.hasListener = true;
  });
}

function generateFrameworkConfig(framework, configData = {}) {
  // Default config values
  const defaults = {
    'A2A': { name: 'My Agent', discovery: 'multicast', port: 8080, security: 'tls' },
    'ADK': { workflow: 'sequential', environment: 'local', resources: 'CPU: 1, Memory: 512MB', retry: 'exponential' },
    'MCP': { server: 'stdio', tools: ['filesystem', 'database', 'web'], resources: ['files', 'databases', 'apis'], context_window: 4096 }
  };
  
  const defaultConfig = defaults[framework] || {};
  const finalConfig = { ...defaultConfig, ...configData };
  
  const configs = {
    'A2A': `
      <div class="config-section">
        <h3 class="config-section__title">A2A Protocol Configuration</h3>
        <div class="config-group">
          <label class="config-label">Agent Name</label>
          <input type="text" class="config-input" data-config="a2a.name" placeholder="My Agent" value="${finalConfig.name || ''}">
        </div>
        <div class="config-group">
          <label class="config-label">Discovery Protocol</label>
          <select class="config-input" data-config="a2a.discovery">
            <option value="multicast" ${finalConfig.discovery === 'multicast' ? 'selected' : ''}>Multicast Discovery</option>
            <option value="registry" ${finalConfig.discovery === 'registry' ? 'selected' : ''}>Registry-based</option>
            <option value="static" ${finalConfig.discovery === 'static' ? 'selected' : ''}>Static Configuration</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Communication Port</label>
          <input type="number" class="config-input" data-config="a2a.port" placeholder="8080" value="${finalConfig.port || 8080}">
        </div>
        <div class="config-group">
          <label class="config-label">Security Mode</label>
          <select class="config-input" data-config="a2a.security">
            <option value="tls" ${finalConfig.security === 'tls' ? 'selected' : ''}>TLS Encryption</option>
            <option value="mutual" ${finalConfig.security === 'mutual' ? 'selected' : ''}>Mutual Authentication</option>
            <option value="none" ${finalConfig.security === 'none' ? 'selected' : ''}>None (Development Only)</option>
          </select>
        </div>
      </div>
    `,
    'ADK': `
      <div class="config-section">
        <h3 class="config-section__title">ADK Framework Configuration</h3>
        <div class="config-group">
          <label class="config-label">Workflow Type</label>
          <select class="config-input" data-config="adk.workflow">
            <option value="sequential" ${finalConfig.workflow === 'sequential' ? 'selected' : ''}>Sequential</option>
            <option value="parallel" ${finalConfig.workflow === 'parallel' ? 'selected' : ''}>Parallel</option>
            <option value="conditional" ${finalConfig.workflow === 'conditional' ? 'selected' : ''}>Conditional</option>
            <option value="event-driven" ${finalConfig.workflow === 'event-driven' ? 'selected' : ''}>Event-driven</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Execution Environment</label>
          <select class="config-input" data-config="adk.environment">
            <option value="local" ${finalConfig.environment === 'local' ? 'selected' : ''}>Local Process</option>
            <option value="container" ${finalConfig.environment === 'container' ? 'selected' : ''}>Container</option>
            <option value="serverless" ${finalConfig.environment === 'serverless' ? 'selected' : ''}>Serverless Function</option>
            <option value="distributed" ${finalConfig.environment === 'distributed' ? 'selected' : ''}>Distributed System</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Resource Limits</label>
          <input type="text" class="config-input" data-config="adk.resources" placeholder="CPU: 1, Memory: 512MB" value="${finalConfig.resources || 'CPU: 1, Memory: 512MB'}">
        </div>
        <div class="config-group">
          <label class="config-label">Retry Policy</label>
          <select class="config-input" data-config="adk.retry">
            <option value="exponential" ${finalConfig.retry === 'exponential' ? 'selected' : ''}>Exponential Backoff</option>
            <option value="linear" ${finalConfig.retry === 'linear' ? 'selected' : ''}>Linear Backoff</option>
            <option value="immediate" ${finalConfig.retry === 'immediate' ? 'selected' : ''}>Immediate Retry</option>
            <option value="none" ${finalConfig.retry === 'none' ? 'selected' : ''}>No Retry</option>
          </select>
        </div>
      </div>
    `,
    'MCP': `
      <div class="config-section">
        <h3 class="config-section__title">MCP Protocol Configuration</h3>
        <div class="config-group">
          <label class="config-label">Server Implementation</label>
          <select class="config-input" data-config="mcp.server">
            <option value="stdio" ${finalConfig.server === 'stdio' ? 'selected' : ''}>Standard I/O</option>
            <option value="websocket" ${finalConfig.server === 'websocket' ? 'selected' : ''}>WebSocket</option>
            <option value="http" ${finalConfig.server === 'http' ? 'selected' : ''}>HTTP REST</option>
            <option value="grpc" ${finalConfig.server === 'grpc' ? 'selected' : ''}>gRPC</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Tool Categories</label>
          <input type="text" class="config-input" data-config="mcp.tools" placeholder="filesystem, database, web" value="${Array.isArray(finalConfig.tools) ? finalConfig.tools.join(', ') : 'filesystem, database, web'}">
        </div>
        <div class="config-group">
          <label class="config-label">Resource Types</label>
          <input type="text" class="config-input" data-config="mcp.resources" placeholder="files, databases, apis" value="${Array.isArray(finalConfig.resources) ? finalConfig.resources.join(', ') : 'files, databases, apis'}">
        </div>
        <div class="config-group">
          <label class="config-label">Context Window</label>
          <input type="number" class="config-input" data-config="mcp.context" placeholder="4096" value="${finalConfig.context_window || 4096}">
        </div>
      </div>
    `
  };
  
  return configs[framework] || '';
}

async async function handleConfigChange(e) {
  const configPath = e.target.dataset.config;
  const value = e.target.value;
  
  if (!appState.currentAgent) return;
  
  // Parse the config path (e.g. "a2a.name")
  const pathParts = configPath.split('.');
  if (pathParts.length < 2) return;
  
  const frameworkType = pathParts[0].toUpperCase();
  const configKey = pathParts[1];
  
  // Get existing config for this framework and update the specific value
  let frameworkConfig = appState.currentAgent.getFrameworkConfig(frameworkType);
  let configData = frameworkConfig ? frameworkConfig.configData : {};
  
  // Handle special cases for different data types
  let processedValue = value;
  if (configKey === 'port' || configKey === 'context' || configKey === 'context_window') {
    processedValue = parseInt(value) || 0;
  } else if (configKey === 'tools' || configKey === 'resources') {
    processedValue = value.split(',').map(item => item.trim()).filter(item => item);
  }
  
  // Update the config data
  configData = { ...configData, [configKey]: processedValue };
  
  // Create new FrameworkConfig and update agent
  const { FrameworkConfig } = await import('./domain/value_objects/FrameworkConfig.js');
  const updatedFrameworkConfig = new FrameworkConfig(frameworkType, configData);
  appState.currentAgent = appState.currentAgent.addFrameworkConfig(updatedFrameworkConfig);
  
  generatePreview();
}

function generatePreview() {
  const codePreview = document.getElementById('codePreview');
  if (!codePreview) return;
  
  if (!appState.currentAgent || appState.currentAgent.frameworkConfigs.length === 0) {
    codePreview.innerHTML = `
      <div class="preview-placeholder">
        <p>Your agent configuration will appear here once you provide a prompt and select frameworks.</p>
      </div>
    `;
    return;
  }
  
  const config = appState.currentAgent.generateConfiguration();
  codePreview.innerHTML = `<pre><code>${JSON.stringify(config, null, 2)}</code></pre>`;
}

function switchTab(e) {
  const targetTab = e.target.dataset.tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetTabContent = document.getElementById(targetTab + 'Tab');
  if (targetTabContent) {
    targetTabContent.classList.add('active');
  }
}

function sendTestMessage() {
  const input = document.getElementById('testInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  if (!appState.currentAgent || appState.currentAgent.frameworkConfigs.length === 0) {
    addTestMessage('system', 'Please configure your agent first by providing a prompt and selecting frameworks.');
    return;
  }
  
  // Add user message
  addTestMessage('user', message);
  input.value = '';
  
  // Simulate agent response with typing delay
  const messagesContainer = document.getElementById('testMessages');
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'test-message agent typing';
  typingIndicator.innerHTML = '<p>Agent is typing...</p>';
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  setTimeout(() => {
    messagesContainer.removeChild(typingIndicator);
    const response = generateTestResponse(message);
    addTestMessage('agent', response);
  }, 1500);
}

function addTestMessage(type, content) {
  const messages = document.getElementById('testMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `test-message ${type}`;
  messageDiv.innerHTML = `<p>${content}</p>`;
  
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function generateTestResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Context-aware responses based on selected frameworks and template
  let response = "";
  
  if (appState.selectedTemplate) {
    const templateName = appState.selectedTemplate.name.toLowerCase();
    
    if (templateName.includes('customer service')) {
      if (message.includes('order') || message.includes('purchase')) {
        response = "I can help you with your order inquiry. Let me look up your order information using my order lookup tools.";
      } else if (message.includes('return') || message.includes('refund')) {
        response = "I understand you'd like to process a return. I can guide you through our return process and help initiate the refund.";
      } else if (message.includes('problem') || message.includes('issue')) {
        response = "I see you're experiencing an issue. Let me gather some details and if needed, I can escalate this to our specialized support team.";
      } else {
        response = "Hello! I'm your customer service agent. I can help with orders, returns, product information, and escalate complex issues to human agents.";
      }
    } else if (templateName.includes('data analysis')) {
      if (message.includes('analyze') || message.includes('data')) {
        response = "I can analyze your data! Please upload your CSV file and I'll generate statistical reports and visualizations for you.";
      } else if (message.includes('report') || message.includes('insight')) {
        response = "I'll process your data and provide actionable business insights. My analysis will include statistical summaries and visual charts.";
      } else {
        response = "I'm your data analysis agent. I can process CSV files, generate reports, create visualizations, and provide business insights.";
      }
    } else if (templateName.includes('content')) {
      if (message.includes('write') || message.includes('content')) {
        response = "I can create various types of content for you! What type do you need - blog posts, social media content, or marketing copy?";
      } else if (message.includes('blog') || message.includes('article')) {
        response = "I'll help you write engaging blog content. Please provide your topic, target audience, and any brand guidelines.";
      } else {
        response = "I'm your content creation agent. I can write blog posts, social media content, and marketing copy adapted to your brand voice.";
      }
    } else if (templateName.includes('coordinator')) {
      response = "I'm coordinating multiple specialized agents for your complex workflow. I'll delegate tasks, monitor progress, and ensure quality control.";
    }
  }
  
  if (!response) {
    const frameworks = appState.currentAgent ? appState.currentAgent.frameworkConfigs.map(config => config.frameworkType) : [];
    const responses = [
      `I understand your request. Using ${frameworks.join(' and ')} frameworks, I can help you with that.`, 
      "That's an interesting question. Let me process that using my configured tools and capabilities.",
      "I'm configured to handle this type of request. Here's what I can do for you...",
      `Thanks for your message. I'm leveraging ${frameworks.join(', ')} to process your request effectively.`, 
      "Based on my training and configured frameworks, I can assist you with that task."
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }
  
  return response;
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const fileContent = e.target.result;
    let displayContent = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

    // For text files, display a snippet of content
    if (file.type.startsWith('text/')) {
      displayContent += `\nContent preview: ${fileContent.substring(0, 200)}...`;
    } else if (file.type.startsWith('image/')) {
      displayContent += '\n(Image file - preview not shown)';
    } else {
      displayContent += '\n(Binary file - preview not shown)';
    }

    addTestMessage('user', displayContent);
    addTestMessage('agent', `Received file: ${file.name}. I will now process it.`);
  };

  reader.onerror = function(e) {
    Logger.error('File reading error', e.target.error);
    addTestMessage('system', 'Error reading file.');
  };

  // Read file based on type
  if (file.type.startsWith('text/')) {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file); // Read as ArrayBuffer for non-text files
  }

  // Clear the input so the same file can be uploaded again
  event.target.value = '';
}

function showDeploymentModal(deploymentType) {
  const modal = document.getElementById('deploymentModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  const deploymentNames = {
    'local': 'Local Development',
    'cloud': 'Cloud Deployment', 
    'container': 'Container Deployment',
    'edge': 'Edge Deployment'
  };
  
  title.textContent = `${deploymentNames[deploymentType]} Configuration`;
  body.innerHTML = generateDeploymentForm(deploymentType);
  modal.classList.remove('hidden');
  
  // Store current deployment type for confirmation
  appState.currentDeploymentType = deploymentType;
}

function generateDeploymentForm(type) {
  const forms = {
    local: `
      <div class="form-group">
        <label class="form-label">Installation Directory</label>
        <input type="text" class="form-control" value="./agents/" placeholder="/path/to/agent">
      </div>
      <div class="form-group">
        <label class="form-label">Python Version</label>
        <select class="form-control">
          <option>Python 3.9</option>
          <option>Python 3.10</option>
          <option selected>Python 3.11</option>
          <option>Python 3.12</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Virtual Environment</label>
        <select class="form-control">
          <option selected>Create new venv</option>
          <option>Use existing venv</option>
          <option>Use conda</option>
        </select>
      </div>
    `,
    cloud: `
      <div class="form-group">
        <label class="form-label">Cloud Provider</label>
        <select class="form-control">
          <option>Amazon Web Services (AWS)</option>
          <option>Google Cloud Platform (GCP)</option>
          <option>Microsoft Azure</option>
          <option>DigitalOcean</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Region</label>
        <input type="text" class="form-control" placeholder="us-east-1">
      </div>
      <div class="form-group">
        <label class="form-label">Instance Type</label>
        <select class="form-control">
          <option>Small (1 CPU, 2GB RAM)</option>
          <option selected>Medium (2 CPU, 4GB RAM)</option>
          <option>Large (4 CPU, 8GB RAM)</option>
        </select>
      </div>
    `,
    container: `
      <div class="form-group">
        <label class="form-label">Base Image</label>
        <select class="form-control">
          <option selected>python:3.11-slim</option>
          <option>python:3.11-alpine</option>
          <option>ubuntu:22.04</option>
          <option>debian:bullseye</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Container Registry</label>
        <select class="form-control">
          <option>Docker Hub</option>
          <option>Amazon ECR</option>
          <option>Google Container Registry</option>
          <option>Private Registry</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Image Tag</label>
        <input type="text" class="form-control" placeholder="latest" value="latest">
      </div>
    `,
    edge: `
      <div class="form-group">
        <label class="form-label">Target Architecture</label>
        <select class="form-control">
          <option>ARM64</option>
          <option>AMD64</option>
          <option>ARM32</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Edge Platform</label>
        <select class="form-control">
          <option>Raspberry Pi</option>
          <option>NVIDIA Jetson</option>
          <option>Intel NUC</option>
          <option>Generic Linux</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Resource Constraints</label>
        <input type="text" class="form-control" placeholder="Memory: 1GB, Storage: 8GB">
      </div>
    `
  };
  
  return forms[type] || '<p>Configuration form not available.</p>';
}

function closeModal() {
  document.getElementById('deploymentModal').classList.add('hidden');
}

function confirmModalAction() {
  // Store deployment configuration
  const modalInputs = document.querySelectorAll('#deploymentModal .form-control');
  const config = {};
  
  modalInputs.forEach(input => {
    const label = input.previousElementSibling;
    if (label && input.value) {
      config[label.textContent] = input.value;
    }
  });
  
  appState.deploymentConfig[appState.currentDeploymentType] = config;
  
  // Show success message
  showNotification(`${appState.currentDeploymentType} deployment configuration saved successfully!`, 'success');
  
  closeModal();
}

async function generateAgent() {
  if (!appState.currentAgent || !appState.currentAgent.prompt.value || appState.currentAgent.frameworkConfigs.length === 0) {
    showNotification('Please provide a prompt for your agent and select at least one framework.', 'error');
    return;
  }
  
  // Show loading state
  const btn = document.getElementById('generateAgent');
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="spinner"></span> Generating...';
  btn.disabled = true;
  
  // Use the application use case to create the agent
  const createAgentUseCase = container.getCreateAgentUseCase();
  
  const request = {
    name: appState.currentAgent.name.value,
    prompt: appState.currentAgent.prompt.value,
    frameworkConfigs: appState.currentAgent.frameworkConfigs.map(config => ({
      frameworkType: config.frameworkType,
      configData: config.configData
    }))
  };
  
  const result = await createAgentUseCase.execute(request);
  
  if (result.success) {
    // Update current agent with the one created by the use case
    appState.currentAgent = result.agent;
    
    // Reset button
    btn.textContent = originalText;
    btn.disabled = false;
    
    showNotification('Agent generated successfully! You can now test it in the Test Agent tab.', 'success');
    
    // Update preview
    generatePreview();
    
    // Add initial system message to test interface
    const testMessages = document.getElementById('testMessages');
    if (testMessages) {
      testMessages.innerHTML = `
        <div class="test-message system">
          <p>Agent configured and ready for testing! Your agent supports: ${appState.currentAgent.frameworkConfigs.map(config => config.frameworkType).join(', ')}</p>
        </div>
      `;
    }
  } else {
    // Reset button
    btn.textContent = originalText;
    btn.disabled = false;
    
    showNotification('Error generating agent: ' + result.errors.join(', '), 'error');
  }
}

function exportConfiguration() {
  if (!appState.currentAgent) {
    showNotification('Nothing to export. Please configure and generate an agent first.', 'warning');
    return;
  }
  
  const config = appState.currentAgent.generateConfiguration();
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `agent-config-${Date.now()}.json`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Configuration exported successfully!', 'success');
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `validation-message ${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '1001';
  notification.style.minWidth = '300px';
  notification.style.maxWidth = '500px';
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      document.body.removeChild(notification);
    }
  }, 4000);
}

// New functions for orchestration capabilities

/**
 * Plans agent actions based on a goal
 */
async function planAgent() {
  if (!appState.currentAgent) {
    showNotification('Please configure an agent first.', 'error');
    return;
  }
  
  // Get goal from user input or use agent's prompt
  const goalInput = prompt('Enter the goal for your agent:', appState.currentAgent.prompt.value);
  if (!goalInput) {
    showNotification('Goal is required to create a plan.', 'error');
    return;
  }
  
  // Show loading state
  const btn = document.getElementById('planAgent') || document.getElementById('generateAgent');
  if (btn) {
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> Planning...';
    btn.disabled = true;
  }
  
  try {
    // Use the orchestration use case to create a plan
    const createAgenticPlanUseCase = container.getCreateAgenticPlanUseCase();
    
    const request = {
      goal: goalInput,
      agentId: appState.currentAgent.id?.value || null,
      availableTools: appState.currentAgent.frameworkConfigs.flatMap(config => config.configData.tools || [])
    };
    
    const result = await createAgenticPlanUseCase.execute(request);
    
    if (result.success) {
      showNotification('Agentic plan created successfully!', 'success');
      
      // Display plan in a special UI section
      displayAgenticPlan(result.plan);
    } else {
      showNotification('Error creating plan: ' + result.errors.join(', '), 'error');
    }
  } catch (error) {
    showNotification('Error creating plan: ' + error.message, 'error');
  } finally {
    // Reset button
    const btn = document.getElementById('planAgent') || document.getElementById('generateAgent');
    if (btn) {
      btn.textContent = btn.id === 'planAgent' ? 'Plan Agent' : 'Generate Agent';
      btn.disabled = false;
    }
  }
}

/**
 * Displays the agentic plan in the UI
 */
function displayAgenticPlan(plan) {
  const codePreview = document.getElementById('codePreview');
  if (!codePreview) return;
  
  const planHtml = `
    <div class="agentic-plan">
      <h3>Agentic Plan for: ${plan.goal}</h3>
      <div class="plan-overview">
        <p><strong>Framework:</strong> ${plan.frameworkType}</p>
        <p><strong>Estimated Time:</strong> ~${plan.estimatedTime} minutes</p>
        <p><strong>Required Tools:</strong> ${plan.requiredTools.join(', ')}</p>
      </div>
      <h4>Plan Steps:</h4>
      <ol class="plan-steps">
        ${plan.steps.map(step => `
          <li>
            <strong>${step.action}:</strong> ${step.description}
            ${step.dependencies.length > 0 ? `<br><small>Depends on: ${step.dependencies.join(', ')}</small>` : ''}
          </li>
        `).join('')}
      </ol>
      <h4>Success Criteria:</h4>
      <ul class="success-criteria">
        ${plan.successCriteria.map(criterion => `<li>${criterion}</li>`).join('')}
      </ul>
    </div>
  `;
  
  codePreview.innerHTML = planHtml;
}

/**
 * Evaluates the current agent for a specific goal
 */
async function evaluateAgentForGoal() {
  if (!appState.currentAgent) {
    showNotification('Please configure an agent first.', 'error');
    return;
  }
  
  // Get goal from user input or use agent's prompt
  const goalInput = prompt('Enter the goal to evaluate your agent against:', appState.currentAgent.prompt.value);
  if (!goalInput) {
    showNotification('Goal is required to perform evaluation.', 'error');
    return;
  }
  
  const evaluateAgentUseCase = container.getEvaluateAgentForGoalUseCase();
  
  const request = {
    agentId: appState.currentAgent.id?.value,
    goal: goalInput
  };
  
  const result = await evaluateAgentUseCase.execute(request);
  
  if (result.success) {
    showNotification(`Agent evaluation completed with score: ${result.evaluation.score}/100`, 'success');
    displayAgentEvaluation(result.evaluation);
  } else {
    showNotification('Error evaluating agent: ' + result.errors.join(', '), 'error');
  }
}

/**
 * Displays agent evaluation results in the UI
 */
function displayAgentEvaluation(evaluation) {
  const codePreview = document.getElementById('codePreview');
  if (!codePreview) return;
  
  const evaluationHtml = `
    <div class="agent-evaluation">
      <h3>Evaluation for: ${evaluation.goal}</h3>
      <div class="evaluation-score">
        <p><strong>Score:</strong> <span class="score-value">${evaluation.score}/100</span></p>
      </div>
      <h4>Feedback:</h4>
      <ul class="evaluation-feedback">
        ${evaluation.feedback.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <h4>Recommendations:</h4>
      <ul class="evaluation-recommendations">
        ${evaluation.recommendations.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
  
  codePreview.innerHTML = evaluationHtml;
}

/**
 * Configures multi-agent coordination
 */
async function configureMultiAgentCoordination() {
  if (!appState.currentAgent) {
    showNotification('Please configure an agent first.', 'error');
    return;
  }
  
  // Get coordination goal from user input
  const goalInput = prompt('Enter the coordination goal for multiple agents:', 'Coordinate multiple agents for complex tasks');
  if (!goalInput) {
    showNotification('Coordination goal is required.', 'error');
    return;
  }
  
  // For now, we'll just use the current agent, but in a real implementation
  // we would have multiple agents to coordinate
  const agentIds = [appState.currentAgent.id.value]; // This would be multiple agent IDs in a real scenario
  
  // In a real implementation, we'd have a list of agents available for coordination
  // For now, we'll just use the current agent and add some mock agents
  const mockAgentIds = [appState.currentAgent.id.value];
  
  // Show loading state
  const btns = document.querySelectorAll('.capability-card button');
  let coordBtn;
  btns.forEach(btn => {
    if (btn.textContent.trim() === 'Configure' && btn.closest('.capability-card').querySelector('h4').textContent.trim() === 'Multi-Agent Coordination') {
      coordBtn = btn;
    }
  });
  
  if (coordBtn) {
    const originalText = coordBtn.textContent;
    coordBtn.innerHTML = '<span class="spinner"></span> Coordinating...';
    coordBtn.disabled = true;
  }
  
  try {
    // Use the multi-agent coordination use case
    const createMultiAgentCoordinationUseCase = container.getCreateMultiAgentCoordinationUseCase();
    
    const request = {
      agentIds: mockAgentIds,
      coordinationGoal: goalInput
    };
    
    const result = await createMultiAgentCoordinationUseCase.execute(request);
    
    if (result.success) {
      showNotification('Multi-agent coordination plan created!', 'success');
      displayMultiAgentCoordinationPlan(result.coordinationPlan);
    } else {
      showNotification('Error creating coordination plan: ' + result.errors.join(', '), 'error');
    }
  } catch (error) {
    showNotification('Error creating coordination plan: ' + error.message, 'error');
  } finally {
    // Reset button
    if (coordBtn) {
      coordBtn.textContent = 'Configure';
      coordBtn.disabled = false;
    }
  }
}

/**
 * Displays multi-agent coordination plan in the UI
 */
function displayMultiAgentCoordinationPlan(coordinationPlan) {
  const codePreview = document.getElementById('codePreview');
  if (!codePreview) return;
  
  const planHtml = `
    <div class="multi-agent-plan">
      <h3>Multi-Agent Coordination Plan</h3>
      <p><strong>Goal:</strong> ${coordinationPlan.goal}</p>
      <p><strong>Communication Protocol:</strong> ${coordinationPlan.communicationProtocol}</p>
      
      <h4>Coordinated Agents:</h4>
      <ul class="coordinated-agents">
        ${coordinationPlan.agents.map(agent => `
          <li>
            <strong>${agent.name}</strong> (${agent.id}) - Role: ${agent.role}
            <ul>
              ${coordinationPlan.taskDistribution
                .find(d => d.agentId === agent.id)
                ?.tasks.map(task => `<li>${task}</li>`).join('') || '<li>No specific tasks assigned</li>'}
            </ul>
          </li>
        `).join('')}
      </ul>
      
      <h4>Coordination Steps:</h4>
      <ol class="coordination-steps">
        ${coordinationPlan.coordinationSteps.map(step => `
          <li><strong>${step.action}:</strong> ${step.description}</li>
        `).join('')}
      </ol>
    </div>
  `;
  
  codePreview.innerHTML = planHtml;
}

/**
 * Configures AP2 payment integration
 */
async function configureAP2Payment() {
  if (!appState.currentAgent) {
    showNotification('Please configure an agent first.', 'error');
    return;
  }
  
  // Check if agent has payment capabilities
  const ap2Service = container.getAP2DomainService();
  const hasPaymentCapabilities = ap2Service.hasPaymentCapabilities(appState.currentAgent);
  
  if (!hasPaymentCapabilities) {
    showNotification('This agent does not have payment processing capabilities. Add MCP framework with payment tools.', 'warning');
    return;
  }
  
  // Get payment details from user
  const amountInput = prompt('Enter payment amount:', '10.00');
  if (!amountInput) {
    showNotification('Amount is required for payment.', 'error');
    return;
  }
  
  const recipientInput = prompt('Enter payment recipient:', 'Merchant');
  if (!recipientInput) {
    showNotification('Recipient is required for payment.', 'error');
    return;
  }
  
  const descriptionInput = prompt('Enter payment description:', `Payment via ${appState.currentAgent.name.value}`);
  
  // Show loading state
  const btns = document.querySelectorAll('.capability-card button');
  let ap2Btn;
  btns.forEach(btn => {
    if (btn.textContent.trim() === 'Configure' && btn.closest('.capability-card').querySelector('h4').textContent.trim() === 'AP2 Payment Integration') {
      ap2Btn = btn;
    }
  });
  
  if (ap2Btn) {
    const originalText = ap2Btn.textContent;
    ap2Btn.innerHTML = '<span class="spinner"></span> Processing...';
    ap2Btn.disabled = true;
  }
  
  try {
    // Use the AP2 payment use case
    const processAgentPaymentUseCase = container.getProcessAgentPaymentUseCase();
    
    const request = {
      agentId: appState.currentAgent.id.value,
      paymentDetails: {
        amount: parseFloat(amountInput),
        currency: 'USD',
        methodType: 'DIGITAL_WALLET',
        methodDetails: { walletId: 'user-wallet-123' },
        description: descriptionInput,
        recipient: recipientInput
      }
    };
    
    const result = await processAgentPaymentUseCase.execute(request);
    
    if (result.success) {
      showNotification('AP2 payment configured and processed successfully!', 'success');
      displayAP2PaymentResult(result);
    } else {
      showNotification('Error processing payment: ' + result.errors.join(', '), 'error');
    }
  } catch (error) {
    showNotification('Error processing payment: ' + error.message, 'error');
  } finally {
    // Reset button
    if (ap2Btn) {
      ap2Btn.textContent = 'Configure';
      ap2Btn.disabled = false;
    }
  }
}

/**
 * Displays AP2 payment result in the UI
 */
function displayAP2PaymentResult(result) {
  const codePreview = document.getElementById('codePreview');
  if (!codePreview) return;
  
  const payment = result.payment;
  const processingPlan = result.processingPlan;
  
  const paymentHtml = `
    <div class="ap2-payment-result">
      <h3>AP2 Payment Result</h3>
      <div class="payment-summary">
        <p><strong>Amount:</strong> ${payment.amount.amount} ${payment.amount.currency}</p>
        <p><strong>Recipient:</strong> ${payment.recipient}</p>
        <p><strong>Description:</strong> ${payment.description}</p>
        <p><strong>Status:</strong> <span class="status-badge">${payment.status.value}</span></p>
        <p><strong>Processing Result:</strong> ${result.processingResult?.message || 'Payment processed'}</p>
      </div>
      
      ${processingPlan ? `
      <h4>Processing Plan:</h4>
      <ul class="payment-steps">
        ${processingPlan.steps.map(step => `
          <li><strong>${step.action}:</strong> ${step.description}</li>
        `).join('')}
      </ul>
      <p><strong>Estimated Time:</strong> ~${processingPlan.estimatedTime} minutes</p>
      ` : ''}
      
      <h4>Security Configuration:</h4>
      <ul class="security-features">
        <li><strong>Encryption:</strong> ${result.processingPlan?.security?.encryption || 'AES-256'}</li>
        <li><strong>Authentication:</strong> ${result.processingPlan?.security?.authentication || 'token-based'}</li>
        <li><strong>Audit Logging:</strong> ${result.processingPlan?.security?.audit_logging ? 'Enabled' : 'Disabled'}</li>
        <li><strong>Fraud Detection:</strong> ${result.processingPlan?.security?.fraud_detection ? 'Enabled' : 'Disabled'}</li>
      </ul>
    </div>
  `;
  
  codePreview.innerHTML = paymentHtml;
}