/**
 * Protocol Registry Port
 * Interface for accessing protocol specifications.
 */

import type { ProtocolId, ProtocolSpec, ProtocolCategory } from '../protocols/protocol.types.ts';

export interface ProtocolRegistryPort {
  getAll(): ProtocolSpec[];
  getById(id: ProtocolId): ProtocolSpec | undefined;
  getByCategory(category: ProtocolCategory): ProtocolSpec[];
  getConfigSchema(id: ProtocolId): ProtocolSpec['configSchema'] | undefined;
}
