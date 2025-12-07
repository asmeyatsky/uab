import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Scale, FileText, Zap } from 'lucide-react';
import type { Agent } from '../../store/mockAgents';

interface negotiationModalProps {
    agent: Agent | null;
    onClose: () => void;
}

export function NegotiationModal({ agent, onClose }: negotiationModalProps) {
    const [budget, setBudget] = useState(0.05);
    const [latency, setLatency] = useState(100);

    if (!agent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-panel w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/30 shadow-[0_0_50px_rgba(0,243,255,0.15)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Scale className="text-primary" />
                            TOON Protocol Negotiation
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-2 gap-8">
                        {/* Agent Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl ${agent.avatar} flex items-center justify-center shadow-lg`}>
                                    <ShieldCheck size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{agent.name}</h3>
                                    <div className="text-sm font-mono text-green-400">Verified Micro-Enterprise</div>
                                </div>
                            </div>

                            <div className="glass-panel p-4 rounded-xl bg-black/20">
                                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Trust Metrics</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Success Rate</span>
                                        <span className="text-primary font-mono">99.2%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Avg Response</span>
                                        <span className="text-primary font-mono">45ms</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Uptime (30d)</span>
                                        <span className="text-primary font-mono">100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Negotiation Controls */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex justify-between">
                                    <span>Max Budget (ETH)</span>
                                    <span className="font-mono text-primary">{budget} ETH</span>
                                </label>
                                <input
                                    type="range" min="0.01" max="0.5" step="0.01"
                                    value={budget}
                                    onChange={(e) => setBudget(parseFloat(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex justify-between">
                                    <span>Max Latency (ms)</span>
                                    <span className="font-mono text-secondary">{latency} ms</span>
                                </label>
                                <input
                                    type="range" min="10" max="500" step="10"
                                    value={latency}
                                    onChange={(e) => setLatency(parseInt(e.target.value))}
                                    className="w-full accent-secondary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="glass-panel p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                    <FileText size={14} /> Smart Contract Preview
                                </div>
                                <div className="font-mono text-xs text-primary/70 break-all">
                                    0x7f2c...3d9a | TOON_V2 | {agent.id}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:scale-105">
                            <Zap size={18} /> Sign & Hire
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
