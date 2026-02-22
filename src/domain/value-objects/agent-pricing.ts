/**
 * AgentPricing Value Object
 * Pricing model for agent marketplace listings.
 */

export type PricingModel = 'per-request' | 'per-minute' | 'subscription' | 'flat-fee' | 'free';

export interface AgentPricing {
  readonly amount: number;
  readonly currency: string;
  readonly model: PricingModel;
  readonly subscriptionInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export function createPricing(partial?: Partial<AgentPricing>): AgentPricing {
  return {
    amount: 0,
    currency: 'USD',
    model: 'per-request',
    ...partial,
  };
}

export function formatPrice(pricing: AgentPricing): string {
  if (pricing.model === 'free') return 'Free';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: pricing.currency,
    minimumFractionDigits: 2,
  }).format(pricing.amount);
  const suffix: Record<PricingModel, string> = {
    'per-request': '/req',
    'per-minute': '/min',
    'subscription': `/${pricing.subscriptionInterval ?? 'mo'}`,
    'flat-fee': '',
    'free': '',
  };
  return `${formatted}${suffix[pricing.model]}`;
}
