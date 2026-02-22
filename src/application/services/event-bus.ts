/**
 * EventBus Service
 * Simple pub/sub for cross-component communication.
 */

export type EventHandler<T = unknown> = (payload: T) => void;

export interface AppEvent {
  readonly type: string;
  readonly payload: unknown;
  readonly timestamp: number;
}

class EventBusService {
  private handlers = new Map<string, Set<EventHandler>>();
  private eventLog: AppEvent[] = [];
  private maxLogSize = 100;

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    return () => {
      this.handlers.get(eventType)?.delete(handler as EventHandler);
    };
  }

  publish(eventType: string, payload: unknown = {}): void {
    const event: AppEvent = { type: eventType, payload, timestamp: Date.now() };
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize);
    }

    const handlers = this.handlers.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (e) {
          console.error(`EventBus handler error for "${eventType}":`, e);
        }
      }
    }
  }

  getEventLog(): readonly AppEvent[] {
    return this.eventLog;
  }

  clear(): void {
    this.handlers.clear();
    this.eventLog = [];
  }
}

export const eventBus = new EventBusService();
