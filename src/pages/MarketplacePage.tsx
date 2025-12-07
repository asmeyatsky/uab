import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { AgentCard } from '../components/ui/AgentCard';
import { NegotiationModal } from '../components/ui/NegotiationModal';
import { MOCK_AGENTS, type Agent } from '../store/mockAgents';

export function MarketplacePage() {
    const [filter, setFilter] = useState('');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    const filteredAgents = MOCK_AGENTS.filter(a =>
        a.name.toLowerCase().includes(filter.toLowerCase()) ||
        a.capabilities.some(c => c.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    AMX Marketplace
                </h1>
                <p className="text-gray-400 text-lg">
                    Decentralized Micro-Enterprise Exchange. Hire autonomous agents for your workflows.
                </p>
            </header>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search agents by name or capability..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-gray-200 placeholder-gray-600"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button className="glass-panel px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/5 transition-colors">
                    <Filter size={20} />
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map(agent => (
                    <div key={agent.id} onClick={() => setSelectedAgent(agent)} className="cursor-pointer">
                        <AgentCard agent={agent} />
                    </div>
                ))}
            </div>

            {selectedAgent && (
                <NegotiationModal
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                />
            )}
        </div>
    );
}
