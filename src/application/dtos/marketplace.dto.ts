import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';

export interface MarketplaceListingDTO {
  readonly id: string;
  readonly agentId: string;
  readonly agentName: string;
  readonly agentDescription: string;
  readonly agentType: string;
  readonly agentAvatar: string;
  readonly sellerName: string;
  readonly protocols: readonly ProtocolId[];
  readonly trustScore: number;
  readonly price: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly downloads: number;
  readonly featured: boolean;
  readonly verified: boolean;
  readonly capabilities: readonly string[];
}

export interface MarketplaceSearchDTO {
  readonly search?: string;
  readonly protocols?: readonly ProtocolId[];
  readonly minRating?: number;
  readonly maxPrice?: number;
  readonly featured?: boolean;
}
