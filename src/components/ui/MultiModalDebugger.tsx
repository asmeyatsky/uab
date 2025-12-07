import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Activity, Video, Mic, MessageSquare, AlertTriangle } from 'lucide-react';

export function MultiModalDebugger() {
    const events = [
        { type: 'audio', time: '00:01', label: 'Voice Command Received', icon: Mic, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { type: 'system', time: '00:02', label: 'Intent Analysis (Gemini 2035)', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { type: 'video', time: '00:03', label: 'Visual Context Parsed', icon: Video, color: 'text-green-400', bg: 'bg-green-500/10' },
        { type: 'error', time: '00:04', label: 'Self-Correction Triggered', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
        { type: 'Chat', time: '00:05', label: 'Final Response Generated', icon: MessageSquare, color: 'text-white', bg: 'bg-white/10' },
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Activity className="text-primary" />
                    AOS Debugger
                </h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Play size={16} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Pause size={16} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><FastForward size={16} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`p-4 rounded-xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors ${event.bg} ${event.border || ''}`}
                    >
                        <div className="font-mono text-xs text-gray-500">{event.time}</div>
                        <div className={`p-2 rounded-lg bg-black/20 ${event.color}`}>
                            <event.icon size={16} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-200">{event.label}</div>
                            {event.type === 'error' && (
                                <div className="text-xs text-yellow-400mt-1">
                                    Re-writing prompt... (Self-Healing Active)
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Timeline visualization */}
                <div className="relative mt-8 h-20 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-red-500 z-10 animate-[moveLines_10s_linear_infinite]" style={{ left: '50%' }}></div>
                    <div className="absolute inset-0 flex items-end px-2 gap-1 opacity-50">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${Math.random() * 100}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
