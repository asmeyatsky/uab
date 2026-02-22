/**
 * Commerce Port
 * Interface for marketplace operations and agent negotiation.
 */

import type { MarketplaceListing } from '../entities/marketplace-listing.ts';
import type { AgentPricing } from '../value-objects/agent-pricing.ts';
import type { ProtocolId } from '../protocols/protocol.types.ts';

export interface MarketplaceFilter {
  readonly search?: string;
  readonly protocols?: readonly ProtocolId[];
  readonly minRating?: number;
  readonly maxPrice?: number;
  readonly category?: string;
  readonly featured?: boolean;
}

export interface NegotiationTerms {
  readonly budget: number;
  readonly maxLatencyMs: number;
  readonly trustThreshold: number;
  readonly requiredProtocols: readonly ProtocolId[];
  readonly slaUptime: number;
}

export interface NegotiationResult {
  readonly accepted: boolean;
  readonly finalPrice: AgentPricing;
  readonly agreedTerms: NegotiationTerms;
  readonly contractId: string;
  readonly stages: readonly NegotiationStage[];
}

export interface NegotiationStage {
  readonly name: string;
  readonly protocol: ProtocolId;
  readonly status: 'pending' | 'in-progress' | 'completed' | 'failed';
  readonly message: string;
  readonly timestamp: number;
}

export interface CommercePort {
  getListings(filter?: MarketplaceFilter): MarketplaceListing[];
  getListingById(id: string): MarketplaceListing | undefined;
  negotiate(listingId: string, terms: NegotiationTerms): Promise<NegotiationResult>;
  purchaseAgent(listingId: string, contractId: string): Promise<{ success: boolean; agentId: string }>;
}
