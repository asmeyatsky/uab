/**
 * AgentId Value Object - Domain Layer
 * 
 * Immutable value object for agent identifiers
 */
export class AgentId {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Agent ID must be a non-empty string');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof AgentId)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}