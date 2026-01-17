<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from "@vue-flow/core";
import type { EdgeUpdateEvent } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import { v4 as uuid } from "uuid";
import { onMounted, onUnmounted } from "vue";

import { nodeRegistry } from "../../nodes";
import { useWorkflowStore } from "../../store/workflow.store";

const store = useWorkflowStore();

const { project, fitView, zoomIn, zoomOut, setViewport } = useVueFlow();

onMounted(() => {
  store.loadWorkflow();

  if (store.viewport) {
    setViewport(store.viewport);
  }

  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
});

function getConditionEdgeStyle(label: string) {
  if (label === "true") {
    return {
      stroke: "#16a34a",
    };
  }

  if (label === "false") {
    return {
      stroke: "#dc2626",
    };
  }

  return {
    stroke: "#6366f1",
  };
}

function onKeyDown(e: KeyboardEvent) {
  const isMac = navigator.platform.includes("Mac");
  const ctrl = isMac ? e.metaKey : e.ctrlKey;

  if (!ctrl) return;

  if (e.key === "Delete" && store.selectedEdge?.id) {
    store.edges = store.edges.filter((e) => e.id !== store.selectedEdge.id);
    store.selectedEdge = null;
    store.snapshot();
  }

  /* UNDO */
  if (e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    store.undo();
  }

  /* REDO */
  if (e.key === "z" && e.shiftKey) {
    e.preventDefault();
    store.redo();
  }

  /* DUPLICATE NODE */
  if (e.key.toLowerCase() === "d") {
    e.preventDefault();

    const node = store.selectedNode;
    if (!node) return;

    store.snapshot();

    store.nodes.push({
      ...JSON.parse(JSON.stringify(node)),
      id: uuid(),
      position: {
        x: node.position.x + 40,
        y: node.position.y + 40,
      },
    });
  }
}

function onConnect(params: any) {
  const { source, target, sourceHandle } = params;

  store.snapshot();

  const sourceNode = store.nodes.find((n) => n.id === source);

  let label = "";
  let style = undefined;

  if (sourceNode?.type?.split(".")?.[0] === "Logic") {
    label = sourceHandle === "true" ? "true" : "false";
    style = getConditionEdgeStyle(label);
  }

  store.edges.push({
    id: uuid(),
    source,
    target,
    sourceHandle,
    targetHandle: params.targetHandle,
    label,
    style,
  });
}

function onEdgesChange(changes: any[]) {
  store.snapshot();
  store.edges = applyEdgeChanges(changes, store.edges);
}

function onEdgeUpdate(event: EdgeUpdateEvent) {
  const { edge: oldEdge, connection: newConnection } = event;

  store.snapshot();

  store.edges = store.edges.map((edge) => {
    if (edge.id !== oldEdge.id) return edge;

    const sourceNode = store.nodes.find((n) => n.id === newConnection.source);

    let label = edge.label;
    let style = edge.style;

    if (sourceNode?.type === "condition") {
      label = newConnection.sourceHandle === "true" ? "true" : "false";
      style = getConditionEdgeStyle(label);
    }

    return {
      ...edge,
      ...newConnection,
      label,
      style,
    };
  });
}

function onEdgeClick({ edge }: any) {
  store.selectedEdge = edge;
}

function onDrop(e: DragEvent) {
  const raw = e.dataTransfer?.getData("application/vueflow");
  if (!raw) return;

  console.log("raw", raw);

  const { type } = JSON.parse(raw);
  const def = nodeRegistry[type];
  if (!def) return;

  store.nodes.push({
    id: uuid(),
    type,
    position: project({
      x: e.clientX,
      y: e.clientY,
    }),
    data: {
      label: def.label,
      config: { ...def.defaults },
    },
  });

  store.snapshot();
}

function onNodeClick({ node }: any) {
  console.log("Clicked node:", node);
  store.selectedNode = node;
}

function onMoveEnd({ viewport }: any) {
  store.viewport = viewport;
}

function onFitView() {
  fitView({ padding: 0.6, duration: 300 });
}

function onZoomIn() {
  zoomIn({ duration: 200 });
}

function onZoomOut() {
  zoomOut({ duration: 200 });
}

function onNodesChange(changes: any[]) {
  store.snapshot();
  store.nodes = applyNodeChanges(changes, store.nodes);
}
</script>

<template>
  <div class="w-full h-full">
    <VueFlow
      v-model:nodes="store.nodes"
      v-model:edges="store.edges"
      fit-view
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      :node-types="
        Object.fromEntries(
          Object.entries(nodeRegistry).map(([key, value]) => [
            key,
            value.component,
          ]),
        )
      "
      @dragover.prevent
      :selection-on-drag="true"
      :multi-selection-key-code="['Shift']"
      :pan-on-drag="false"
      class="flex-1 rounded-xl m-3 panel overflow-hidden !w-[97%]"
      @drop="onDrop"
      @connect="onConnect"
      @node-click="onNodeClick"
      @move-end="onMoveEnd"
      @edge-click="onEdgeClick"
      :edge-updatable="true"
      :edge-updatable-type="'target'"
      @edges-change="onEdgesChange"
      @edge-update="onEdgeUpdate"
      @nodes-change="onNodesChange"
    >
      <!-- MiniMap -->
      <MiniMap
        :pannable="true"
        :zoomable="true"
        class="bg-white border border-gray-200 rounded-lg shadow-md"
      />

      <!-- Custom Controls -->
      <Controls class="!bg-transparent !shadow-none">
        <div
          class="flex flex-col gap-2 p-2 bg-white rounded-xl shadow-lg border"
        >
          <button
            @click="onZoomIn"
            class="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 font-semibold"
            title="Zoom In"
          >
            +
          </button>

          <button
            @click="onZoomOut"
            class="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 font-semibold"
            title="Zoom Out"
          >
            −
          </button>

          <div class="h-px bg-gray-200 my-1"></div>

          <button
            @click="onFitView"
            class="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
            title="Fit View"
          >
            ⛶
          </button>
        </div>
      </Controls>
    </VueFlow>
  </div>
</template>
