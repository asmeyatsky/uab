/**
 * PaymentMethod Value Object - Domain Layer
 * 
 * Immutable value object for payment methods
 */
export class PaymentMethod {
  constructor(type, details) {
    if (!type || typeof type !== 'string') {
      throw new Error('Payment method type must be a non-empty string');
    }
    
    // Validate payment method type
    const validTypes = ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'CRYPTOCURRENCY'];
    if (!validTypes.includes(type.toUpperCase())) {
      throw new Error(`Invalid payment method type: ${type}. Must be one of: ${validTypes.join(', ')}`);
    }
    
    this._type = type.toUpperCase();
    this._details = details || {};
  }

  get type() {
    return this._type;
  }

  get details() {
    return { ...this._details }; // Return a copy to prevent external mutation
  }

  equals(other) {
    if (!(other instanceof PaymentMethod)) {
      return false;
    }
    return this._type === other.type && 
           JSON.stringify(this._details) === JSON.stringify(other.details);
  }

  toString() {
    return `${this._type}: ${JSON.stringify(this._details)}`;
  }
}