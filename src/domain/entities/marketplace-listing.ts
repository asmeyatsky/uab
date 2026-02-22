/**
 * MarketplaceListing Entity
 * Represents an agent available in the marketplace.
 */

import type { Agent } from './agent.ts';
import type { AgentPricing } from '../value-objects/agent-pricing.ts';

export type ListingStatus = 'active' | 'pending' | 'suspended' | 'sold';

export interface MarketplaceListing {
  readonly id: string;
  readonly agent: Agent;
  readonly sellerId: string;
  readonly sellerName: string;
  readonly pricing: AgentPricing;
  readonly status: ListingStatus;
  readonly downloads: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly featured: boolean;
  readonly listedAt: number;
}

export function createListing(partial: Partial<MarketplaceListing> & Pick<MarketplaceListing, 'id' | 'agent' | 'sellerId'>): MarketplaceListing {
  return {
    sellerName: 'Unknown',
    pricing: partial.agent.pricing,
    status: 'active',
    downloads: 0,
    rating: 0,
    reviewCount: 0,
    featured: false,
    listedAt: Date.now(),
    ...partial,
  };
}
