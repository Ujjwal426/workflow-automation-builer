import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { nodeRegistry } from "../nodes";

const STORAGE_KEY = "workflow-builder-data";

export type ExecutionStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "skipped";

function sleep(ms = 100) {
  return new Promise((r) => setTimeout(r, ms));
}

/* Cycle detection (DFS) */
function hasCycle(nodes: any[], edges: any[]): boolean {
  const graph = new Map<string, string[]>();

  nodes.forEach((n) => graph.set(n.id, []));

  edges.forEach((e) => {
    if (graph.has(e.source)) {
      graph.get(e.source)!.push(e.target);
    }
  });

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (stack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    stack.add(nodeId);

    for (const next of graph.get(nodeId) || []) {
      if (dfs(next)) return true;
    }

    stack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (dfs(node.id)) return true;
  }

  return false;
}

/* Typed ports validation */
function validatePorts(nodes: any[], edges: any[]): string[] {
  const errors: string[] = [];

  for (const node of nodes) {
    const incoming = edges.filter((e) => e.target === node.id);
    const outgoing = edges.filter((e) => e.source === node.id);

    if (node.type?.startsWith("Trigger")) {
      if (incoming.length > 0) {
        errors.push("Trigger node cannot have incoming edges.");
      }
      if (outgoing.length === 0) {
        errors.push("Trigger node must have at least one outgoing edge.");
      }
    }

    if (node?.type?.startsWith("Logic")) {
      if (incoming.length !== 1) {
        errors.push("Condition node must have exactly one incoming edge.");
      }
      if (outgoing.length < 2) {
        errors.push(
          `Condition node "${node.data?.label}" must have TRUE and FALSE branches.`,
        );
      }
    }

    if (node.type === "http") {
      if (incoming.length !== 1) {
        errors.push("HTTP node must have exactly one incoming edge.");
      }
    }
  }

  return errors;
}

/* Condition TRUE / FALSE rule */
function validateConditions(nodes: any[], edges: any[]): string[] {
  const errors: string[] = [];

  const conditions = nodes.filter((n) => n.type?.startsWith("Logic"));

  for (const node of conditions) {
    const outgoing = edges.filter((e) => e.source === node.id);

    const hasTrue = outgoing.some((e) => e.sourceHandle === "true");
    const hasFalse = outgoing.some((e) => e.sourceHandle === "false");

    if (!hasTrue || !hasFalse) {
      errors.push(
        `Condition "${node.data?.label}" must have both TRUE and FALSE branches.`,
      );
    }
  }

  return errors;
}

/* simple debounce (no dependency) */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export const useWorkflowStore = defineStore("workflow", () => {
  /* graph */
  const nodes = ref<any[]>([]);
  const edges = ref<any[]>([]);
  const selectedNode = ref<any>(null);
  const selectedEdge = ref<any>(null);

  /* viewport */
  const viewport = ref({
    x: 0,
    y: 0,
    zoom: 1,
  });

  /* history */
  const past = ref<any[]>([]);
  const future = ref<any[]>([]);

  function snapshot() {
    past.value.push({
      nodes: nodes.value.map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: n.position.x, y: n.position.y },
        data: {
          label: n.data?.label,
          config: JSON.parse(JSON.stringify(n.data?.config || {})),
        },
      })),

      edges: edges.value.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        label: e.label,
      })),

      viewport: viewport.value
        ? {
            x: viewport.value.x,
            y: viewport.value.y,
            zoom: viewport.value.zoom,
          }
        : null,
    });

    future.value = [];
  }

  function undo() {
    if (!past.value.length) return;

    const prev = past.value.pop();

    future.value.push({
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value)),
      viewport: JSON.parse(JSON.stringify(viewport.value)),
    });

    nodes.value = prev.nodes;
    edges.value = prev.edges;
    viewport.value = prev.viewport;
  }

  function redo() {
    if (!future.value.length) return;

    const next = future.value.pop();

    past.value.push({
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value)),
      viewport: JSON.parse(JSON.stringify(viewport.value)),
    });

    nodes.value = next.nodes;
    edges.value = next.edges;
    viewport.value = next.viewport;
  }

  /* 💾 SAVE (explicit) */
  function saveWorkflow() {
    const errors = validate();

    if (errors.length) {
      alert("Cannot save workflow:\n\n" + errors.join("\n"));
      return;
    }

    const payload = {
      nodes: nodes.value,
      edges: edges.value,
      viewport: viewport.value,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    alert("Workflow saved");
  }

  /* 📂 LOAD (explicit) */
  function loadWorkflow() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    nodes.value = data.nodes || [];
    edges.value = data.edges || [];
    viewport.value = data.viewport || { x: 0, y: 0, zoom: 1 };
  }

  /* 🔁 AUTOSAVE (debounced) */
  const autosave = debounce(() => {
    const errors = validate();

    // 🚫 Skip autosave if invalid
    if (errors.length > 0) {
      console.warn("Autosave skipped due to validation errors:", errors);
      return;
    }

    const payload = {
      nodes: nodes.value,
      edges: edges.value,
      viewport: viewport.value,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, 500);

  watch(() => [nodes.value, edges.value, viewport.value], autosave, {
    deep: true,
  });

  const runningNodeId = ref<string | null>(null);
  const isRunning = ref(false);
  const isPaused = ref(false);

  const nodeStatus = ref<Record<string, ExecutionStatus>>({});
  const nodeLogs = ref<Record<string, string[]>>({});

  function resetExecution() {
    runningNodeId.value = null;
    isRunning.value = false;
    isPaused.value = false;
    nodeStatus.value = {};
    nodeLogs.value = {};
  }

  function log(nodeId: string, message: string) {
    if (!nodeLogs.value[nodeId]) {
      nodeLogs.value[nodeId] = [];
    }
    nodeLogs.value[nodeId].push(message);
  }

  let stepQueue: any[] = [];
  const stepContext = {
    results: {} as Record<string, any>,
  };

  function startStepMode() {
    resetExecution();
    isRunning.value = true;
    isPaused.value = true;
    stepContext.results = {};
    stepQueue = nodes.value.filter(
      (n) => !edges.value.some((e) => e.target === n.id),
    );
  }

  async function step() {
    if (!stepQueue.length || !isRunning.value) return;

    isPaused.value = false;

    const node = stepQueue.shift()!;
    const nodeId = node.id; // ✅ ensure plain string

    runningNodeId.value = nodeId;
    nodeStatus.value[nodeId] = "running";

    try {
      const def = nodeRegistry[node.type];

      // 🔑 find parent node
      const incomingEdge = edges.value.find((e) => e.target === nodeId);

      const sourceNodeId = incomingEdge?.source;

      const result = await def.executor(node.data.config, {
        results: stepContext.results,
        sourceNodeId,
      });

      // ✅ GUARANTEED SAFE
      stepContext.results[nodeId] = result;

      nodeStatus.value[nodeId] = "success";
      log(nodeId, "Success");

      const outgoing = edges.value.filter((e) => e.source === nodeId);

      /* CONDITION BRANCHING */
      if (node.type.startsWith("Logic")) {
        const branch = result === true ? "true" : "false";

        outgoing.forEach((e) => {
          if (e.sourceHandle === branch) {
            const next = nodes.value.find((n) => n.id === e.target);
            if (next) stepQueue.push(next);
          } else {
            nodeStatus.value[e.target] = "skipped";
          }
        });
      } else {
        /* NORMAL FLOW */
        outgoing.forEach((e) => {
          const next = nodes.value.find((n) => n.id === e.target);
          if (next) stepQueue.push(next);
        });
      }
    } catch (err: any) {
      nodeStatus.value[node.id] = "error";
      log(node.id, err.message || "Execution failed");
      isRunning.value = false;
    }

    isPaused.value = true;
  }

  function validate() {
    const errors: string[] = [];

    if (hasCycle(nodes.value, edges.value)) {
      errors.push("Workflow contains a cycle");
    }

    errors.push(...validatePorts(nodes.value, edges.value));
    errors.push(...validateConditions(nodes.value, edges.value));

    return errors;
  }

  async function runWorkflow() {
    resetExecution();
    isRunning.value = true;

    const context = {
      results: {} as Record<string, any>,
    };

    const visited = new Set<string>();

    // find trigger / start nodes
    let queue = nodes.value.filter(
      (n) => !edges.value.some((e) => e.target === n.id),
    );

    while (queue.length && isRunning.value) {
      while (isPaused.value) {
        await sleep(100);
      }

      const node = queue.shift()!;
      if (visited.has(node.id)) continue;

      runningNodeId.value = node.id;
      nodeStatus.value[node.id] = "running";

      const def = nodeRegistry[node.type];
      visited.add(node.id);

      // ⏱ artificial delay (optional)
      await sleep(2000);

      /* ---------------------------------
       EXECUTION
    ---------------------------------- */

      const incomingEdge = edges.value.find((e) => e.target === node.id);

      const sourceNodeId = incomingEdge?.source;

      const result = await def.executor(node.data.config, {
        results: context.results,
        sourceNodeId,
      });

      context.results[node.id] = result;

      nodeStatus.value[node.id] = "success";

      /* ---------------------------------
       BRANCHING
    ---------------------------------- */

      const outgoing = edges.value.filter((e) => e.source === node.id);

      // CONDITION NODE
      if (node.type.startsWith("Logic")) {
        const branch = result === true ? "true" : "false";

        outgoing.forEach((e) => {
          if (e.sourceHandle === branch) {
            const next = nodes.value.find((n) => n.id === e.target);
            if (next) queue.push(next);
          } else {
            nodeStatus.value[e.target] = "skipped";
          }
        });
      }
      // NORMAL NODE
      else {
        outgoing.forEach((e) => {
          const next = nodes.value.find((n) => n.id === e.target);
          if (next) queue.push(next);
        });
      }
    }

    runningNodeId.value = null;
    isRunning.value = false;
  }

  return {
    /* graph */
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    viewport,

    /* history */
    snapshot,
    undo,
    redo,

    /* persistence */
    saveWorkflow,
    loadWorkflow,

    /* execution */
    runningNodeId,
    isRunning,
    isPaused,
    nodeStatus,
    nodeLogs,
    step,
    startStepMode,
    runWorkflow,
    resetExecution,
    validate,
  };
});
