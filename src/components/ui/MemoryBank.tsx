import { motion } from 'framer-motion';
import { Database, Brain, History, Save } from 'lucide-react';

export function MemoryBank() {
    const memories = [
        { type: 'short', label: 'Session Context', value: '45KB', icon: History, color: 'text-blue-400' },
        { type: 'long', label: 'Vector Knowledge', value: '1.2GB', icon: Database, color: 'text-purple-400' },
        { type: 'episodic', label: 'Experience Graph', value: '892 Nodes', icon: Brain, color: 'text-green-400' },
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Save className="text-secondary" />
                    Hierarchical Memory Bank
                </h3>
                <span className="text-xs font-mono text-gray-500">AOS_MEM_V4</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {memories.map((mem, index) => (
                    <motion.div
                        key={mem.type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
                    >
                        <mem.icon className={`${mem.color} mb-2`} size={24} />
                        <div className="text-sm text-gray-400">{mem.label}</div>
                        <div className="text-xl font-mono font-bold text-white">{mem.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Memory Pressure</span>
                    <span>32%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '32%' }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                    ></motion.div>
                </div>
            </div>
        </div>
    );
}
