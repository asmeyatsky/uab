/**
 * DateTime Value Object - Domain Layer
 * 
 * Immutable value object for date and time
 */
export class DateTime {
  constructor(value) {
    if (value instanceof Date) {
      this._value = new Date(value.getTime()); // Create a copy
    } else if (typeof value === 'string') {
      this._value = new Date(value);
      if (isNaN(this._value.getTime())) {
        throw new Error('Invalid date string provided to DateTime');
      }
    } else {
      throw new Error('DateTime must be constructed from a Date object or valid date string');
    }
  }

  get value() {
    return new Date(this._value.getTime()); // Return a copy
  }

  static now() {
    return new DateTime(new Date());
  }

  equals(other) {
    if (!(other instanceof DateTime)) {
      return false;
    }
    return this._value.getTime() === other._value.getTime();
  }

  toString() {
    return this._value.toISOString();
  }

  toISOString() {
    return this._value.toISOString();
  }

  getTime() {
    return this._value.getTime();
  }
}