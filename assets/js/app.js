
// Application state
const appState = {
  prompt: '',
  selectedFrameworks: new Set(),
  selectedTemplate: null,
  configuration: {},
  generatedAgent: null,
  deploymentConfig: {}
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

// Add local storage for persistence
class StorageManager {
  static save(key, data) {
    try {
      // Handle Set serialization
      const replacer = (key, value) => {
        if (value instanceof Set) {
          return { dataType: 'Set', value: [...value] };
        }
        return value;
      };
      localStorage.setItem(key, JSON.stringify(data, replacer));
      return true;
    } catch (error) {
      Logger.error('Failed to save to localStorage', error);
      return false;
    }
  }

  static load(key) {
    try {
      const reviver = (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (value.dataType === 'Set') {
            return new Set(value.value);
          }
        }
        return value;
      };
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data, reviver) : null;
    } catch (error) {
      Logger.error('Failed to load from localStorage', error);
      return null;
    }
  }
}

// Auto-save functionality
function autoSaveState() {
  StorageManager.save('agentBuilderState', appState);
}

// Load previous state on initialization
function loadSavedState() {
  const savedState = StorageManager.load('agentBuilderState');
  if (savedState) {
    Object.assign(appState, savedState);
  }
}


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  loadSavedState();
  renderTemplates();
  renderFrameworkInfo();
  setupEventListeners();
  updateCharCount();
  syncCheckboxesWithState();
  updateFrameworkCards();
  updateConfiguration();
  generatePreview();
  
  // Ensure main content is visible
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';
  }
}

function syncCheckboxesWithState() {
  // Update prompt input
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.value = appState.prompt || '';
  }
  
  // Update framework checkboxes
  document.querySelectorAll('.framework-checkbox').forEach(checkbox => {
    const framework = checkbox.id.toUpperCase();
    checkbox.checked = appState.selectedFrameworks.has(framework);
  });
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
  promptInput.addEventListener('input', handlePromptChange);
  
  // Clear prompt button
  document.getElementById('clearPrompt').addEventListener('click', clearPrompt);
  
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
  document.getElementById('generateAgent').addEventListener('click', generateAgent);
  document.getElementById('exportConfig').addEventListener('click', exportConfiguration);
  
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
  appState.prompt = template.prompt;
  
  // Update prompt input
  document.getElementById('promptInput').value = template.prompt;
  updateCharCount();
  
  // Select recommended frameworks
  document.querySelectorAll('.framework-checkbox').forEach(checkbox => {
    const framework = checkbox.id.toUpperCase();
    const shouldCheck = template.frameworks.includes(framework);
    checkbox.checked = shouldCheck;
    
    if (shouldCheck) {
      appState.selectedFrameworks.add(framework);
    } else {
      appState.selectedFrameworks.delete(framework);
    }
  });
  
  updateFrameworkCards();
  updateConfiguration();
  generatePreview();
  autoSaveState();
}

function handlePromptChange(e) {
  appState.prompt = e.target.value;
  updateCharCount();
  autoSelectFrameworks();
  generatePreview();
  
  // Clear template selection if prompt is manually changed
  if (appState.selectedTemplate && appState.prompt !== appState.selectedTemplate.prompt) {
    appState.selectedTemplate = null;
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('active');
    });
  }
  autoSaveState();
}

function autoSelectFrameworks() {
  const prompt = appState.prompt.toLowerCase();
  const selectedFrameworks = new Set();

  if (prompt.includes('agent-to-agent') || prompt.includes('a2a') || prompt.includes('collaboration') || prompt.includes('multi-agent')) {
    selectedFrameworks.add('A2A');
  }

  if (prompt.includes('development kit') || prompt.includes('adk') || prompt.includes('workflow')) {
    selectedFrameworks.add('ADK');
  }

  if (prompt.includes('model context') || prompt.includes('mcp') || prompt.includes('external tools') || prompt.includes('data sources')) {
    selectedFrameworks.add('MCP');
  }

  appState.selectedFrameworks = selectedFrameworks;
  
  // Update checkboxes to match selected frameworks
  document.querySelectorAll('.framework-checkbox').forEach(checkbox => {
    const framework = checkbox.id.toUpperCase();
    checkbox.checked = selectedFrameworks.has(framework);
  });
  
  updateFrameworkCards();
  updateConfiguration();
}

function updateCharCount() {
  const charCount = document.getElementById('charCount');
  const count = appState.prompt.length;
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
  appState.prompt = '';
  appState.selectedTemplate = null;
  document.getElementById('promptInput').value = '';
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  updateCharCount();
  generatePreview();
  autoSaveState();
}

function handleFrameworkChange(e) {
  const framework = e.target.id.toUpperCase();
  
  if (e.target.checked) {
    appState.selectedFrameworks.add(framework);
  } else {
    appState.selectedFrameworks.delete(framework);
  }
  
  updateFrameworkCards();
  updateConfiguration();
  generatePreview();
  autoSaveState();
}

function updateFrameworkCards() {
  document.querySelectorAll('.framework-card').forEach(card => {
    const framework = card.dataset.framework;
    if (appState.selectedFrameworks.has(framework)) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function updateConfiguration() {
  const configContent = document.getElementById('configContent');

  // Remove configuration sections for frameworks that are no longer selected
  const existingConfigs = configContent.querySelectorAll('.config-section');
  existingConfigs.forEach(config => {
    const framework = config.dataset.framework;
    if (!appState.selectedFrameworks.has(framework)) {
      config.remove();
    }
  });

  // Add configuration sections for newly selected frameworks
  appState.selectedFrameworks.forEach(framework => {
    if (!configContent.querySelector(`[data-framework="${framework}"]`)) {
      const configSection = document.createElement('div');
      configSection.dataset.framework = framework;
      configSection.innerHTML = generateFrameworkConfig(framework);
      configContent.appendChild(configSection);
    }
  });

  // Show/hide placeholder
  const placeholder = configContent.querySelector('.config-placeholder');
  if (appState.selectedFrameworks.size === 0) {
    if (!placeholder) {
      configContent.innerHTML = `
        <div class="config-placeholder">
          <p>Select one or more frameworks above to configure your agent.</p>
        </div>
      `;
    }
  } else {
    if (placeholder) {
      placeholder.remove();
    }
  }

  // Add event listeners to new config inputs
  const newInputs = configContent.querySelectorAll('.config-input:not([data-has-listener])');
  newInputs.forEach(input => {
    input.addEventListener('input', handleConfigChange);
    input.dataset.hasListener = true;
  });
}

function generateFrameworkConfig(framework) {
  const configs = {
    'A2A': `
      <div class="config-section">
        <h3 class="config-section__title">A2A Protocol Configuration</h3>
        <div class="config-group">
          <label class="config-label">Agent Name</label>
          <input type="text" class="config-input" data-config="a2a.name" placeholder="My Agent">
        </div>
        <div class="config-group">
          <label class="config-label">Discovery Protocol</label>
          <select class="config-input" data-config="a2a.discovery">
            <option value="multicast">Multicast Discovery</option>
            <option value="registry">Registry-based</option>
            <option value="static">Static Configuration</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Communication Port</label>
          <input type="number" class="config-input" data-config="a2a.port" placeholder="8080" value="8080">
        </div>
        <div class="config-group">
          <label class="config-label">Security Mode</label>
          <select class="config-input" data-config="a2a.security">
            <option value="tls">TLS Encryption</option>
            <option value="mutual">Mutual Authentication</option>
            <option value="none">None (Development Only)</option>
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
            <option value="sequential">Sequential</option>
            <option value="parallel">Parallel</option>
            <option value="conditional">Conditional</option>
            <option value="event-driven">Event-driven</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Execution Environment</label>
          <select class="config-input" data-config="adk.environment">
            <option value="local">Local Process</option>
            <option value="container">Container</option>
            <option value="serverless">Serverless Function</option>
            <option value="distributed">Distributed System</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Resource Limits</label>
          <input type="text" class="config-input" data-config="adk.resources" placeholder="CPU: 1, Memory: 512MB">
        </div>
        <div class="config-group">
          <label class="config-label">Retry Policy</label>
          <select class="config-input" data-config="adk.retry">
            <option value="exponential">Exponential Backoff</option>
            <option value="linear">Linear Backoff</option>
            <option value="immediate">Immediate Retry</option>
            <option value="none">No Retry</option>
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
            <option value="stdio">Standard I/O</option>
            <option value="websocket">WebSocket</option>
            <option value="http">HTTP REST</option>
            <option value="grpc">gRPC</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Tool Categories</label>
          <input type="text" class="config-input" data-config="mcp.tools" placeholder="filesystem, database, web">
        </div>
        <div class="config-group">
          <label class="config-label">Resource Types</label>
          <input type="text" class="config-input" data-config="mcp.resources" placeholder="files, databases, apis">
        </div>
        <div class="config-group">
          <label class="config-label">Context Window</label>
          <input type="number" class="config-input" data-config="mcp.context" placeholder="4096" value="4096">
        </div>
      </div>
    `
  };
  
  return configs[framework] || '';
}

function handleConfigChange(e) {
  const configPath = e.target.dataset.config;
  const value = e.target.value;
  
  // Store configuration in nested object
  const pathParts = configPath.split('.');
  let current = appState.configuration;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) {
      current[pathParts[i]] = {};
    }
    current = current[pathParts[i]];
  }
  
  current[pathParts[pathParts.length - 1]] = value;
  generatePreview();
  autoSaveState();
}

function generatePreview() {
  const codePreview = document.getElementById('codePreview');
  
  if (!appState.prompt || appState.selectedFrameworks.size === 0) {
    codePreview.innerHTML = `
      <div class="preview-placeholder">
        <p>Your agent configuration will appear here once you provide a prompt and select frameworks.</p>
      </div>
    `;
    return;
  }
  
  const config = generateAgentConfig();
  codePreview.innerHTML = `<pre><code>${JSON.stringify(config, null, 2)}</code></pre>`;
}

function generateAgentConfig() {
  const config = {
    agent: {
      name: appState.configuration.a2a?.name || "Generated Agent",
      description: appState.prompt.substring(0, 200) + (appState.prompt.length > 200 ? '...' : ''),
      prompt: appState.prompt,
      frameworks: Array.from(appState.selectedFrameworks),
      created: new Date().toISOString()
    }
  };
  
  // Add framework-specific configurations
  if (appState.selectedFrameworks.has('A2A')) {
    config.a2a = {
      name: appState.configuration.a2a?.name || "Generated Agent",
      discovery: appState.configuration.a2a?.discovery || "multicast",
      port: parseInt(appState.configuration.a2a?.port) || 8080,
      security: appState.configuration.a2a?.security || "tls",
      capabilities: ["chat", "task-execution", "collaboration"]
    };
  }
  
  if (appState.selectedFrameworks.has('ADK')) {
    config.adk = {
      workflow: appState.configuration.adk?.workflow || "sequential",
      environment: appState.configuration.adk?.environment || "local",
      resources: appState.configuration.adk?.resources || "CPU: 1, Memory: 512MB",
      retry: appState.configuration.adk?.retry || "exponential",
      tools: getRecommendedTools()
    };
  }
  
  if (appState.selectedFrameworks.has('MCP')) {
    config.mcp = {
      server: appState.configuration.mcp?.server || "stdio",
      tools: (appState.configuration.mcp?.tools || "filesystem, database, web").split(',').map(t => t.trim()),
      resources: (appState.configuration.mcp?.resources || "files, databases, apis").split(',').map(r => r.trim()),
      context_window: parseInt(appState.configuration.mcp?.context) || 4096
    };
  }
  
  return config;
}

function getRecommendedTools() {
  if (appState.selectedTemplate) {
    return appState.selectedTemplate.tools;
  }
  
  // Analyze prompt for tool recommendations
  const prompt = appState.prompt.toLowerCase();
  const tools = [];
  
  if (prompt.includes('data') || prompt.includes('analysis')) {
    tools.push('data_processor', 'visualization');
  }
  if (prompt.includes('file') || prompt.includes('document')) {
    tools.push('file_handler', 'document_parser');
  }
  if (prompt.includes('web') || prompt.includes('api')) {
    tools.push('web_client', 'api_connector');
  }
  if (prompt.includes('database') || prompt.includes('storage')) {
    tools.push('database_connector', 'data_storage');
  }
  
  return tools.length > 0 ? tools : ['general_tools'];
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
  
  if (!appState.prompt || appState.selectedFrameworks.size === 0) {
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
    const frameworks = Array.from(appState.selectedFrameworks);
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
  autoSaveState();
}

function generateAgent() {
  if (!appState.prompt.trim()) {
    showNotification('Please provide a prompt for your agent.', 'error');
    return;
  }
  
  if (appState.selectedFrameworks.size === 0) {
    showNotification('Please select at least one framework (A2A, ADK, or MCP).', 'error');
    return;
  }
  
  // Show loading state
  const btn = document.getElementById('generateAgent');
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="spinner"></span> Generating...';
  btn.disabled = true;
  
  // Simulate generation process
  setTimeout(() => {
    appState.generatedAgent = generateAgentConfig();
    
    // Reset button
    btn.textContent = originalText;
    btn.disabled = false;
    
    showNotification('Agent generated successfully! You can now test it in the Test Agent tab.', 'success');
    
    // Update preview
    generatePreview();
    
    // Add initial system message to test interface
    const testMessages = document.getElementById('testMessages');
    testMessages.innerHTML = `
      <div class="test-message system">
        <p>Agent configured and ready for testing! Your agent supports: ${Array.from(appState.selectedFrameworks).join(', ')}</p>
      </div>
    `;
    autoSaveState();
  }, 2000);
}

function exportConfiguration() {
  if (!appState.generatedAgent && (!appState.prompt || appState.selectedFrameworks.size === 0)) {
    showNotification('Nothing to export. Please configure and generate an agent first.', 'warning');
    return;
  }
  
  const config = appState.generatedAgent || generateAgentConfig();
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
