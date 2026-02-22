import { useMemo } from 'react';
import { useContainer } from '../store/useContainer.ts';
import { useAppStore } from '../store/app-store.ts';
import { BrowseMarketplaceUseCase } from '../../application/use-cases/browse-marketplace.ts';

export function useMarketplace() {
  const { commerce } = useContainer();
  const { search, selectedProtocols, minRating } = useAppStore(s => s.marketplace);

  const listings = useMemo(() => {
    const useCase = new BrowseMarketplaceUseCase(commerce);
    return useCase.execute({
      search: search || undefined,
      protocols: selectedProtocols.length > 0 ? selectedProtocols : undefined,
      minRating: minRating > 0 ? minRating : undefined,
    });
  }, [commerce, search, selectedProtocols, minRating]);

  return { listings };
}
