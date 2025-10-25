/**
 * AgentName Value Object - Domain Layer
 * 
 * Immutable value object for agent names
 */
export class AgentName {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Agent name must be a non-empty string');
    }
    if (value.length > 100) {
      throw new Error('Agent name must not exceed 100 characters');
    }
    this._value = value.trim();
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof AgentName)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}