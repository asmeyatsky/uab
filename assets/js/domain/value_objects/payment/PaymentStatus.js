/**
 * PaymentStatus Value Object - Domain Layer
 * 
 * Immutable value object for payment statuses
 */
export class PaymentStatus {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Payment status must be a non-empty string');
    }
    
    const validStatuses = ['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELLED'];
    if (!validStatuses.includes(value.toUpperCase())) {
      throw new Error(`Invalid payment status: ${value}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    this._value = value.toUpperCase();
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof PaymentStatus)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}