import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';

export interface NegotiationRequestDTO {
  readonly listingId: string;
  readonly budget: number;
  readonly maxLatencyMs: number;
  readonly trustThreshold: number;
  readonly requiredProtocols: readonly ProtocolId[];
  readonly slaUptime: number;
}

export interface NegotiationStageDTO {
  readonly name: string;
  readonly protocol: ProtocolId;
  readonly protocolName: string;
  readonly status: 'pending' | 'in-progress' | 'completed' | 'failed';
  readonly message: string;
  readonly timestamp: number;
}

export interface NegotiationResultDTO {
  readonly accepted: boolean;
  readonly finalPrice: string;
  readonly contractId: string;
  readonly stages: readonly NegotiationStageDTO[];
  readonly savings: string;
}
