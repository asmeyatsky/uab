/**
 * PaymentAmount Value Object - Domain Layer
 * 
 * Immutable value object for payment amounts
 */
export class PaymentAmount {
  constructor(amount, currency = 'USD') {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Payment amount must be a non-negative number');
    }
    
    if (!currency || typeof currency !== 'string') {
      throw new Error('Currency must be a non-empty string');
    }
    
    this._amount = amount;
    this._currency = currency.toUpperCase();
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  equals(other) {
    if (!(other instanceof PaymentAmount)) {
      return false;
    }
    return this._amount === other.amount && this._currency === other.currency;
  }

  toString() {
    return `${this._amount} ${this._currency}`;
  }
  
  valueOf() {
    return this._amount;
  }
}