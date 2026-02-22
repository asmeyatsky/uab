/**
 * Protocol Compatibility Service
 * Determines which protocols work together and suggests optimal combinations.
 * Pure domain logic — no infrastructure dependencies.
 */

import type { ProtocolId, ProtocolCompatibility, ProtocolRecommendation } from '../protocols/protocol.types.ts';

const COMPATIBILITY_MAP: Record<ProtocolId, ProtocolCompatibility> = {
  mcp: { protocolId: 'mcp', compatibleWith: ['a2a', 'adk', 'a2ui', 'ag-ui'], requiredBy: [], enhancedBy: ['a2a', 'adk'] },
  a2a: { protocolId: 'a2a', compatibleWith: ['mcp', 'adk', 'toon', 'visa-tap', 'ag-ui'], requiredBy: [], enhancedBy: ['mcp', 'toon'] },
  adk: { protocolId: 'adk', compatibleWith: ['mcp', 'a2a', 'ag-ui', 'a2ui'], requiredBy: [], enhancedBy: ['mcp'] },
  acp: { protocolId: 'acp', compatibleWith: ['ucp', 'ap2', 'visa-tap'], requiredBy: ['ap2'], enhancedBy: ['visa-tap', 'ucp'] },
  ucp: { protocolId: 'ucp', compatibleWith: ['acp', 'ap2', 'visa-tap', 'a2ui'], requiredBy: [], enhancedBy: ['acp', 'visa-tap'] },
  ap2: { protocolId: 'ap2', compatibleWith: ['acp', 'ucp', 'visa-tap', 'toon'], requiredBy: [], enhancedBy: ['visa-tap'] },
  'visa-tap': { protocolId: 'visa-tap', compatibleWith: ['acp', 'ucp', 'ap2', 'a2a'], requiredBy: [], enhancedBy: [] },
  a2ui: { protocolId: 'a2ui', compatibleWith: ['mcp', 'adk', 'ag-ui', 'ucp'], requiredBy: [], enhancedBy: ['ag-ui'] },
  'ag-ui': { protocolId: 'ag-ui', compatibleWith: ['mcp', 'a2a', 'adk', 'a2ui'], requiredBy: [], enhancedBy: ['a2ui'] },
  toon: { protocolId: 'toon', compatibleWith: ['a2a', 'ap2', 'visa-tap'], requiredBy: [], enhancedBy: ['visa-tap', 'ap2'] },
};

export function getCompatibility(protocolId: ProtocolId): ProtocolCompatibility {
  return COMPATIBILITY_MAP[protocolId];
}

export function areCompatible(a: ProtocolId, b: ProtocolId): boolean {
  return COMPATIBILITY_MAP[a].compatibleWith.includes(b);
}

export function getCompatibilityMatrix(): Record<ProtocolId, Record<ProtocolId, boolean>> {
  const protocols = Object.keys(COMPATIBILITY_MAP) as ProtocolId[];
  const matrix = {} as Record<ProtocolId, Record<ProtocolId, boolean>>;
  for (const p of protocols) {
    matrix[p] = {} as Record<ProtocolId, boolean>;
    for (const q of protocols) {
      matrix[p][q] = p === q || areCompatible(p, q);
    }
  }
  return matrix;
}

export function recommendProtocols(
  prompt: string,
  existingProtocols: ProtocolId[]
): ProtocolRecommendation[] {
  const recommendations: ProtocolRecommendation[] = [];
  const lower = prompt.toLowerCase();

  const keywordMap: Record<string, { protocols: ProtocolId[]; reason: string }> = {
    'tool': { protocols: ['mcp'], reason: 'MCP provides tool/resource integration for AI agents' },
    'api': { protocols: ['mcp'], reason: 'MCP standardizes AI↔infrastructure communication' },
    'multi-agent': { protocols: ['a2a', 'adk'], reason: 'A2A + ADK enable multi-agent collaboration and workflows' },
    'collaborate': { protocols: ['a2a'], reason: 'A2A enables agent-to-agent discovery and task delegation' },
    'workflow': { protocols: ['adk'], reason: 'ADK provides DAG-based workflow orchestration' },
    'parallel': { protocols: ['adk'], reason: 'ADK supports parallel workflow execution' },
    'shop': { protocols: ['acp', 'ucp'], reason: 'ACP + UCP enable agentic commerce across platforms' },
    'buy': { protocols: ['acp', 'ucp', 'ap2'], reason: 'Commerce + payment protocols for AI purchasing' },
    'purchase': { protocols: ['acp', 'ap2'], reason: 'ACP for checkout, AP2 for secure payments' },
    'commerce': { protocols: ['acp', 'ucp'], reason: 'Full commerce stack for agent-driven shopping' },
    'pay': { protocols: ['ap2'], reason: 'AP2 handles secure agent-initiated payments' },
    'checkout': { protocols: ['acp', 'visa-tap'], reason: 'ACP for checkout flow, Visa TAP for trust verification' },
    'trust': { protocols: ['visa-tap'], reason: 'Visa TAP distinguishes legitimate agents from bots' },
    'verify': { protocols: ['visa-tap'], reason: 'Visa TAP provides agent identity verification' },
    'security': { protocols: ['visa-tap'], reason: 'Visa TAP adds security layer for agent transactions' },
    'ui': { protocols: ['a2ui', 'ag-ui'], reason: 'A2UI + AG-UI enable rich agent-driven interfaces' },
    'interface': { protocols: ['a2ui'], reason: 'A2UI provides declarative UI generation for agents' },
    'stream': { protocols: ['ag-ui'], reason: 'AG-UI enables bidirectional event streaming' },
    'chat': { protocols: ['ag-ui'], reason: 'AG-UI handles real-time agent-user interaction' },
    'negotiate': { protocols: ['toon'], reason: 'TOON enables smart contract negotiation between agents' },
    'contract': { protocols: ['toon'], reason: 'TOON manages agent-to-agent contracts with terms' },
    'sla': { protocols: ['toon'], reason: 'TOON negotiates SLA terms between agents' },
  };

  const scored = new Map<ProtocolId, { confidence: number; reasons: string[] }>();

  for (const [keyword, { protocols, reason }] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      for (const p of protocols) {
        const existing = scored.get(p) ?? { confidence: 0, reasons: [] };
        existing.confidence += 0.3;
        if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
        scored.set(p, existing);
      }
    }
  }

  // Boost protocols compatible with already-selected ones
  for (const existing of existingProtocols) {
    const compat = COMPATIBILITY_MAP[existing];
    for (const enhanced of compat.enhancedBy) {
      if (!existingProtocols.includes(enhanced)) {
        const entry = scored.get(enhanced) ?? { confidence: 0, reasons: [] };
        entry.confidence += 0.2;
        entry.reasons.push(`Enhances ${existing.toUpperCase()}`);
        scored.set(enhanced, entry);
      }
    }
  }

  for (const [protocolId, { confidence, reasons }] of scored) {
    if (!existingProtocols.includes(protocolId)) {
      recommendations.push({
        protocolId,
        confidence: Math.min(confidence, 1),
        reason: reasons[0],
      });
    }
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence);
}
