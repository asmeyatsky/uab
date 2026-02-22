import { useMemo } from 'react';
import { useContainer } from '../store/useContainer.ts';
import type { ProtocolId, ProtocolSpec, ProtocolCategory } from '../../domain/protocols/protocol.types.ts';

export function useProtocolRegistry() {
  const { protocolRegistry } = useContainer();

  const allProtocols = useMemo(() => protocolRegistry.getAll(), [protocolRegistry]);

  const getById = (id: ProtocolId) => protocolRegistry.getById(id);
  const getByCategory = (category: ProtocolCategory) => protocolRegistry.getByCategory(category);
  const getConfigSchema = (id: ProtocolId) => protocolRegistry.getConfigSchema(id);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<ProtocolCategory, ProtocolSpec[]>();
    for (const spec of allProtocols) {
      const existing = groups.get(spec.metadata.category) ?? [];
      existing.push(spec);
      groups.set(spec.metadata.category, existing);
    }
    return groups;
  }, [allProtocols]);

  return { allProtocols, getById, getByCategory, getConfigSchema, groupedByCategory };
}
