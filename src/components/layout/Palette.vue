<script setup lang="ts">
import { nodeRegistry } from "../../nodes";

const nodeTypes = Object.entries(nodeRegistry).map(([type, def]) => ({
  type,
  label: def.label,
}));

function onDragStart(e: DragEvent, node: any) {
  e.dataTransfer?.setData("application/vueflow", JSON.stringify(node));
  e.dataTransfer!.effectAllowed = "move";
}
</script>

<template>
  <div class="w-64 bg-white border-r p-4 select-none flex flex-col gap-4">
    <h3 class="font-semibold text-gray-700 tracking-tight">Nodes</h3>

    <div class="flex flex-col gap-3">
      <div
        v-for="node in nodeTypes"
        :key="node.type"
        draggable="true"
        @dragstart="onDragStart($event, node)"
        class="group cursor-grab rounded-xl border bg-gradient-to-br from-white to-gray-50 px-3 py-2 select-none hover:shadow-md hover:border-gray-300 transition-all duration-150 ease-out"
      >
        <p class="text-sm font-medium text-gray-800">
          {{ node.label }}
        </p>
        <p class="text-xs text-gray-500 capitalize">
          {{ node.type?.split(".")?.[0] }}
        </p>
      </div>
    </div>
  </div>
</template>
