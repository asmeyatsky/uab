/**
 * Dependency Injection Container
 * Sets up and provides instances of application components following the hexagonal architecture
 */

import { AgentDomainService } from '../domain/services/AgentDomainService.js';
import { AgentOrchestratorService } from '../domain/services/AgentOrchestratorService.js';
import { AP2DomainService } from '../domain/services/payment/AP2DomainService.js';
import { InMemoryAgentRepository } from '../infrastructure/repositories/InMemoryAgentRepository.js';
import { FrameworkConfigurationAdapter } from '../infrastructure/adapters/FrameworkConfigurationAdapter.js';
import { MockPaymentProcessorAdapter } from '../infrastructure/adapters/payment/MockPaymentProcessorAdapter.js';
import { 
  CreateAgentUseCase, 
  UpdateAgentUseCase, 
  GetAgentUseCase, 
  ListAgentsUseCase, 
  DeleteAgentUseCase,
  ConfigureAgentFrameworksUseCase 
} from '../application/use_cases/AgentUseCases.js';
import {
  CreateAgenticPlanUseCase,
  EvaluateAgentForGoalUseCase,
  CreateMultiAgentCoordinationUseCase
} from '../application/use_cases/AgentOrchestrationUseCases.js';
import {
  CreatePaymentUseCase,
  ProcessAgentPaymentUseCase,
  CreatePaymentAuthorizationPlanUseCase
} from '../application/use_cases/payment/AP2UseCases.js';

export class DIContainer {
  constructor() {
    // Infrastructure
    this.agentRepository = new InMemoryAgentRepository();
    this.frameworkConfigAdapter = new FrameworkConfigurationAdapter();
    this.paymentProcessorAdapter = new MockPaymentProcessorAdapter();
    
    // Domain
    this.agentDomainService = new AgentDomainService();
    this.agentOrchestratorService = new AgentOrchestratorService();
    this.ap2DomainService = new AP2DomainService();
    
    // Application (Use Cases)
    this.createAgentUseCase = new CreateAgentUseCase(
      this.agentDomainService, 
      this.agentRepository
    );
    this.updateAgentUseCase = new UpdateAgentUseCase(
      this.agentDomainService, 
      this.agentRepository
    );
    this.getAgentUseCase = new GetAgentUseCase(this.agentRepository);
    this.listAgentsUseCase = new ListAgentsUseCase(this.agentRepository);
    this.deleteAgentUseCase = new DeleteAgentUseCase(this.agentRepository);
    this.configureAgentFrameworksUseCase = new ConfigureAgentFrameworksUseCase(
      this.agentDomainService,
      this.agentRepository
    );
    
    // Orchestration Use Cases
    this.createAgenticPlanUseCase = new CreateAgenticPlanUseCase(
      this.agentOrchestratorService,
      this.agentRepository
    );
    this.evaluateAgentForGoalUseCase = new EvaluateAgentForGoalUseCase(
      this.agentOrchestratorService,
      this.agentRepository
    );
    this.createMultiAgentCoordinationUseCase = new CreateMultiAgentCoordinationUseCase(
      this.agentOrchestratorService,
      this.agentRepository
    );
    
    // AP2 Use Cases
    this.createPaymentUseCase = new CreatePaymentUseCase(
      this.ap2DomainService,
      this.paymentProcessorAdapter,
      this.agentRepository
    );
    this.processAgentPaymentUseCase = new ProcessAgentPaymentUseCase(
      this.ap2DomainService,
      this.paymentProcessorAdapter,
      this.agentRepository
    );
    this.createPaymentAuthorizationPlanUseCase = new CreatePaymentAuthorizationPlanUseCase(
      this.ap2DomainService,
      this.agentRepository
    );
  }
  
  // Getter methods to access services
  getAgentRepository() {
    return this.agentRepository;
  }
  
  getFrameworkConfigAdapter() {
    return this.frameworkConfigAdapter;
  }
  
  getPaymentProcessorAdapter() {
    return this.paymentProcessorAdapter;
  }
  
  getAgentDomainService() {
    return this.agentDomainService;
  }
  
  getAgentOrchestratorService() {
    return this.agentOrchestratorService;
  }
  
  getAP2DomainService() {
    return this.ap2DomainService;
  }
  
  getCreateAgentUseCase() {
    return this.createAgentUseCase;
  }
  
  getUpdateAgentUseCase() {
    return this.updateAgentUseCase;
  }
  
  getGetAgentUseCase() {
    return this.getAgentUseCase;
  }
  
  getListAgentsUseCase() {
    return this.listAgentsUseCase;
  }
  
  getDeleteAgentUseCase() {
    return this.deleteAgentUseCase;
  }
  
  getConfigureAgentFrameworksUseCase() {
    return this.configureAgentFrameworksUseCase;
  }
  
  getCreateAgenticPlanUseCase() {
    return this.createAgenticPlanUseCase;
  }
  
  getEvaluateAgentForGoalUseCase() {
    return this.evaluateAgentForGoalUseCase;
  }
  
  getCreateMultiAgentCoordinationUseCase() {
    return this.createMultiAgentCoordinationUseCase;
  }
  
  getCreatePaymentUseCase() {
    return this.createPaymentUseCase;
  }
  
  getProcessAgentPaymentUseCase() {
    return this.processAgentPaymentUseCase;
  }
  
  getCreatePaymentAuthorizationPlanUseCase() {
    return this.createPaymentAuthorizationPlanUseCase;
  }
}

// Global DI container instance
export const container = new DIContainer();