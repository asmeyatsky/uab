/**
 * AgentPrompt Value Object - Domain Layer
 * 
 * Immutable value object for agent prompts
 */
export class AgentPrompt {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Agent prompt must be a non-empty string');
    }
    if (value.length > 10000) {
      throw new Error('Agent prompt must not exceed 10000 characters');
    }
    this._value = value.trim();
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof AgentPrompt)) {
      return false;
    }
    return this._value === other.value;
  }

  toString() {
    return this._value;
  }
}