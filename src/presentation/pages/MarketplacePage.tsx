import { motion } from 'framer-motion';
import { useAppStore } from '../store/app-store.ts';
import { useMarketplace } from '../hooks/useMarketplace.ts';
import { AgentCard } from '../components/marketplace/AgentCard.tsx';
import { AgentDetailModal } from '../components/marketplace/AgentDetailModal.tsx';
import { MarketplaceFilters } from '../components/marketplace/MarketplaceFilters.tsx';
import { NegotiationModal } from '../components/marketplace/NegotiationModal.tsx';

export function MarketplacePage() {
  const store = useAppStore();
  const { selectedListing, showNegotiation, showDetail } = store.marketplace;
  const { listings } = useMarketplace();

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Agent Marketplace
          </span>
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Discover, compare, and hire AI agents across 10 protocols
        </p>
      </div>

      <MarketplaceFilters />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing, i) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <AgentCard
              listing={listing}
              onSelect={() => {
                store.setSelectedListing(listing);
                store.setShowDetail(true);
              }}
              onHire={() => {
                store.setSelectedListing(listing);
                store.setShowNegotiation(true);
              }}
            />
          </motion.div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-gray-500">No agents found</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
        </div>
      )}

      <AgentDetailModal
        listing={showDetail ? selectedListing : null}
        onClose={() => store.setShowDetail(false)}
        onHire={() => {
          store.setShowDetail(false);
          store.setShowNegotiation(true);
        }}
      />

      <NegotiationModal
        listing={showNegotiation ? selectedListing : null}
        onClose={() => store.setShowNegotiation(false)}
      />
    </div>
  );
}
