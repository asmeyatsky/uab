/**
 * DAG Service
 * Directed Acyclic Graph utilities for workflow orchestration.
 * Validates DAGs, computes execution order, detects cycles.
 */

export interface DAGNode {
  readonly id: string;
  readonly dependsOn: readonly string[];
}

export interface DAGLevel {
  readonly level: number;
  readonly nodeIds: readonly string[];
}

export function topologicalSort(nodes: readonly DAGNode[]): DAGLevel[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, node.dependsOn.length);
    for (const dep of node.dependsOn) {
      const existing = adjacency.get(dep) ?? [];
      existing.push(node.id);
      adjacency.set(dep, existing);
    }
  }

  const levels: DAGLevel[] = [];
  const remaining = new Set(nodes.map(n => n.id));

  while (remaining.size > 0) {
    const ready = [...remaining].filter(id => {
      const node = nodeMap.get(id)!;
      return node.dependsOn.every(dep => !remaining.has(dep));
    });

    if (ready.length === 0) {
      throw new Error('Cycle detected in DAG');
    }

    levels.push({ level: levels.length, nodeIds: ready });
    for (const id of ready) {
      remaining.delete(id);
    }
  }

  return levels;
}

export function validateDAG(nodes: readonly DAGNode[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map(n => n.id));

  for (const node of nodes) {
    for (const dep of node.dependsOn) {
      if (!nodeIds.has(dep)) {
        errors.push(`Node "${node.id}" depends on unknown node "${dep}"`);
      }
      if (dep === node.id) {
        errors.push(`Node "${node.id}" has self-dependency`);
      }
    }
  }

  if (errors.length === 0) {
    try {
      topologicalSort(nodes);
    } catch {
      errors.push('DAG contains a cycle');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getExecutionPlan(nodes: readonly DAGNode[]): { parallel: string[][] } {
  const levels = topologicalSort(nodes);
  return { parallel: levels.map(l => [...l.nodeIds]) };
}
