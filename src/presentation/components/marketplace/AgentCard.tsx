import { Star, Download, CheckCircle } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import { TrustScoreIndicator } from '../ui/TrustScoreIndicator.tsx';
import { NeonButton } from '../ui/NeonButton.tsx';
import type { MarketplaceListingDTO } from '../../../application/dtos/marketplace.dto.ts';

interface AgentCardProps {
  listing: MarketplaceListingDTO;
  onSelect: () => void;
  onHire: () => void;
}

export function AgentCard({ listing, onSelect, onHire }: AgentCardProps) {
  return (
    <GlassPanel
      hover
      className="cursor-pointer"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{listing.agentAvatar}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-100">{listing.agentName}</h3>
              {listing.verified && <CheckCircle size={12} className="text-primary" />}
            </div>
            <p className="text-xs text-gray-500">{listing.sellerName}</p>
          </div>
        </div>
        <TrustScoreIndicator score={listing.trustScore} size="sm" />
      </div>

      <p className="mb-3 text-xs text-gray-400 line-clamp-2">{listing.agentDescription}</p>

      <div className="mb-3 flex flex-wrap gap-1">
        {listing.protocols.slice(0, 4).map(p => (
          <ProtocolBadge key={p} protocolId={p} size="xs" />
        ))}
        {listing.protocols.length > 4 && (
          <span className="text-xs text-gray-500">+{listing.protocols.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star size={10} className="text-yellow-500" />
            {listing.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Download size={10} />
            {listing.downloads.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-primary">{listing.price}</span>
          <NeonButton
            size="sm"
            onClick={(e) => { e.stopPropagation(); onHire(); }}
          >
            Hire
          </NeonButton>
        </div>
      </div>
    </GlassPanel>
  );
}
