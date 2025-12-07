/**
 * AP2DomainService - Domain Layer
 * 
 * Service for handling AP2 (Agents-to-Payments) protocol operations
 */
import { Payment } from '../entities/payment/Payment.js';
import { PaymentId } from '../value_objects/payment/PaymentId.js';
import { PaymentAmount } from '../value_objects/payment/PaymentAmount.js';
import { PaymentMethod } from '../value_objects/payment/PaymentMethod.js';
import { PaymentStatus } from '../value_objects/payment/PaymentStatus.js';
import { DateTime } from '../value_objects/DateTime.js';

export class AP2DomainService {
  /**
   * Creates a new payment
   * @param {number} amount - Payment amount
   * @param {string} currency - Payment currency
   * @param {string} methodType - Payment method type
   * @param {Object} methodDetails - Payment method details
   * @param {string} description - Payment description
   * @param {string} recipient - Payment recipient
   * @returns {Payment} New payment instance
   */
  createPayment(amount, currency, methodType, methodDetails, description, recipient) {
    const paymentId = new PaymentId(this._generateId());
    const paymentAmount = new PaymentAmount(amount, currency);
    const paymentMethod = new PaymentMethod(methodType, methodDetails);
    const status = new PaymentStatus('PENDING');
    const createdAt = DateTime.now();
    
    return new Payment(
      paymentId,
      paymentAmount,
      paymentMethod,
      description,
      recipient,
      status,
      createdAt,
      createdAt
    );
  }

  /**
   * Creates a payment for an agent to execute
   * @param {Agent} agent - Agent that will execute the payment
   * @param {Object} paymentDetails - Payment details
   * @returns {Payment} New payment instance
   */
  createAgentPayment(agent, paymentDetails) {
    const {
      amount,
      currency = 'USD',
      methodType = 'DIGITAL_WALLET',
      methodDetails = {},
      description = `Payment from agent: ${agent.name.value}`,
      recipient
    } = paymentDetails;

    return this.createPayment(
      amount,
      currency,
      methodType,
      methodDetails,
      description,
      recipient
    );
  }

  /**
   * Validates a payment for AP2 compliance
   * @param {Payment} payment - Payment to validate
   * @returns {Array<string>} List of validation errors, empty if valid
   */
  validatePayment(payment) {
    const errors = [];

    if (!payment.amount || payment.amount.amount <= 0) {
      errors.push('Payment amount must be greater than zero');
    }

    if (!payment.description || payment.description.trim().length === 0) {
      errors.push('Payment description is required');
    }

    if (!payment.recipient || payment.recipient.trim().length === 0) {
      errors.push('Payment recipient is required');
    }

    // Ensure only valid status transitions
    if (!['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELLED'].includes(payment.status.value)) {
      errors.push('Invalid payment status');
    }

    return errors;
  }

  /**
   * Checks if an agent has payment capabilities
   * @param {Agent} agent - Agent to check
   * @returns {boolean} True if the agent has payment capabilities
   */
  hasPaymentCapabilities(agent) {
    // Check if the agent has the MCP framework with payment-related tools
    const hasMCP = agent.hasFramework('MCP');
    const hasPaymentTools = agent.getFrameworkConfig('MCP')?.configData?.tools?.some(tool => 
      tool.includes('payment') || tool.includes('finance') || tool.includes('transaction')
    );

    return hasMCP && hasPaymentTools;
  }

  /**
   * Generates payment security features based on agent configuration
   * @param {Agent} agent - Agent to generate security for
   * @returns {Object} Security configuration
   */
  generatePaymentSecurity(agent) {
    const securityConfig = {
      encryption: 'AES-256',
      authentication: 'token-based',
      authorization: 'role-based',
      audit_logging: true,
      fraud_detection: true
    };

    // Enhance security based on agent's framework configuration
    if (agent.hasFramework('A2A')) {
      securityConfig.inter_agent_auth = true;
      securityConfig.communication_encryption = 'end-to-end';
    }

    if (agent.hasFramework('ADK')) {
      securityConfig.workflow_integrity = true;
      securityConfig.transaction_rollback = true;
    }

    if (agent.hasFramework('MCP')) {
      securityConfig.external_api_security = true;
      securityConfig.context_verification = true;
    }

    return securityConfig;
  }

  /**
   * Generates a unique ID for new payments
   * @private
   * @returns {string} Unique payment ID
   */
  _generateId() {
    return 'payment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Creates a payment authorization plan
   * @param {Payment} payment - Payment to authorize
   * @returns {Object} Authorization plan
   */
  createAuthorizationPlan(payment) {
    return {
      paymentId: payment.id.value,
      steps: [
        { id: 'verify_recipient', description: 'Verify payment recipient', required: true },
        { id: 'check_funds', description: 'Verify sufficient funds', required: true },
        { id: 'validate_method', description: 'Validate payment method', required: true },
        { id: 'apply_fraud_check', description: 'Apply fraud detection', required: true },
        { id: 'authorize_payment', description: 'Authorize payment', required: true }
      ],
      security: this.generatePaymentSecurityForPayment(payment),
      estimatedTime: 2 // 2 minutes for authorization
    };
  }

  /**
   * Generates security config for a specific payment
   * @private
   */
  generatePaymentSecurityForPayment(payment) {
    return {
      encryption: 'AES-256',
      authentication: 'token-based',
      authorization: 'role-based',
      audit_logging: true,
      fraud_detection: true,
      amount_verification: payment.amount.amount > 0,
      currency_verification: payment.amount.currency !== null
    };
  }

  /**
   * Creates a payment processing plan for an agent
   * @param {Agent} agent - Agent to process payment
   * @param {Payment} payment - Payment to process
   * @returns {Object} Processing plan
   */
  createPaymentProcessingPlan(agent, payment) {
    const plan = {
      agentId: agent.id.value,
      paymentId: payment.id.value,
      frameworkType: 'AP2',
      steps: [],
      security: this.generatePaymentSecurity(agent),
      estimatedTime: 5, // 5 minutes for full payment processing
      successCriteria: [
        'Payment is authorized',
        'Funds are transferred',
        'Transaction is logged',
        'Confirmation is provided'
      ]
    };

    // Build plan steps based on payment status
    if (payment.status.value === 'PENDING') {
      plan.steps = [
        { id: 1, action: 'validate_payment_details', description: 'Verify payment information', dependencies: [] },
        { id: 2, action: 'check_recipient', description: 'Validate recipient information', dependencies: [1] },
        { id: 3, action: 'verify_funds', description: 'Confirm sufficient funds', dependencies: [2] },
        { id: 4, action: 'authorize_payment', description: 'Authorize the payment', dependencies: [3] },
        { id: 5, action: 'process_payment', description: 'Execute the payment', dependencies: [4] },
        { id: 6, action: 'confirm_completion', description: 'Confirm payment completion', dependencies: [5] }
      ];
    } else if (payment.status.value === 'AUTHORIZED') {
      plan.steps = [
        { id: 1, action: 'capture_funds', description: 'Capture authorized funds', dependencies: [] },
        { id: 2, action: 'transfer_funds', description: 'Transfer funds to recipient', dependencies: [1] },
        { id: 3, action: 'update_status', description: 'Update payment status to Captured', dependencies: [2] }
      ];
    }

    return plan;
  }
}