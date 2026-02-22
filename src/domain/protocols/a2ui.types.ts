/**
 * A2UI v0.8 (Agent-to-UI) — Google
 * Declarative UI protocol for agent-driven interfaces. LLM-friendly, streaming.
 */

export type A2UIComponentType = 'text' | 'card' | 'list' | 'form' | 'chart' | 'table' | 'media' | 'action';

export interface A2UIComponent {
  readonly type: A2UIComponentType;
  readonly id: string;
  readonly props: Record<string, unknown>;
  readonly children?: readonly A2UIComponent[];
  readonly actions?: readonly A2UIAction[];
}

export interface A2UIAction {
  readonly id: string;
  readonly label: string;
  readonly type: 'submit' | 'navigate' | 'dismiss' | 'custom';
  readonly payload?: Record<string, unknown>;
}

export interface A2UIStreamConfig {
  readonly enableStreaming: boolean;
  readonly chunkSize: number;
  readonly progressiveRendering: boolean;
  readonly optimisticUpdates: boolean;
}

export interface A2UIThemeConfig {
  readonly mode: 'light' | 'dark' | 'system';
  readonly accentColor: string;
  readonly fontFamily: string;
  readonly borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface A2UIConfig {
  readonly supportedComponents: readonly A2UIComponentType[];
  readonly streamConfig: A2UIStreamConfig;
  readonly theme: A2UIThemeConfig;
  readonly maxRenderDepth: number;
  readonly accessibilityLevel: 'a' | 'aa' | 'aaa';
}
