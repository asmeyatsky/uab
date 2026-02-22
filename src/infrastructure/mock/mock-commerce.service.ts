/**
 * Mock Commerce Service
 * Simulates marketplace and negotiation operations.
 */

import type { CommercePort, MarketplaceFilter, NegotiationTerms, NegotiationResult, NegotiationStage } from '../../domain/ports/commerce.port.ts';
import type { MarketplaceListing } from '../../domain/entities/marketplace-listing.ts';
import { createListing } from '../../domain/entities/marketplace-listing.ts';
import { SEED_AGENTS } from '../data/seed-agents.ts';

const SEED_LISTINGS: MarketplaceListing[] = SEED_AGENTS
  .filter(a => a.status === 'deployed' || a.status === 'ready')
  .map((agent, i) => createListing({
    id: `listing-${agent.id}`,
    agent,
    sellerId: `seller-${String(i + 1).padStart(3, '0')}`,
    sellerName: ['Neural Labs', 'AgentForge', 'DataMind Inc', 'SecureAI Corp', 'PixelCraft', 'TradeTech', 'EchoSoft', 'ProcureAI'][i] ?? 'Unknown',
    downloads: Math.floor(Math.random() * 5000) + 100,
    rating: 3.5 + Math.random() * 1.5,
    reviewCount: Math.floor(Math.random() * 200) + 10,
    featured: i < 3,
  }));

export class MockCommerceService implements CommercePort {
  getListings(filter?: MarketplaceFilter): MarketplaceListing[] {
    let results = [...SEED_LISTINGS];

    if (filter?.search) {
      const lower = filter.search.toLowerCase();
      results = results.filter(l =>
        l.agent.name.toLowerCase().includes(lower) ||
        l.agent.description.toLowerCase().includes(lower)
      );
    }
    if (filter?.protocols && filter.protocols.length > 0) {
      results = results.filter(l =>
        filter.protocols!.some(p =>
          l.agent.protocolBindings.some(b => b.protocolId === p && b.enabled)
        )
      );
    }
    if (filter?.minRating) {
      results = results.filter(l => l.rating >= filter.minRating!);
    }
    if (filter?.featured !== undefined) {
      results = results.filter(l => l.featured === filter.featured);
    }

    return results;
  }

  getListingById(id: string): MarketplaceListing | undefined {
    return SEED_LISTINGS.find(l => l.id === id);
  }

  async negotiate(listingId: string, terms: NegotiationTerms): Promise<NegotiationResult> {
    const listing = this.getListingById(listingId);
    if (!listing) throw new Error(`Listing ${listingId} not found`);

    const stages: NegotiationStage[] = [];
    const stageConfigs: { name: string; protocol: import('../../domain/protocols/protocol.types.ts').ProtocolId; delay: number }[] = [
      { name: 'Contract Terms Proposal', protocol: 'toon', delay: 1500 },
      { name: 'Identity Verification', protocol: 'visa-tap', delay: 1200 },
      { name: 'Payment Authorization', protocol: 'ap2', delay: 1000 },
      { name: 'Contract Signing', protocol: 'toon', delay: 800 },
    ];

    for (const config of stageConfigs) {
      stages.push({
        name: config.name,
        protocol: config.protocol,
        status: 'in-progress',
        message: `Processing ${config.name.toLowerCase()}...`,
        timestamp: Date.now(),
      });
      await new Promise(resolve => setTimeout(resolve, config.delay));
      stages[stages.length - 1] = {
        ...stages[stages.length - 1],
        status: 'completed',
        message: `${config.name} completed successfully`,
      };
    }

    return {
      accepted: true,
      finalPrice: {
        amount: listing.pricing.amount * 0.9,
        currency: listing.pricing.currency,
        model: listing.pricing.model,
      },
      agreedTerms: terms,
      contractId: `contract-${Date.now()}`,
      stages,
    };
  }

  async purchaseAgent(listingId: string, _contractId: string): Promise<{ success: boolean; agentId: string }> {
    const listing = this.getListingById(listingId);
    if (!listing) throw new Error(`Listing ${listingId} not found`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, agentId: listing.agent.id };
  }
}
