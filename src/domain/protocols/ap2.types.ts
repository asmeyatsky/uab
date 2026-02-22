/**
 * AP2 (Agent Payments Protocol)
 * Secure agent-initiated payments. Works with UCP.
 */

export type AP2PaymentMethod = 'card' | 'bank-transfer' | 'crypto' | 'digital-wallet';

export interface AP2PaymentLimits {
  readonly maxPerTransaction: number;
  readonly maxDaily: number;
  readonly maxMonthly: number;
  readonly currency: string;
}

export interface AP2AuthorizationPolicy {
  readonly requireHumanApproval: boolean;
  readonly approvalThreshold: number;
  readonly allowedMerchantCategories: readonly string[];
  readonly blockedMerchantCategories: readonly string[];
}

export interface AP2SecurityConfig {
  readonly encryptionLevel: 'standard' | 'enhanced' | 'quantum-resistant';
  readonly tokenization: boolean;
  readonly fraudDetection: boolean;
  readonly auditLogging: boolean;
}

export interface AP2Config {
  readonly paymentMethods: readonly AP2PaymentMethod[];
  readonly limits: AP2PaymentLimits;
  readonly authorizationPolicy: AP2AuthorizationPolicy;
  readonly security: AP2SecurityConfig;
  readonly settlementCurrency: string;
  readonly webhookUrl?: string;
}
