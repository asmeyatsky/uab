import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Settings, Eye } from 'lucide-react';
import { useAppStore } from '../store/app-store.ts';
import { useProtocolConfig } from '../hooks/useProtocolConfig.ts';
import { useBuildAgent } from '../hooks/useBuildAgent.ts';
import { GlassPanel } from '../components/ui/GlassPanel.tsx';
import { NeonButton } from '../components/ui/NeonButton.tsx';
import { PromptInput } from '../components/builder/PromptInput.tsx';
import { ProtocolSelector } from '../components/protocols/ProtocolSelector.tsx';
import { ProtocolConfigurator } from '../components/protocols/ProtocolConfigurator.tsx';
import { BuildProgress } from '../components/builder/BuildProgress.tsx';
import { ConfigPreview } from '../components/builder/ConfigPreview.tsx';
import { AgentTestPanel } from '../components/builder/AgentTestPanel.tsx';

const steps = [
  { label: 'Prompt', icon: Zap },
  { label: 'Protocols', icon: Settings },
  { label: 'Configure', icon: Settings },
  { label: 'Preview & Test', icon: Eye },
];

export function AgentBuilderPage() {
  const store = useAppStore();
  const { step, selectedProtocols, isBuilding, buildProgress, builtAgent } = store.builder;
  const { recommendations } = useProtocolConfig();
  const { buildAgent } = useBuildAgent();

  const handleBuild = async () => {
    store.setBuilderStep(3);
    await buildAgent();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Agent Builder
          </span>
        </h1>
        <p className="mt-1 text-sm text-gray-400">Create AI agents with the 2026 protocol stack</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const completed = i < step;
          return (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${completed ? 'bg-primary' : 'bg-white/10'}`} />}
              <button
                onClick={() => i < step && store.setBuilderStep(i)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border-primary/50 bg-primary/20 text-primary'
                    : completed
                      ? 'border-primary/30 bg-primary/10 text-primary/70 cursor-pointer'
                      : 'border-white/10 text-gray-500'
                }`}
              >
                <Icon size={12} />
                {s.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && <PromptInput />}

          {step === 1 && (
            <div className="space-y-4">
              <ProtocolSelector recommendations={recommendations} />
              <div className="flex justify-between">
                <NeonButton variant="ghost" onClick={() => store.setBuilderStep(0)} icon={<ArrowLeft size={14} />}>
                  Back
                </NeonButton>
                <NeonButton
                  onClick={() => store.setBuilderStep(2)}
                  disabled={selectedProtocols.length === 0}
                  icon={<Settings size={14} />}
                >
                  Configure Protocols ({selectedProtocols.length})
                </NeonButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {selectedProtocols.length === 0 ? (
                <GlassPanel>
                  <p className="text-sm text-gray-400 text-center py-8">No protocols selected. Go back to select protocols.</p>
                </GlassPanel>
              ) : (
                selectedProtocols.map(id => (
                  <ProtocolConfigurator key={id} protocolId={id} />
                ))
              )}
              <div className="flex justify-between">
                <NeonButton variant="ghost" onClick={() => store.setBuilderStep(1)} icon={<ArrowLeft size={14} />}>
                  Back
                </NeonButton>
                <NeonButton onClick={handleBuild} loading={isBuilding} icon={<Zap size={14} />}>
                  Build Agent
                </NeonButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <BuildProgress progress={buildProgress} isBuilding={isBuilding} />
                <ConfigPreview />
              </div>
              <div>
                {builtAgent && <AgentTestPanel agent={builtAgent} />}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
