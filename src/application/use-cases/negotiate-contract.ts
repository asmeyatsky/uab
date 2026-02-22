/**
 * NegotiateContract Use Case
 * Orchestrates the multi-protocol negotiation flow.
 */

import type { CommercePort } from '../../domain/ports/commerce.port.ts';
import type { ProtocolRegistryPort } from '../../domain/ports/protocol-registry.port.ts';
import type { NegotiationRequestDTO, NegotiationResultDTO } from '../dtos/negotiation.dto.ts';
import { formatPrice } from '../../domain/value-objects/agent-pricing.ts';
import { eventBus } from '../services/event-bus.ts';

export class NegotiateContractUseCase {
  commerce: CommercePort;
  registry: ProtocolRegistryPort;

  constructor(commerce: CommercePort, registry: ProtocolRegistryPort) {
    this.commerce = commerce;
    this.registry = registry;
  }

  async execute(dto: NegotiationRequestDTO): Promise<NegotiationResultDTO> {
    eventBus.publish('negotiation:started', { listingId: dto.listingId });

    const result = await this.commerce.negotiate(dto.listingId, {
      budget: dto.budget,
      maxLatencyMs: dto.maxLatencyMs,
      trustThreshold: dto.trustThreshold,
      requiredProtocols: [...dto.requiredProtocols],
      slaUptime: dto.slaUptime,
    });

    const listing = this.commerce.getListingById(dto.listingId);
    const originalPrice = listing?.pricing.amount ?? 0;
    const savings = originalPrice - result.finalPrice.amount;

    const stages = result.stages.map(stage => {
      const spec = this.registry.getById(stage.protocol);
      return {
        name: stage.name,
        protocol: stage.protocol,
        protocolName: spec?.metadata.shortName ?? stage.protocol,
        status: stage.status,
        message: stage.message,
        timestamp: stage.timestamp,
      };
    });

    eventBus.publish('negotiation:completed', {
      listingId: dto.listingId,
      accepted: result.accepted,
      contractId: result.contractId,
    });

    return {
      accepted: result.accepted,
      finalPrice: formatPrice(result.finalPrice),
      contractId: result.contractId,
      stages,
      savings: savings > 0 ? `$${savings.toFixed(2)}` : '$0.00',
    };
  }
}
