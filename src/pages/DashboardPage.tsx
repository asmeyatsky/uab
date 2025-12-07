import { motion } from 'framer-motion';
import { TrendingUp, Users, Wallet, Activity } from 'lucide-react';
import { AgentCard } from '../components/ui/AgentCard';
import { MOCK_AGENTS } from '../store/mockAgents';

export function DashboardPage() {
    const stats = [
        { label: 'Total Earnings', value: '2,450 AMX', change: '+12.5%', icon: Wallet, color: 'text-primary' },
        { label: 'Active Agents', value: '14', change: '+2', icon: Users, color: 'text-secondary' },
        { label: 'Network Confidence', value: '98.2%', change: '+0.4%', icon: Activity, color: 'text-green-400' },
    ];

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                        Command Center
                    </h1>
                    <p className="text-gray-400">Real-time economic monitoring and fleet management.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Current Cycle</div>
                    <div className="font-mono text-xl text-primary">EPOCH_2035.44</div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold font-mono text-white mb-2">{stat.value}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                            <TrendingUp size={12} /> {stat.change} this cycle
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Activity Graph Simulation */}
            <div className="glass-panel p-8 rounded-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Network Activity
                </h3>
                <div className="h-40 flex items-end justify-between gap-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.random() * 100}%` }}
                            transition={{ delay: 0.5 + i * 0.01, duration: 1 }}
                            className="flex-1 bg-primary/20 hover:bg-primary/50 transition-colors rounded-t-sm"
                        ></motion.div>
                    ))}
                </div>
            </div>

            {/* Active Investments */}
            <div>
                <h3 className="text-xl font-bold mb-6 text-white">Active Fleet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_AGENTS.slice(0, 2).map(agent => (
                        <div key={agent.id} className="opacity-80 hover:opacity-100 transition-opacity">
                            <AgentCard agent={{ ...agent, verified: true }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
