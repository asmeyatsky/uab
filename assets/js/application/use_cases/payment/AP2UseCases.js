/**
 * AP2 Use Cases - Application Layer
 * 
 * Contains application-specific business rules for AP2 (Agents-to-Payments) protocol
 */

import { AP2DomainService } from '../../domain/services/payment/AP2DomainService.js';

export class CreatePaymentUseCase {
  /**
   * @param {AP2DomainService} ap2DomainService - Domain service for AP2 operations
   * @param {PaymentProcessorPort} paymentProcessor - Payment processor implementation
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(ap2DomainService, paymentProcessor, agentRepository) {
    this.ap2DomainService = ap2DomainService;
    this.paymentProcessor = paymentProcessor;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to create a new payment
   * @param {Object} request - Request object containing payment details
   * @param {number} request.amount - Payment amount
   * @param {string} request.currency - Payment currency
   * @param {string} request.methodType - Payment method type
   * @param {Object} request.methodDetails - Payment method details
   * @param {string} request.description - Payment description
   * @param {string} request.recipient - Payment recipient
   * @param {string} [request.agentId] - Optional agent ID that will process this payment
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.amount || request.amount <= 0) {
        return {
          success: false,
          errors: ['Amount is required and must be greater than zero']
        };
      }

      // If agent ID is provided, check if agent exists and has payment capabilities
      if (request.agentId) {
        const agent = await this.agentRepository.findById(request.agentId);
        if (!agent) {
          return {
            success: false,
            errors: ['Agent not found']
          };
        }

        // Check if agent has payment capabilities
        const hasPaymentCapabilities = this.ap2DomainService.hasPaymentCapabilities(agent);
        if (!hasPaymentCapabilities) {
          return {
            success: false,
            errors: ['Agent does not have payment processing capabilities']
          };
        }
      }

      // Create the payment using domain service
      const payment = this.ap2DomainService.createPayment(
        request.amount,
        request.currency,
        request.methodType,
        request.methodDetails,
        request.description,
        request.recipient
      );

      // Validate the payment
      const validationErrors = this.ap2DomainService.validatePayment(payment);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // Process the payment
      const result = await this.paymentProcessor.processPayment(payment);

      return {
        success: true,
        payment: payment,
        processingResult: result,
        message: 'Payment created and initiated successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class ProcessAgentPaymentUseCase {
  /**
   * @param {AP2DomainService} ap2DomainService - Domain service for AP2 operations
   * @param {PaymentProcessorPort} paymentProcessor - Payment processor implementation
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(ap2DomainService, paymentProcessor, agentRepository) {
    this.ap2DomainService = ap2DomainService;
    this.paymentProcessor = paymentProcessor;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to have an agent process a payment
   * @param {Object} request - Request object containing payment and agent details
   * @param {string} request.agentId - ID of agent to process payment
   * @param {Object} request.paymentDetails - Payment details
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // Validate inputs
      if (!request.agentId) {
        return {
          success: false,
          errors: ['Agent ID is required']
        };
      }

      if (!request.paymentDetails) {
        return {
          success: false,
          errors: ['Payment details are required']
        };
      }

      // Get the agent
      const agent = await this.agentRepository.findById(request.agentId);
      if (!agent) {
        return {
          success: false,
          errors: ['Agent not found']
        };
      }

      // Check if agent has payment capabilities
      const hasPaymentCapabilities = this.ap2DomainService.hasPaymentCapabilities(agent);
      if (!hasPaymentCapabilities) {
        return {
          success: false,
          errors: ['Agent does not have payment processing capabilities']
        };
      }

      // Create payment for the agent
      const payment = this.ap2DomainService.createAgentPayment(agent, request.paymentDetails);

      // Validate the payment
      const validationErrors = this.ap2DomainService.validatePayment(payment);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // Create processing plan
      const processingPlan = this.ap2DomainService.createPaymentProcessingPlan(agent, payment);

      // Process the payment
      const result = await this.paymentProcessor.processPayment(payment);

      return {
        success: true,
        payment: payment,
        processingPlan: processingPlan,
        processingResult: result,
        message: 'Agent payment processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export class CreatePaymentAuthorizationPlanUseCase {
  /**
   * @param {AP2DomainService} ap2DomainService - Domain service for AP2 operations
   * @param {AgentRepositoryPort} agentRepository - Repository for agent persistence
   */
  constructor(ap2DomainService, agentRepository) {
    this.ap2DomainService = ap2DomainService;
    this.agentRepository = agentRepository;
  }

  /**
   * Executes the use case to create a payment authorization plan
   * @param {Object} request - Request object containing payment details
   * @param {string} request.paymentId - ID of payment to create authorization plan for
   * @param {string} [request.agentId] - Optional agent ID to execute the plan
   * @returns {Promise<Object>} Result of the operation
   */
  async execute(request) {
    try {
      // For this example, we'll create a simple plan without retrieving the payment from a repo
      // In a real implementation, we'd have a payment repository to fetch the payment
      // Here we'll simulate a payment object with minimal details needed for the plan
      
      // If we had the payment, we'd load it like this:
      // const payment = await this.paymentRepository.findById(request.paymentId);
      
      // Since we don't have a payment repository yet, we'll create a minimal payment object
      // just for the purpose of creating the plan
      const mockPayment = {
        id: { value: request.paymentId || 'mock-payment-id' },
        // In a real implementation, we'd use a proper payment object
      };

      // Create authorization plan
      const plan = this.ap2DomainService.createAuthorizationPlan({
        id: { value: request.paymentId || 'mock-payment-id' },
        amount: { amount: 100, currency: 'USD' } // Mock values
      });

      // If an agent is provided, enhance the plan with agent-specific details
      if (request.agentId) {
        const agent = await this.agentRepository.findById(request.agentId);
        if (agent) {
          const agentSecurity = this.ap2DomainService.generatePaymentSecurity(agent);
          plan.agentSecurity = agentSecurity;
        }
      }

      return {
        success: true,
        authorizationPlan: plan,
        message: 'Payment authorization plan created successfully'
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}