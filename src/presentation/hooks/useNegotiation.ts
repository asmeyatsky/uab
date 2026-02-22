import { useState, useCallback } from 'react';
import { useContainer } from '../store/useContainer.ts';
import { NegotiateContractUseCase } from '../../application/use-cases/negotiate-contract.ts';
import type { NegotiationResultDTO, NegotiationStageDTO } from '../../application/dtos/negotiation.dto.ts';
import type { ProtocolId } from '../../domain/protocols/protocol.types.ts';

export function useNegotiation() {
  const { commerce, protocolRegistry } = useContainer();
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [result, setResult] = useState<NegotiationResultDTO | null>(null);
  const [currentStages, setCurrentStages] = useState<NegotiationStageDTO[]>([]);

  const negotiate = useCallback(async (
    listingId: string,
    budget: number,
    maxLatencyMs: number,
    trustThreshold: number,
    requiredProtocols: ProtocolId[],
    slaUptime: number,
  ) => {
    setIsNegotiating(true);
    setResult(null);
    setCurrentStages([]);

    try {
      const useCase = new NegotiateContractUseCase(commerce, protocolRegistry);
      const negotiationResult = await useCase.execute({
        listingId,
        budget,
        maxLatencyMs,
        trustThreshold,
        requiredProtocols,
        slaUptime,
      });
      setResult(negotiationResult);
      setCurrentStages([...negotiationResult.stages]);
      return negotiationResult;
    } finally {
      setIsNegotiating(false);
    }
  }, [commerce, protocolRegistry]);

  const reset = useCallback(() => {
    setResult(null);
    setCurrentStages([]);
    setIsNegotiating(false);
  }, []);

  return { negotiate, isNegotiating, result, currentStages, reset };
}
