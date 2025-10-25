/**
 * AP2 Ports - Domain Layer
 * 
 * Defines interfaces for AP2 (Agents-to-Payments) protocol operations using ports and adapters pattern
 */

/**
 * @interface PaymentProcessorPort
 * @description Port for payment processing operations
 */
export class PaymentProcessorPort {
  /**
   * Processes a payment
   * @param {Payment} payment - Payment to process
   * @returns {Promise<Object>} Result of payment processing
   */
  async processPayment(payment) {
    throw new Error('Method processPayment must be implemented');
  }

  /**
   * Authorizes a payment
   * @param {Payment} payment - Payment to authorize
   * @returns {Promise<Object>} Result of payment authorization
   */
  async authorizePayment(payment) {
    throw new Error('Method authorizePayment must be implemented');
  }

  /**
   * Captures a payment
   * @param {Payment} payment - Payment to capture
   * @returns {Promise<Object>} Result of payment capture
   */
  async capturePayment(payment) {
    throw new Error('Method capturePayment must be implemented');
  }

  /**
   * Refunds a payment
   * @param {Payment} payment - Payment to refund
   * @returns {Promise<Object>} Result of payment refund
   */
  async refundPayment(payment) {
    throw new Error('Method refundPayment must be implemented');
  }

  /**
   * Cancels a payment
   * @param {Payment} payment - Payment to cancel
   * @returns {Promise<Object>} Result of payment cancellation
   */
  async cancelPayment(payment) {
    throw new Error('Method cancelPayment must be implemented');
  }

  /**
   * Validates payment details
   * @param {Payment} payment - Payment to validate
   * @returns {Promise<Object>} Validation result
   */
  async validatePayment(payment) {
    throw new Error('Method validatePayment must be implemented');
  }
}

/**
 * @interface PaymentSecurityPort
 * @description Port for payment security operations
 */
export class PaymentSecurityPort {
  /**
   * Encrypts payment data
   * @param {Object} data - Data to encrypt
   * @returns {Promise<Object>} Encrypted data
   */
  async encryptPaymentData(data) {
    throw new Error('Method encryptPaymentData must be implemented');
  }

  /**
   * Authenticates payment request
   * @param {Object} request - Payment request to authenticate
   * @returns {Promise<Object>} Authentication result
   */
  async authenticatePayment(request) {
    throw new Error('Method authenticatePayment must be implemented');
  }

  /**
   * Authorizes payment action
   * @param {Object} action - Payment action to authorize
   * @param {string} agentId - ID of the agent requesting the action
   * @returns {Promise<Object>} Authorization result
   */
  async authorizePaymentAction(action, agentId) {
    throw new Error('Method authorizePaymentAction must be implemented');
  }

  /**
   * Logs payment event for audit
   * @param {Object} event - Payment event to log
   * @returns {Promise<void>}
   */
  async logPaymentEvent(event) {
    throw new Error('Method logPaymentEvent must be implemented');
  }
}