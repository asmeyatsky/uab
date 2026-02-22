/**
 * TestAgent Use Case
 * Simulates agent testing with protocol-aware responses.
 */

import type { ProtocolRegistryPort } from '../../domain/ports/protocol-registry.port.ts';
import type { Agent } from '../../domain/entities/agent.ts';
import { getEnabledProtocols } from '../../domain/entities/agent.ts';

export interface TestMessage {
  readonly role: 'user' | 'agent';
  readonly content: string;
  readonly timestamp: number;
  readonly protocols?: readonly string[];
}

export interface TestSession {
  readonly agentId: string;
  readonly messages: readonly TestMessage[];
  readonly startedAt: number;
}

const AGENT_RESPONSES: Record<string, string[]> = {
  commerce: [
    'I found 12 matching products across 3 retailers. The best deal is $29.99 at Walmart with free shipping. Shall I proceed with checkout?',
    'Price comparison complete. I\'ve negotiated a 15% discount using TOON protocol. Your total would be $25.49. Payment will be processed securely via AP2.',
    'Identity verification passed via Visa TAP. Your agent trust score is 94/100. Ready to complete the purchase.',
  ],
  orchestrator: [
    'Workflow initialized. I\'ve decomposed your task into 4 parallel branches. Estimated completion: 2.3 seconds.',
    'All sub-agents have been discovered via A2A protocol. Negotiating contracts with TOON... 3 of 4 agents accepted terms.',
    'DAG execution complete. 6 steps ran in parallel, 2 sequential. Total execution time: 1.8s. See the workflow visualization for details.',
  ],
  analytics: [
    'Connected to 3 data sources via MCP. Running parallel queries across sales, inventory, and customer databases.',
    'Analysis complete. Revenue is up 23% MoM. I\'ve generated an interactive dashboard with charts and drill-down tables via A2UI.',
    'Anomaly detected in Q3 data. Confidence: 94%. Rendering detailed breakdown with trend analysis.',
  ],
  assistant: [
    'I\'ve accessed your knowledge base via MCP resources. Here\'s a summary of the relevant documents.',
    'I can help with that. Let me invoke the code execution tool to generate the solution.',
    'Streaming response via AG-UI protocol. You can see the progress in real-time.',
  ],
  security: [
    'Security scan initiated. Checking agent identities across the network via Visa TAP...',
    'Detected 2 unverified agents attempting to access commerce endpoints. Trust scores below threshold. Blocking and logging.',
    'Compliance report generated. All agents meet GDPR requirements. 0 policy violations in the last 24 hours.',
  ],
  creative: [
    'Generating visual content based on your prompt. Streaming preview via A2UI progressive rendering...',
    'Content generated. I\'ve created 3 variations with different styles. Rendering side-by-side comparison.',
    'Design system updated. New components available for preview. AG-UI events will reflect changes in real-time.',
  ],
};

export class TestAgentUseCase {
  registry: ProtocolRegistryPort;

  constructor(registry: ProtocolRegistryPort) {
    this.registry = registry;
  }

  createSession(agent: Agent): TestSession {
    return {
      agentId: agent.id,
      messages: [],
      startedAt: Date.now(),
    };
  }

  async sendMessage(session: TestSession, agent: Agent, userMessage: string): Promise<TestSession> {
    const userMsg: TestMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const protocols = getEnabledProtocols(agent);
    const protocolNames = protocols.map(p => {
      const spec = this.registry.getById(p);
      return spec?.metadata.shortName ?? p;
    });

    const responses = AGENT_RESPONSES[agent.type] ?? AGENT_RESPONSES['assistant']!;
    const responseIndex = session.messages.filter(m => m.role === 'agent').length % responses.length;

    const agentMsg: TestMessage = {
      role: 'agent',
      content: responses[responseIndex]!,
      timestamp: Date.now(),
      protocols: protocolNames,
    };

    return {
      ...session,
      messages: [...session.messages, userMsg, agentMsg],
    };
  }
}
