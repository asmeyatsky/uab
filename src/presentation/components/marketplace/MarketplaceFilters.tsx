import { Search, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/app-store.ts';
import { useProtocolRegistry } from '../../hooks/useProtocolRegistry.ts';
import { ProtocolIcon } from '../ui/ProtocolIcon.tsx';
import { clsx } from 'clsx';

export function MarketplaceFilters() {
  const store = useAppStore();
  const { search, selectedProtocols } = store.marketplace;
  const { allProtocols } = useProtocolRegistry();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => store.setMarketplaceSearch(e.target.value)}
          placeholder="Search agents..."
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-600 focus:border-primary/50 focus:outline-none"
        />
      </div>

      {/* Protocol filters */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <SlidersHorizontal size={12} />
          <span>Filter by Protocol</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allProtocols.map(spec => {
            const selected = selectedProtocols.includes(spec.metadata.id);
            return (
              <button
                key={spec.metadata.id}
                onClick={() => store.toggleMarketplaceProtocol(spec.metadata.id)}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all',
                  selected
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-white/10 text-gray-400 hover:border-white/20',
                )}
              >
                <ProtocolIcon protocolId={spec.metadata.id} size={10} color={selected ? undefined : spec.metadata.color} />
                {spec.metadata.shortName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
