/**
 * UCP (Universal Commerce Protocol) — Google + Shopify/Walmart/Target
 * Agentic shopping across surfaces. Jan 2026.
 */

export interface UCPRetailer {
  readonly id: string;
  readonly name: string;
  readonly platform: 'shopify' | 'walmart' | 'target' | 'custom';
  readonly catalogFeedUrl: string;
  readonly fulfillmentMethods: readonly ('ship' | 'pickup' | 'digital')[];
}

export interface UCPSearchConfig {
  readonly maxResults: number;
  readonly enableSemanticSearch: boolean;
  readonly priceRange?: { min: number; max: number; currency: string };
  readonly preferredRetailers: readonly string[];
}

export interface UCPSurfaceConfig {
  readonly surfaces: readonly ('chat' | 'voice' | 'visual' | 'ar')[];
  readonly locale: string;
  readonly currency: string;
}

export interface UCPConfig {
  readonly retailers: readonly UCPRetailer[];
  readonly searchConfig: UCPSearchConfig;
  readonly surfaceConfig: UCPSurfaceConfig;
  readonly enableComparison: boolean;
  readonly trackingEnabled: boolean;
}
