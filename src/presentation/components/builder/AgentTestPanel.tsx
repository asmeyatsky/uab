import { useState, useCallback, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import { ProtocolBadge } from '../ui/ProtocolBadge.tsx';
import { NeonButton } from '../ui/NeonButton.tsx';
import { useContainer } from '../../store/useContainer.ts';
import { TestAgentUseCase, type TestSession, type TestMessage } from '../../../application/use-cases/test-agent.ts';
import type { Agent } from '../../../domain/entities/agent.ts';
import type { ProtocolId } from '../../../domain/protocols/protocol.types.ts';

interface AgentTestPanelProps {
  agent: Agent;
}

export function AgentTestPanel({ agent }: AgentTestPanelProps) {
  const { protocolRegistry } = useContainer();
  const [session, setSession] = useState<TestSession | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const useCaseRef = useRef(new TestAgentUseCase(protocolRegistry));

  useEffect(() => {
    setSession(useCaseRef.current.createSession(agent));
  }, [agent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !session || isThinking) return;
    const msg = input.trim();
    setInput('');
    setIsThinking(true);

    // Add user message immediately
    const userMsg: TestMessage = { role: 'user', content: msg, timestamp: Date.now() };
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev);

    const updated = await useCaseRef.current.sendMessage(session, agent, msg);
    setSession(updated);
    setIsThinking(false);
  }, [input, session, agent, isThinking]);

  return (
    <GlassPanel padding="none" className="flex flex-col h-[400px]">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-200">Test Agent</h3>
        <p className="text-xs text-gray-500">Simulated conversation with {agent.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {session?.messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/[0.05] text-gray-200 border border-white/10'
              }`}>
                <p>{msg.content}</p>
                {msg.protocols && msg.protocols.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {msg.protocols.map(p => (
                      <ProtocolBadge key={p} protocolId={p as ProtocolId} size="xs" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.1s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-100 focus:border-primary/50 focus:outline-none"
          />
          <NeonButton onClick={sendMessage} disabled={!input.trim() || isThinking} size="md" icon={<Send size={14} />}>
            Send
          </NeonButton>
        </div>
      </div>
    </GlassPanel>
  );
}
