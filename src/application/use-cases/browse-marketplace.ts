/**
 * BrowseMarketplace Use Case
 * Fetches and transforms marketplace listings for display.
 */

import type { CommercePort } from '../../domain/ports/commerce.port.ts';
import type { MarketplaceListingDTO, MarketplaceSearchDTO } from '../dtos/marketplace.dto.ts';
import { getEnabledProtocols } from '../../domain/entities/agent.ts';
import { formatPrice } from '../../domain/value-objects/agent-pricing.ts';

export class BrowseMarketplaceUseCase {
  commerce: CommercePort;

  constructor(commerce: CommercePort) {
    this.commerce = commerce;
  }

  execute(search?: MarketplaceSearchDTO): MarketplaceListingDTO[] {
    const listings = this.commerce.getListings(search ? {
      search: search.search,
      protocols: search.protocols,
      minRating: search.minRating,
      maxPrice: search.maxPrice,
      featured: search.featured,
    } : undefined);

    return listings.map(listing => ({
      id: listing.id,
      agentId: listing.agent.id,
      agentName: listing.agent.name,
      agentDescription: listing.agent.description,
      agentType: listing.agent.type,
      agentAvatar: listing.agent.avatar,
      sellerName: listing.sellerName,
      protocols: getEnabledProtocols(listing.agent),
      trustScore: listing.agent.trustScore.overall,
      price: formatPrice(listing.pricing),
      rating: Math.round(listing.rating * 10) / 10,
      reviewCount: listing.reviewCount,
      downloads: listing.downloads,
      featured: listing.featured,
      verified: listing.agent.verified,
      capabilities: [...listing.agent.capabilities],
    }));
  }
}
