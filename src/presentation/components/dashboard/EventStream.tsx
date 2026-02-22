import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import type { ProtocolId } from '../../../domain/protocols/protocol.types.ts';

interface StreamEvent {
  id: string;
  type: string;
  protocol: ProtocolId;
  message: string;
  timestamp: number;
}

const EVENT_TEMPLATES: Omit<StreamEvent, 'id' | 'timestamp'>[] = [
  { type: 'text-message-start', protocol: 'ag-ui', message: 'Agent initiated conversation stream' },
  { type: 'tool-call-start', protocol: 'mcp', message: 'Invoking database query tool' },
  { type: 'task-delegated', protocol: 'a2a', message: 'Task delegated to analytics sub-agent' },
  { type: 'workflow-step', protocol: 'adk', message: 'Parallel branch completed (3/4)' },
  { type: 'checkout-initiated', protocol: 'acp', message: 'Agent checkout: 2 items ($47.99)' },
  { type: 'product-search', protocol: 'ucp', message: 'Cross-retailer search: 23 results' },
  { type: 'payment-auth', protocol: 'ap2', message: 'Payment authorized: $47.99 via card' },
  { type: 'identity-verified', protocol: 'visa-tap', message: 'Agent identity verified (enhanced)' },
  { type: 'ui-render', protocol: 'a2ui', message: 'Rendered chart component (progressive)' },
  { type: 'state-delta', protocol: 'ag-ui', message: 'State delta: cart.items updated' },
  { type: 'contract-proposed', protocol: 'toon', message: 'Contract terms proposed: $0.05/req' },
  { type: 'run-finished', protocol: 'ag-ui', message: 'Agent run completed (1.2s)' },
];

export function EventStream() {
  const [events, setEvents] = useState<StreamEvent[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]!;
      const newEvent: StreamEvent = {
        ...template,
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 20));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassPanel>
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Live Event Stream</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <ProtocolBadge protocolId={event.protocol} size="xs" />
              <span className="flex-1 text-xs text-gray-300 truncate">{event.message}</span>
              <span className="text-[10px] font-mono text-gray-600 shrink-0">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-8">Waiting for events...</p>
        )}
      </div>
    </GlassPanel>
  );
}
