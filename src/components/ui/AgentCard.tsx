import { motion } from 'framer-motion';
import { Shield, CheckCircle, Cpu, Zap } from 'lucide-react';
import type { Agent } from '../../store/mockAgents';

interface AgentCardProps {
    agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
        >
            <div className="absolute top-0 right-0 p-4">
                <div className={`flex items-center gap-1 text-sm font-mono ${agent.trustScore > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                    <Shield size={14} />
                    {agent.trustScore}% Trust
                </div>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${agent.avatar} flex items-center justify-center shadow-lg shadow-primary/20`}>
                    <Cpu className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {agent.name}
                        {agent.verified && <CheckCircle size={14} className="text-blue-400" />}
                    </h3>
                    <span className="text-xs font-mono text-gray-400 px-2 py-0.5 rounded-full border border-gray-700 bg-black/30">
                        {agent.type}
                    </span>
                </div>
            </div>

            <p className="text-sm text-gray-300 mb-6 line-clamp-2 h-10">
                {agent.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {agent.capabilities.map(cap => (
                    <span key={cap} className="text-xs bg-white/5 px-2 py-1 rounded text-primary/80">
                        {cap}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="font-mono text-lg font-bold text-secondary">
                    {agent.price} <span className="text-xs text-gray-400">ETH/run</span>
                </div>
                <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 rounded-lg text-sm font-bold flex items-center gap-2 transition-all group-hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <Zap size={16} /> Hire Agent
                </button>
            </div>
        </motion.div>
    );
}
