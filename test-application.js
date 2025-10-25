/**
 * Application Layer Tests
 * Following architectural principles from SKILL.md
 */

// Import all application components
import { 
  CreateAgentUseCase, 
  UpdateAgentUseCase, 
  GetAgentUseCase, 
  ListAgentsUseCase, 
  DeleteAgentUseCase,
  ConfigureAgentFrameworksUseCase 
} from './application/use_cases/AgentUseCases.js';
import {
  CreateAgenticPlanUseCase,
  EvaluateAgentForGoalUseCase,
  CreateMultiAgentCoordinationUseCase
} from './application/use_cases/AgentOrchestrationUseCases.js';
import { AgentDomainService } from './domain/services/AgentDomainService.js';
import { InMemoryAgentRepository } from './infrastructure/repositories/InMemoryAgentRepository.js';

// Mock repository for testing
class MockAgentRepository {
  constructor() {
    this.agents = new Map();
  }

  async save(agent) {
    this.agents.set(agent.id.value, agent);
  }

  async findById(id) {
    return this.agents.get(id) || null;
  }

  async findAll() {
    return Array.from(this.agents.values());
  }

  async delete(id) {
    this.agents.delete(id);
  }
}

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

console.log('🧪 Running Application Layer Tests...\n');

// Test Use Cases
runner.test('CreateAgentUseCase should create an agent successfully', async () => {
  const mockRepo = new MockAgentRepository();
  const domainService = new AgentDomainService();
  const useCase = new CreateAgentUseCase(domainService, mockRepo);

  const request = {
    name: 'Test Agent',
    prompt: 'This is a test agent',
    frameworkConfigs: [
      { frameworkType: 'A2A', configData: { name: 'Test Agent', port: 8080 } }
    ]
  };

  const result = await useCase.execute(request);
  return result.success && result.agent.name.value === 'Test Agent';
});

runner.test('GetAgentUseCase should retrieve an agent', async () => {
  const mockRepo = new MockAgentRepository();
  const domainService = new AgentDomainService();
  const createUseCase = new CreateAgentUseCase(domainService, mockRepo);

  // First create an agent
  const createRequest = {
    name: 'Test Agent',
    prompt: 'This is a test agent',
    frameworkConfigs: [
      { frameworkType: 'A2A', configData: { name: 'Test Agent', port: 8080 } }
    ]
  };

  const createResult = await createUseCase.execute(createRequest);
  if (!createResult.success) return false;

  // Then get the agent
  const getUseCase = new GetAgentUseCase(mockRepo);
  const getRequest = { id: createResult.agent.id.value };
  const getResult = await getUseCase.execute(getRequest);

  return getResult.success && getResult.agent.id.value === createResult.agent.id.value;
});

runner.test('UpdateAgentUseCase should update an agent', async () => {
  const mockRepo = new MockAgentRepository();
  const domainService = new AgentDomainService();
  const createUseCase = new CreateAgentUseCase(domainService, mockRepo);

  // First create an agent
  const createRequest = {
    name: 'Original Agent',
    prompt: 'Original prompt',
    frameworkConfigs: []
  };

  const createResult = await createUseCase.execute(createRequest);
  if (!createResult.success) return false;

  // Then update the agent
  const updateUseCase = new UpdateAgentUseCase(domainService, mockRepo);
  const updateRequest = {
    id: createResult.agent.id.value,
    name: 'Updated Agent',
    prompt: 'Updated prompt'
  };
  const updateResult = await updateUseCase.execute(updateRequest);

  return updateResult.success && updateResult.agent.name.value === 'Updated Agent';
});

runner.test('ConfigureAgentFrameworksUseCase should update framework configs', async () => {
  const mockRepo = new MockAgentRepository();
  const domainService = new AgentDomainService();
  const createUseCase = new CreateAgentUseCase(domainService, mockRepo);

  // First create an agent
  const createRequest = {
    name: 'Test Agent',
    prompt: 'Test agent for framework config',
    frameworkConfigs: [
      { frameworkType: 'A2A', configData: { name: 'Test', port: 8080 } }
    ]
  };

  const createResult = await createUseCase.execute(createRequest);
  if (!createResult.success) return false;

  // Then update framework configs
  const configUseCase = new ConfigureAgentFrameworksUseCase(domainService, mockRepo);
  const configRequest = {
    id: createResult.agent.id.value,
    frameworkConfigs: [
      { frameworkType: 'MCP', configData: { server: 'stdio', context_window: 2048 } },
      { frameworkType: 'ADK', configData: { workflow: 'parallel', environment: 'container' } }
    ]
  };

  const configResult = await configUseCase.execute(configRequest);
  return configResult.success && 
         configResult.agent.hasFramework('MCP') && 
         configResult.agent.hasFramework('ADK') &&
         !configResult.agent.hasFramework('A2A');
});

runner.test('CreateAgenticPlanUseCase should create a plan', async () => {
  const mockRepo = new MockAgentRepository();
  const orchestratorService = await import('./domain/services/AgentOrchestratorService.js');
  const service = new orchestratorService.AgentOrchestratorService();
  const useCase = new CreateAgenticPlanUseCase(service, mockRepo);

  const request = {
    goal: 'Analyze sales data to identify trends',
    availableTools: ['data_processor', 'visualization'],
    frameworkType: 'ADK'
  };

  const result = await useCase.execute(request);
  return result.success && result.plan && result.plan.steps.length > 0;
});

runner.test('EvaluateAgentForGoalUseCase should evaluate agent', async () => {
  const mockRepo = new MockAgentRepository();
  const orchestratorService = await import('./domain/services/AgentOrchestratorService.js');
  const service = new orchestratorService.AgentOrchestratorService();
  
  // Create an agent first using domain service
  const domainService = new AgentDomainService();
  const agent = domainService.createAgent(
    'Test Agent',
    'Test agent for sales analysis',
    [
      { frameworkType: 'ADK', configData: { tools: ['data_processor'] } }
    ]
  );
  
  await mockRepo.save(agent);

  const useCase = new EvaluateAgentForGoalUseCase(service, mockRepo);
  const request = {
    agentId: agent.id.value,
    goal: 'Perform data analysis'
  };

  const result = await useCase.execute(request);
  return result.success && result.evaluation && result.evaluation.score >= 0;
});

// Run the tests and report results
const results = runner.report();

// Export for use in other contexts if needed
if (typeof window !== 'undefined') {
  window.ApplicationLayerTestResults = results;
}

console.log('\n🎯 Application Layer Tests Complete!');