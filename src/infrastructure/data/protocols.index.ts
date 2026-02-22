import type { ProtocolSpec, ProtocolId } from '../../domain/protocols/protocol.types.ts';
import { mcpSpec } from './mcp.spec.ts';
import { a2aSpec } from './a2a.spec.ts';
import { adkSpec } from './adk.spec.ts';
import { acpSpec } from './acp.spec.ts';
import { ucpSpec } from './ucp.spec.ts';
import { ap2Spec } from './ap2.spec.ts';
import { visaTapSpec } from './visa-tap.spec.ts';
import { a2uiSpec } from './a2ui.spec.ts';
import { agUiSpec } from './ag-ui.spec.ts';
import { toonSpec } from './toon.spec.ts';

export const ALL_PROTOCOL_SPECS: readonly ProtocolSpec[] = [
  mcpSpec, a2aSpec, adkSpec, acpSpec, ucpSpec,
  ap2Spec, visaTapSpec, a2uiSpec, agUiSpec, toonSpec,
];

export const PROTOCOL_SPEC_MAP: Record<ProtocolId, ProtocolSpec> = {
  mcp: mcpSpec,
  a2a: a2aSpec,
  adk: adkSpec,
  acp: acpSpec,
  ucp: ucpSpec,
  ap2: ap2Spec,
  'visa-tap': visaTapSpec,
  a2ui: a2uiSpec,
  'ag-ui': agUiSpec,
  toon: toonSpec,
};

export const ALL_PROTOCOL_IDS: readonly ProtocolId[] = [
  'mcp', 'a2a', 'adk', 'acp', 'ucp', 'ap2', 'visa-tap', 'a2ui', 'ag-ui', 'toon',
];

export { mcpSpec, a2aSpec, adkSpec, acpSpec, ucpSpec, ap2Spec, visaTapSpec, a2uiSpec, agUiSpec, toonSpec };
