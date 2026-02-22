/**
 * MCP (Model Context Protocol) — Anthropic
 * AI↔infrastructure via Tools/Resources/Prompts. Nov 2025 spec.
 */

export interface MCPServerConfig {
  readonly name: string;
  readonly transport: 'stdio' | 'streamable-http' | 'sse';
  readonly url?: string;
  readonly command?: string;
  readonly args?: readonly string[];
  readonly env?: Record<string, string>;
}

export interface MCPToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: Record<string, unknown>;
}

export interface MCPResourceDefinition {
  readonly uri: string;
  readonly name: string;
  readonly description: string;
  readonly mimeType?: string;
}

export interface MCPPromptDefinition {
  readonly name: string;
  readonly description: string;
  readonly arguments?: readonly { name: string; description: string; required?: boolean }[];
}

export interface MCPConfig {
  readonly servers: readonly MCPServerConfig[];
  readonly tools: readonly MCPToolDefinition[];
  readonly resources: readonly MCPResourceDefinition[];
  readonly prompts: readonly MCPPromptDefinition[];
  readonly contextWindow: number;
  readonly samplingEnabled: boolean;
}
