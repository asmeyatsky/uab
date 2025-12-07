/**
 * Payment Entity - Domain Layer
 * 
 * Represents a payment transaction in the AP2 (Agents-to-Payments) protocol
 * 
 * Architectural Intent:
 * - This module handles payment transactions following DDD principles
 * - Payment aggregate is the consistency boundary for financial operations
 * - All state changes go through domain methods to ensure invariants
 * - External payment processing is handled via ports/adapters pattern
 * - Events are published for other bounded contexts to react
 * 
 * Key Design Decisions:
 * 1. Payments are immutable to prevent accidental state corruption
 * 2. Payment processing is abstracted behind PaymentPort
 * 3. Payment status transitions are validated in domain model
 * 4. Financial operations are logged for audit purposes
 */

import { PaymentId } from '../value_objects/payment/PaymentId.js';
import { PaymentAmount } from '../value_objects/payment/PaymentAmount.js';
import { PaymentMethod } from '../value_objects/payment/PaymentMethod.js';
import { PaymentStatus } from '../value_objects/payment/PaymentStatus.js';
import { DateTime } from '../value_objects/DateTime.js';

/**
 * @class Payment
 * @description Payment Aggregate Root
 * 
 * Invariants:
 * - Payment amount must be positive
 * - Payment method must be valid
 * - Status transitions must follow defined state machine
 * - Created payments can only have PENDING status
 */
export class Payment {
  /**
   * Creates a new Payment instance
   * @param {PaymentId} id - Unique identifier for the payment
   * @param {PaymentAmount} amount - Amount to be paid
   * @param {PaymentMethod} method - Payment method to use
   * @param {string} description - Description of the payment
   * @param {string} recipient - Recipient of the payment
   * @param {PaymentStatus} status - Current status of the payment
   * @param {DateTime} createdAt - Creation timestamp
   * @param {DateTime} updatedAt - Last update timestamp
   */
  constructor(id, amount, method, description, recipient, status, createdAt, updatedAt) {
    this._validateInvariants(id, amount, method, status, createdAt, updatedAt);
    
    this._id = id;
    this._amount = amount;
    this._method = method;
    this._description = description;
    this._recipient = recipient;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Properties (getter methods only to enforce immutability)
  get id() { return this._id; }
  get amount() { return this._amount; }
  get method() { return this._method; }
  get description() { return this._description; }
  get recipient() { return this._recipient; }
  get status() { return this._status; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  /**
   * Validates entity invariants
   * @private
   * @param {PaymentId} id
   * @param {PaymentAmount} amount
   * @param {PaymentMethod} method
   * @param {PaymentStatus} status
   * @param {DateTime} createdAt
   * @param {DateTime} updatedAt
   */
  _validateInvariants(id, amount, method, status, createdAt, updatedAt) {
    if (!(id instanceof PaymentId)) {
      throw new Error('Payment ID must be an instance of PaymentId value object');
    }
    if (!(amount instanceof PaymentAmount) || amount.amount <= 0) {
      throw new Error('Payment amount must be a positive instance of PaymentAmount value object');
    }
    if (!(method instanceof PaymentMethod)) {
      throw new Error('Payment method must be an instance of PaymentMethod value object');
    }
    if (!(status instanceof PaymentStatus)) {
      throw new Error('Payment status must be an instance of PaymentStatus value object');
    }
    if (!(createdAt instanceof DateTime)) {
      throw new Error('Created at must be an instance of DateTime value object');
    }
    if (!(updatedAt instanceof DateTime)) {
      throw new Error('Updated at must be an instance of DateTime value object');
    }
  }

  /**
   * Authorizes the payment (transitions from PENDING to AUTHORIZED)
   * @returns {Payment} New instance with updated status
   */
  authorize() {
    if (this._status.value !== 'PENDING') {
      throw new Error('Cannot authorize payment: only pending payments can be authorized');
    }
    
    return new Payment(
      this._id,
      this._amount,
      this._method,
      this._description,
      this._recipient,
      new PaymentStatus('AUTHORIZED'),
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Captures the payment (transitions from AUTHORIZED to CAPTURED)
   * @returns {Payment} New instance with updated status
   */
  capture() {
    if (this._status.value !== 'AUTHORIZED') {
      throw new Error('Cannot capture payment: only authorized payments can be captured');
    }
    
    return new Payment(
      this._id,
      this._amount,
      this._method,
      this._description,
      this._recipient,
      new PaymentStatus('CAPTURED'),
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Marks the payment as failed
   * @returns {Payment} New instance with updated status
   */
  markAsFailed() {
    if (this._status.value === 'CAPTURED') {
      throw new Error('Cannot mark captured payment as failed');
    }
    
    return new Payment(
      this._id,
      this._amount,
      this._method,
      this._description,
      this._recipient,
      new PaymentStatus('FAILED'),
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Refunds the payment (transitions from CAPTURED to REFUNDED)
   * @returns {Payment} New instance with updated status
   */
  refund() {
    if (this._status.value !== 'CAPTURED') {
      throw new Error('Cannot refund payment: only captured payments can be refunded');
    }
    
    return new Payment(
      this._id,
      this._amount,
      this._method,
      this._description,
      this._recipient,
      new PaymentStatus('REFUNDED'),
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Cancels the payment (transitions from PENDING to CANCELLED)
   * @returns {Payment} New instance with updated status
   */
  cancel() {
    if (this._status.value !== 'PENDING') {
      throw new Error('Cannot cancel payment: only pending payments can be cancelled');
    }
    
    return new Payment(
      this._id,
      this._amount,
      this._method,
      this._description,
      this._recipient,
      new PaymentStatus('CANCELLED'),
      this._createdAt,
      DateTime.now()
    );
  }

  /**
   * Checks if the payment can be authorized
   * @returns {boolean} True if the payment can be authorized
   */
  canBeAuthorized() {
    return this._status.value === 'PENDING';
  }

  /**
   * Checks if the payment can be captured
   * @returns {boolean} True if the payment can be captured
   */
  canBeCaptured() {
    return this._status.value === 'AUTHORIZED';
  }

  /**
   * Checks if the payment can be refunded
   * @returns {boolean} True if the payment can be refunded
   */
  canBeRefunded() {
    return this._status.value === 'CAPTURED';
  }

  /**
   * Generates the payment configuration as a JSON object
   * @returns {Object} Configuration object in the format expected by AP2 protocol
   */
  generateConfiguration() {
    return {
      id: this._id.value,
      amount: this._amount.amount,
      currency: this._amount.currency,
      method: this._method.type,
      method_details: this._method.details,
      description: this._description,
      recipient: this._recipient,
      status: this._status.value,
      created_at: this._createdAt.value,
      updated_at: this._updatedAt.value
    };
  }
}