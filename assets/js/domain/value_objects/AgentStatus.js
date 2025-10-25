/**
 * AgentStatus Value Object - Domain Layer
 * 
 * Immutable value object for agent statuses
 */
export class AgentStatus {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Agent status must be a non-empty string');
    }
    
    const validStatuses = ['DRAFT', 'CONFIGURED', 'GENERATED', 'TESTING', 'DEPLOYED', 'ARCHIVED'];
    if (!validStatuses.includes(value.toUpperCase())) {
      throw new Error(`Invalid agent status: ${value}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    this._value = value.toUpperCase();
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof AgentStatus)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}