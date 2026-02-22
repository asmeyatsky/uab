import { Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../../store/app-store.ts';
import { NeonTextarea } from '../ui/NeonInput.tsx';
import { NeonButton } from '../ui/NeonButton.tsx';
import { NeonInput } from '../ui/NeonInput.tsx';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import type { AgentType } from '../../../domain/entities/agent.ts';

const agentTypes: { value: AgentType; label: string; emoji: string }[] = [
  { value: 'assistant', label: 'Assistant', emoji: '💬' },
  { value: 'commerce', label: 'Commerce', emoji: '🛒' },
  { value: 'analytics', label: 'Analytics', emoji: '📊' },
  { value: 'orchestrator', label: 'Orchestrator', emoji: '🎯' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'security', label: 'Security', emoji: '🛡️' },
];

export function PromptInput() {
  const store = useAppStore();
  const { prompt, name, description, type } = store.builder;

  return (
    <div className="space-y-5">
      <GlassPanel>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-gray-200">Describe Your Agent</h3>
        </div>

        <NeonTextarea
          value={prompt}
          onChange={(e) => store.setBuilderPrompt(e.target.value)}
          placeholder="Describe what you want your agent to do. Be specific about capabilities, integrations, and workflows..."
          rows={4}
          className="mb-4"
        />

        <div className="grid grid-cols-2 gap-3">
          <NeonInput
            label="Agent Name"
            value={name}
            onChange={(e) => store.setBuilderName(e.target.value)}
            placeholder="My Agent"
          />
          <NeonInput
            label="Description"
            value={description}
            onChange={(e) => store.setBuilderDescription(e.target.value)}
            placeholder="Brief description..."
          />
        </div>
      </GlassPanel>

      <GlassPanel>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Agent Type</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {agentTypes.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => store.setBuilderType(value)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-all ${
                type === value
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span className="text-lg">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="flex justify-end">
        <NeonButton
          onClick={() => store.setBuilderStep(1)}
          disabled={!prompt.trim()}
          icon={<Zap size={14} />}
        >
          Select Protocols
        </NeonButton>
      </div>
    </div>
  );
}
