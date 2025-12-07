import { useState } from 'react';
import { VoiceInput } from '../components/ui/VoiceInput';
import { MultiModalDebugger } from '../components/ui/MultiModalDebugger';
import { MemoryBank } from '../components/ui/MemoryBank';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Code2 } from 'lucide-react';

export function AgentBuilderPage() {
    const [prompt, setPrompt] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleVoiceInput = (text: string) => {
        setPrompt(prev => prev + ' ' + text);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setGeneratedSteps([
                'Analyzing intent...',
                'Selecting optimal A2A protocol...',
                'Provisioning micro-service container...',
                'Connecting to Knowledge Graph...',
                'Agent Ready.'
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Agent Builder 2035
                </h1>
                <p className="text-gray-400">
                    Describe your agent in natural language. The system will handle the rest.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Input Section */}
                <div className="glass-panel p-8 rounded-2xl flex flex-col">
                    <div className="flex-1 relative mb-6">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Example: 'Create a sales agent that monitors Gmail for leads, enriches data using Salesforce API, and sends summaries via Slack.'"
                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-lg p-4 font-light text-gray-200"
                        />

                        <div className="absolute bottom-4 right-4">
                            <VoiceInput
                                onTranscript={handleVoiceInput}
                                isListening={isListening}
                                setIsListening={setIsListening}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        className="w-full py-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isGenerating ? 'Architecting...' : 'Build Agent'}
                        {!isGenerating && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                {/* Visualization Section */}
                <div className="glass-panel p-8 rounded-2xl bg-black/40 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-sm mb-6">
                            <Code2 size={16} />
                            <span>Live Architecture Preview</span>
                        </div>

                        {generatedSteps.length > 0 ? (
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="space-y-4 flex-1">
                                    {generatedSteps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.4 }}
                                            className="flex items-center gap-4 text-green-400 font-mono"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            {step}
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: generatedSteps.length * 0.4 + 0.5 }}
                                        className="mt-8 p-6 glass-panel border-green-500/30 bg-green-500/5 rounded-xl flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                            <Bot size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Agent Deployed</h3>
                                            <p className="text-sm text-gray-400">Running on AOS v2.1</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Debugger Panel */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 3 }}
                                    className="space-y-4 mt-4"
                                >
                                    <div className="h-64">
                                        <MultiModalDebugger />
                                    </div>
                                    <MemoryBank />
                                </motion.div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                                <Bot size={64} className="mb-4 opacity-20" />
                                <p>Waiting for instructions...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
