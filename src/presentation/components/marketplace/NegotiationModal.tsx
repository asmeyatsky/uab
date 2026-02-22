import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, FileSignature, ShieldCheck, CreditCard, HandshakeIcon } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { NeonButton } from '../ui/NeonButton.tsx';
import { useNegotiation } from '../../hooks/useNegotiation.ts';
import type { MarketplaceListingDTO } from '../../../application/dtos/marketplace.dto.ts';
import type { NegotiationStageDTO } from '../../../application/dtos/negotiation.dto.ts';
import { clsx } from 'clsx';

interface NegotiationModalProps {
  listing: MarketplaceListingDTO | null;
  onClose: () => void;
}

const stageIcons: Record<string, typeof FileSignature> = {
  'Contract Terms Proposal': FileSignature,
  'Identity Verification': ShieldCheck,
  'Payment Authorization': CreditCard,
  'Contract Signing': HandshakeIcon,
};

export function NegotiationModal({ listing, onClose }: NegotiationModalProps) {
  const { negotiate, isNegotiating, result } = useNegotiation();
  const [budget, setBudget] = useState(100);
  const [latency, setLatency] = useState(200);

  if (!listing) return null;

  const handleNegotiate = () => {
    negotiate(
      listing.id,
      budget,
      latency,
      70,
      [...listing.protocols],
      99.5,
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-100">Negotiate Contract</h2>
              <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{listing.agentAvatar}</span>
              <div>
                <h3 className="text-sm font-bold text-gray-100">{listing.agentName}</h3>
                <p className="text-xs text-gray-400">{listing.price}</p>
              </div>
            </div>

            {!result && !isNegotiating && (
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-400">Budget</label>
                    <span className="text-xs font-mono text-primary">${budget}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-400">Max Latency</label>
                    <span className="text-xs font-mono text-primary">{latency}ms</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={latency}
                    onChange={(e) => setLatency(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <NeonButton onClick={handleNegotiate} className="w-full" icon={<HandshakeIcon size={14} />}>
                  Start Negotiation
                </NeonButton>
              </div>
            )}

            {(isNegotiating || result) && (
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Negotiation Stages</h4>
                {result?.stages.map((stage: NegotiationStageDTO, i: number) => {
                  const Icon = stageIcons[stage.name] ?? FileSignature;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <GlassPanel padding="sm" className="flex items-center gap-3">
                        <div className={clsx(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                          stage.status === 'completed' ? 'border-green-500/50 bg-green-500/20' : 'border-white/10 bg-white/5',
                        )}>
                          {stage.status === 'completed' ? <Check size={14} className="text-green-400" /> : <Icon size={14} className="text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-200">{stage.name}</span>
                            <span className="text-[10px] font-mono text-gray-500">{stage.protocolName}</span>
                          </div>
                          <p className="text-xs text-gray-400">{stage.message}</p>
                        </div>
                      </GlassPanel>
                    </motion.div>
                  );
                })}

                {isNegotiating && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Processing negotiation...
                  </div>
                )}

                {result?.accepted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <GlassPanel className="border-green-500/30 bg-green-500/5">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-green-400 mb-1">Contract Accepted!</p>
                        <p className="text-xs text-gray-400">Final price: {result.finalPrice} · Saved: {result.savings}</p>
                        <p className="text-[10px] font-mono text-gray-500 mt-1">Contract: {result.contractId}</p>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
