/**
 * InMemory Protocol Registry Adapter
 * Implements ProtocolRegistryPort using static protocol spec data.
 */

import type { ProtocolRegistryPort } from '../../domain/ports/protocol-registry.port.ts';
import type { ProtocolId, ProtocolSpec, ProtocolCategory } from '../../domain/protocols/protocol.types.ts';
import { ALL_PROTOCOL_SPECS, PROTOCOL_SPEC_MAP } from '../data/protocols.index.ts';

export class InMemoryProtocolRegistry implements ProtocolRegistryPort {
  getAll(): ProtocolSpec[] {
    return [...ALL_PROTOCOL_SPECS];
  }

  getById(id: ProtocolId): ProtocolSpec | undefined {
    return PROTOCOL_SPEC_MAP[id];
  }

  getByCategory(category: ProtocolCategory): ProtocolSpec[] {
    return ALL_PROTOCOL_SPECS.filter(s => s.metadata.category === category);
  }

  getConfigSchema(id: ProtocolId): ProtocolSpec['configSchema'] | undefined {
    return PROTOCOL_SPEC_MAP[id]?.configSchema;
  }
}
