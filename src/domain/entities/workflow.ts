/**
 * Workflow Entity
 * DAG-based workflow definition for multi-step agent operations.
 */

export type WorkflowNodeType = 'start' | 'agent-call' | 'tool-call' | 'condition' | 'parallel-fork' | 'parallel-join' | 'end';

export interface WorkflowNode {
  readonly id: string;
  readonly type: WorkflowNodeType;
  readonly label: string;
  readonly config: Record<string, unknown>;
  readonly position: { readonly x: number; readonly y: number };
}

export interface WorkflowEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label?: string;
  readonly condition?: string;
}

export interface Workflow {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly nodes: readonly WorkflowNode[];
  readonly edges: readonly WorkflowEdge[];
  readonly createdAt: number;
  readonly updatedAt: number;
}

export function createWorkflow(partial: Partial<Workflow> & Pick<Workflow, 'id' | 'name'>): Workflow {
  return {
    description: '',
    nodes: [],
    edges: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...partial,
  };
}

export function addNode(workflow: Workflow, node: WorkflowNode): Workflow {
  return { ...workflow, nodes: [...workflow.nodes, node], updatedAt: Date.now() };
}

export function addEdge(workflow: Workflow, edge: WorkflowEdge): Workflow {
  return { ...workflow, edges: [...workflow.edges, edge], updatedAt: Date.now() };
}

export function removeNode(workflow: Workflow, nodeId: string): Workflow {
  return {
    ...workflow,
    nodes: workflow.nodes.filter(n => n.id !== nodeId),
    edges: workflow.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    updatedAt: Date.now(),
  };
}

export function getNodeDependencies(workflow: Workflow, nodeId: string): string[] {
  return workflow.edges.filter(e => e.target === nodeId).map(e => e.source);
}

export function getNodeDependents(workflow: Workflow, nodeId: string): string[] {
  return workflow.edges.filter(e => e.source === nodeId).map(e => e.target);
}
