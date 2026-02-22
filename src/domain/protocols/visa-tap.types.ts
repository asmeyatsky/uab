/**
 * Visa TAP (Trusted Agent Protocol) — Visa + Cloudflare
 * Distinguishes legitimate AI agents from bots at checkout. 100+ partners.
 */

export type TAPVerificationLevel = 'basic' | 'standard' | 'enhanced' | 'premium';

export interface TAPAgentIdentity {
  readonly agentId: string;
  readonly organizationId: string;
  readonly verificationLevel: TAPVerificationLevel;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

export interface TAPTrustSignals {
  readonly behaviorScore: number;
  readonly transactionHistory: number;
  readonly verificationAge: number;
  readonly partnerEndorsements: readonly string[];
}

export interface TAPComplianceConfig {
  readonly regions: readonly string[];
  readonly requiredCertifications: readonly string[];
  readonly dataRetentionDays: number;
  readonly gdprCompliant: boolean;
}

export interface TAPConfig {
  readonly identity: TAPAgentIdentity;
  readonly trustSignals: TAPTrustSignals;
  readonly compliance: TAPComplianceConfig;
  readonly cloudflareIntegration: boolean;
  readonly challengeResponseEnabled: boolean;
  readonly tokenRefreshInterval: number;
}
