import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import type { BuildProgress as BuildProgressType, BuildStage } from '../../../domain/ports/builder.port.ts';
import { clsx } from 'clsx';

interface BuildProgressProps {
  progress: BuildProgressType | null;
  isBuilding: boolean;
}

const stageLabels: Record<BuildStage, string> = {
  analyzing: 'Analyzing Prompt',
  configuring: 'Configuring Protocols',
  validating: 'Validating Compatibility',
  generating: 'Generating Configuration',
  testing: 'Running Tests',
  complete: 'Complete',
  error: 'Error',
};

const allStages: BuildStage[] = ['analyzing', 'configuring', 'validating', 'generating', 'testing', 'complete'];

export function BuildProgress({ progress, isBuilding }: BuildProgressProps) {
  if (!isBuilding && !progress) return null;

  return (
    <GlassPanel>
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Build Progress</h3>
      <div className="space-y-3">
        {allStages.filter(s => s !== 'complete').map((stage) => {
          const isCompleted = progress?.completedStages.includes(stage);
          const isCurrent = progress?.stage === stage;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div key={stage} className="flex items-center gap-3">
              <div className={clsx(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                isCompleted && 'border-green-500 bg-green-500/20',
                isCurrent && 'border-primary bg-primary/20',
                isPending && 'border-white/10 bg-white/[0.02]',
              )}>
                {isCompleted ? (
                  <Check size={12} className="text-green-400" />
                ) : isCurrent ? (
                  <Loader2 size={12} className="text-primary animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                )}
              </div>
              <span className={clsx(
                'text-sm',
                isCompleted && 'text-gray-400',
                isCurrent && 'text-primary font-medium',
                isPending && 'text-gray-600',
              )}>
                {stageLabels[stage]}
              </span>
            </div>
          );
        })}
      </div>
      {progress && (
        <motion.div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
      {progress?.message && (
        <p className="mt-2 text-xs text-gray-400">{progress.message}</p>
      )}
    </GlassPanel>
  );
}
