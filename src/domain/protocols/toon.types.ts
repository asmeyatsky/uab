/**
 * TOON (Smart Contract Negotiation)
 * Agent-to-agent contract negotiation with budget/latency/trust terms.
 */

export type TOONTermType = 'budget' | 'latency' | 'trust' | 'sla' | 'data-handling' | 'custom';

export interface TOONTerm {
  readonly type: TOONTermType;
  readonly key: string;
  readonly value: unknown;
  readonly unit?: string;
  readonly negotiable: boolean;
  readonly priority: 'required' | 'preferred' | 'optional';
}

export interface TOONContract {
  readonly id: string;
  readonly parties: readonly string[];
  readonly terms: readonly TOONTerm[];
  readonly status: 'draft' | 'proposed' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
  readonly createdAt: number;
  readonly expiresAt: number;
}

export interface TOONNegotiationStrategy {
  readonly maxRounds: number;
  readonly concessionRate: number;
  readonly walkAwayThreshold: number;
  readonly preferredTerms: readonly TOONTerm[];
  readonly mandatoryTerms: readonly TOONTerm[];
}

export interface TOONConfig {
  readonly strategy: TOONNegotiationStrategy;
  readonly autoNegotiate: boolean;
  readonly defaultTerms: readonly TOONTerm[];
  readonly trustedParties: readonly string[];
  readonly contractTemplates: readonly string[];
  readonly arbitrationEnabled: boolean;
}
