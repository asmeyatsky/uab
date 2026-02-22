/**
 * ACP (Agentic Commerce Protocol) — OpenAI + Stripe
 * Open standard for AI agent purchases. Powers ChatGPT Instant Checkout.
 */

export interface ACPMerchant {
  readonly id: string;
  readonly name: string;
  readonly stripeAccountId?: string;
  readonly supportedCurrencies: readonly string[];
  readonly catalogEndpoint: string;
}

export interface ACPProduct {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: { amount: number; currency: string };
  readonly category: string;
  readonly availability: 'in-stock' | 'limited' | 'pre-order';
}

export interface ACPCheckoutConfig {
  readonly instantCheckout: boolean;
  readonly requireConfirmation: boolean;
  readonly maxTransactionAmount: number;
  readonly allowedCategories: readonly string[];
  readonly shippingRequired: boolean;
}

export interface ACPConfig {
  readonly merchantProfile: ACPMerchant;
  readonly checkoutConfig: ACPCheckoutConfig;
  readonly webhookUrl?: string;
  readonly sandboxMode: boolean;
  readonly apiVersion: string;
}
