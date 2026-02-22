import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import { TrustScoreIndicator } from '../ui/TrustScoreIndicator.tsx';
import { NeonButton } from '../ui/NeonButton.tsx';
import type { MarketplaceListingDTO } from '../../../application/dtos/marketplace.dto.ts';

interface AgentDetailModalProps {
  listing: MarketplaceListingDTO | null;
  onClose: () => void;
  onHire: () => void;
}

export function AgentDetailModal({ listing, onClose, onHire }: AgentDetailModalProps) {
  return (
    <AnimatePresence>
      {listing && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{listing.agentAvatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-100">{listing.agentName}</h2>
                        {listing.verified && <CheckCircle size={16} className="text-primary" />}
                      </div>
                      <p className="text-sm text-gray-400">by {listing.sellerName}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500" /> {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)</span>
                        <span className="flex items-center gap-1"><Download size={10} /> {listing.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
                    <X size={18} />
                  </button>
                </div>

                <p className="mb-6 text-sm text-gray-300 leading-relaxed">{listing.agentDescription}</p>

                {/* Trust & Price */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <GlassPanel padding="sm">
                    <p className="text-xs text-gray-500 mb-1">Trust Score</p>
                    <TrustScoreIndicator score={listing.trustScore} size="lg" showLabel />
                  </GlassPanel>
                  <GlassPanel padding="sm">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="text-lg font-bold font-mono text-primary">{listing.price}</p>
                  </GlassPanel>
                </div>

                {/* Protocols */}
                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Protocol Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.protocols.map(p => (
                      <ProtocolBadge key={p} protocolId={p} size="md" />
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Capabilities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.capabilities.map(cap => (
                      <span key={cap} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">{cap}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <NeonButton onClick={onHire} className="flex-1" icon={<ExternalLink size={14} />}>
                    Negotiate & Hire
                  </NeonButton>
                  <NeonButton variant="ghost" onClick={onClose}>
                    Close
                  </NeonButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
