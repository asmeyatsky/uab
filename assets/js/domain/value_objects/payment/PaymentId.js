/**
 * PaymentId Value Object - Domain Layer
 * 
 * Immutable value object for payment identifiers
 */
export class PaymentId {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Payment ID must be a non-empty string');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof PaymentId)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}