import type { ZodSchema } from "zod";

export interface WorkflowNodeData<T = any> {
  label: string;
  config: T;
}

export interface WorkflowNode<T = any> {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: WorkflowNodeData<T>;
}

export type ExecutionContext = Record<string, any>;

export type NodeExecutor<T = any> = (
  config: T,
  context: ExecutionContext
) => Promise<any>;

export interface NodeDefinition<T = any> {
  label: string;
  component: any;
  schema: ZodSchema<T>;
  defaults: T;
  executor: NodeExecutor<T>;
}
