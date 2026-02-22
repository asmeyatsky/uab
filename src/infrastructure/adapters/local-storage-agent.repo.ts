/**
 * LocalStorage Agent Repository Adapter
 * Implements AgentRepoPort using browser localStorage.
 */

import type { AgentRepoPort, AgentFilter } from '../../domain/ports/agent-repo.port.ts';
import type { Agent } from '../../domain/entities/agent.ts';
import { SEED_AGENTS } from '../data/seed-agents.ts';

const STORAGE_KEY = 'uab_agents';

export class LocalStorageAgentRepo implements AgentRepoPort {
  private agents: Map<string, Agent>;

  constructor() {
    this.agents = new Map();
    this.load();
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Agent[] = JSON.parse(stored);
        for (const agent of parsed) {
          this.agents.set(agent.id, agent);
        }
      } else {
        for (const agent of SEED_AGENTS) {
          this.agents.set(agent.id, agent);
        }
        this.persist();
      }
    } catch {
      for (const agent of SEED_AGENTS) {
        this.agents.set(agent.id, agent);
      }
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.agents.values()]));
    } catch {
      // Storage quota exceeded — silent fail
    }
  }

  getAll(): Agent[] {
    return [...this.agents.values()];
  }

  getById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  save(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.persist();
  }

  delete(id: string): void {
    this.agents.delete(id);
    this.persist();
  }

  filter(filter: AgentFilter): Agent[] {
    let results = this.getAll();

    if (filter.status) {
      results = results.filter(a => a.status === filter.status);
    }
    if (filter.type) {
      results = results.filter(a => a.type === filter.type);
    }
    if (filter.search) {
      const lower = filter.search.toLowerCase();
      results = results.filter(a =>
        a.name.toLowerCase().includes(lower) ||
        a.description.toLowerCase().includes(lower) ||
        a.capabilities.some(c => c.toLowerCase().includes(lower))
      );
    }
    if (filter.protocols && filter.protocols.length > 0) {
      results = results.filter(a =>
        filter.protocols!.some(p =>
          a.protocolBindings.some(b => b.protocolId === p && b.enabled)
        )
      );
    }
    if (filter.tags && filter.tags.length > 0) {
      results = results.filter(a =>
        filter.tags!.some(t => a.tags.includes(t))
      );
    }

    return results;
  }
}
