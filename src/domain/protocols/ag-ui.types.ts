/**
 * AG-UI (Agent-User Interaction) — CopilotKit
 * Bidirectional JSON event stream between agent backend and frontend.
 */

export type AGUIEventType =
  | 'text-message-start'
  | 'text-message-content'
  | 'text-message-end'
  | 'tool-call-start'
  | 'tool-call-args'
  | 'tool-call-end'
  | 'state-snapshot'
  | 'state-delta'
  | 'messages-snapshot'
  | 'run-started'
  | 'run-finished'
  | 'run-error'
  | 'step-started'
  | 'step-finished'
  | 'custom';

export interface AGUIEvent {
  readonly type: AGUIEventType;
  readonly timestamp: number;
  readonly payload: Record<string, unknown>;
  readonly sequenceId: number;
}

export interface AGUIStreamConfig {
  readonly transport: 'sse' | 'websocket' | 'http-stream';
  readonly reconnectPolicy: { maxRetries: number; backoffMs: number };
  readonly heartbeatInterval: number;
  readonly bufferSize: number;
}

export interface AGUIStateConfig {
  readonly enableSnapshots: boolean;
  readonly snapshotInterval: number;
  readonly enableDeltas: boolean;
  readonly stateSchema?: Record<string, unknown>;
}

export interface AGUIConfig {
  readonly streamConfig: AGUIStreamConfig;
  readonly stateConfig: AGUIStateConfig;
  readonly supportedEvents: readonly AGUIEventType[];
  readonly customEventTypes: readonly string[];
  readonly agentUrl: string;
}
