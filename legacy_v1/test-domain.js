/**
 * Domain Layer Tests
 * Following architectural principles from SKILL.md
 */

// Import all domain components
import { Agent } from './domain/entities/Agent.js';
import { AgentId } from './domain/value_objects/AgentId.js';
import { AgentName } from './domain/value_objects/AgentName.js';
import { AgentPrompt } from './domain/value_objects/AgentPrompt.js';
import { FrameworkConfig } from './domain/value_objects/FrameworkConfig.js';
import { AgentStatus } from './domain/value_objects/AgentStatus.js';
import { DateTime } from './domain/value_objects/DateTime.js';
import { AgentDomainService } from './domain/services/AgentDomainService.js';
import { AgentOrchestratorService } from './domain/services/AgentOrchestratorService.js';

// Test utilities
class TestReporter {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    try {
      const result = testFn();
      if (result) {
        this.passed++;
        this.tests.push({ name, status: 'PASS', result });
        console.log(`✅ ${name}`);
      } else {
        this.failed++;
        this.tests.push({ name, status: 'FAIL', result });
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      this.failed++;
      this.tests.push({ name, status: 'ERROR', error: error.message });
      console.log(`💥 ${name}: ${error.message}`);
    }
  }

  report() {
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    if (this.failed > 0) {
      console.log('Failed tests:');
      this.tests
        .filter(t => t.status !== 'PASS')
        .forEach(t => console.log(`  ${t.name}: ${t.status} - ${t.error || t.result}`));
    }
    return { passed: this.passed, failed: this.failed };
  }
}

// Run tests
const runner = new TestReporter();

console.log('🧪 Running Domain Layer Tests...\n');

// Test Value Objects
runner.test('AgentId should be immutable and valid', () => {
  const id = new AgentId('test-id-123');
  return id.value === 'test-id-123';
});

runner.test('AgentName should validate and trim input', () => {
  const name = new AgentName('  Test Agent  ');
  return name.value === 'Test Agent';
});

runner.test('AgentPrompt should validate length', () => {
  const prompt = new AgentPrompt('This is a valid prompt for testing');
  return prompt.value === 'This is a valid prompt for testing';
});

runner.test('FrameworkConfig should validate framework type', () => {
  const config = new FrameworkConfig('A2A', { name: 'Test' });
  return config.frameworkType === 'A2A' && config.configData.name === 'Test';
});

runner.test('FrameworkConfig should add to agent config correctly', () => {
  const config = new FrameworkConfig('A2A', { port: 8080 });
  const agentConfig = {};
  config.addToAgentConfig(agentConfig);
  return agentConfig.a2a && agentConfig.a2a.port === 8080;
});

runner.test('DateTime should handle current time', () => {
  const now = DateTime.now();
  return now.value instanceof Date;
});

// Test Entity
runner.test('Agent entity should be created with valid parameters', () => {
  const id = new AgentId('agent-123');
  const name = new AgentName('Test Agent');
  const prompt = new AgentPrompt('Test prompt');
  const status = new AgentStatus('DRAFT');
  const createdAt = DateTime.now();
  const frameworkConfig = new FrameworkConfig('A2A', { test: 'value' });

  const agent = new Agent(id, name, prompt, [frameworkConfig], status, createdAt, createdAt);
  return agent.id.value === 'agent-123' && agent.name.value === 'Test Agent';
});

runner.test('Agent should update name correctly', () => {
  const id = new AgentId('agent-123');
  const name = new AgentName('Test Agent');
  const prompt = new AgentPrompt('Test prompt');
  const status = new AgentStatus('DRAFT');
  const createdAt = DateTime.now();
  const frameworkConfig = new FrameworkConfig('A2A', { test: 'value' });

  const agent = new Agent(id, name, prompt, [frameworkConfig], status, createdAt, createdAt);
  const newName = new AgentName('Updated Agent');
  const updatedAgent = agent.updateName(newName);

  return updatedAgent.name.value === 'Updated Agent' && agent.name.value === 'Test Agent';
});

runner.test('Agent should add framework config correctly', () => {
  const id = new AgentId('agent-123');
  const name = new AgentName('Test Agent');
  const prompt = new AgentPrompt('Test prompt');
  const status = new AgentStatus('DRAFT');
  const createdAt = DateTime.now();
  const frameworkConfig = new FrameworkConfig('A2A', { test: 'value' });

  const agent = new Agent(id, name, prompt, [frameworkConfig], status, createdAt, createdAt);
  const newConfig = new FrameworkConfig('MCP', { server: 'stdio' });
  const updatedAgent = agent.addFrameworkConfig(newConfig);

  return updatedAgent.frameworkConfigs.length === 2 && 
         updatedAgent.hasFramework('MCP') &&
         updatedAgent.hasFramework('A2A');
});

// Test Domain Service
runner.test('AgentDomainService should create agent with template', () => {
  const service = new AgentDomainService();
  const template = {
    name: 'Test Template',
    prompt: 'Create a test agent',
    frameworks: ['A2A', 'MCP'],
    tools: ['test_tool']
  };

  const agent = service.createAgentFromTemplate(template);
  return agent.name.value === 'Test Template' && 
         agent.hasFramework('A2A') && 
         agent.hasFramework('MCP');
});

runner.test('AgentDomainService should recommend frameworks correctly', () => {
  const service = new AgentDomainService();
  const frameworks = service.recommendFrameworks('I need an agent-to-agent collaboration system');
  return frameworks.includes('A2A');
});

runner.test('AgentOrchestratorService should create agentic plan', () => {
  const service = new AgentOrchestratorService();
  const plan = service.createAgenticPlan('Analyze sales data', ['data_processor'], 'ADK');
  return plan.goal === 'Analyze sales data' && plan.steps.length > 0;
});

runner.test('AgentOrchestratorService should evaluate agent for goal', () => {
  const service = new AgentOrchestratorService();
  const id = new AgentId('test-123');
  const name = new AgentName('Test Agent');
  const prompt = new AgentPrompt('Test agent for sales analysis');
  const status = new AgentStatus('DRAFT');
  const createdAt = DateTime.now();
  const frameworkConfig = new FrameworkConfig('ADK', { tools: ['data_processor'] });
  const agent = new Agent(id, name, prompt, [frameworkConfig], status, createdAt, createdAt);

  const evaluation = service.evaluateAgentForGoal(agent, 'Perform data analysis');
  return evaluation.agentId === 'test-123';
});

// Run the tests and report results
const results = runner.report();

// Export for use in other contexts if needed
if (typeof window !== 'undefined') {
  window.DomainLayerTestResults = results;
}

console.log('\n🎯 Domain Layer Tests Complete!');