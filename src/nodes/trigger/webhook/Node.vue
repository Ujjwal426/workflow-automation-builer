<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { computed } from "vue";
import { useWorkflowStore } from "../../../store/workflow.store";

const props = defineProps<{
  id: string;
  data: {
    label: string;
  };
}>();

const P = Position;

const store = useWorkflowStore();

const isActive = computed(() => store.runningNodeId === props.id);
const status = computed(() => store.nodeStatus[props.id] || "idle");
</script>

<template>
  <div
    class="relative min-w-[170px] rounded-xl border px-4 py-3 bg-white transition-all duration-150 shadow-sm border-gray-200 hover:shadow-md hover:border-cyan-300"
    :class="[
      isActive && 'border-blue-500 ring-2 ring-blue-300',
      status === 'success' && 'border-green-500',
      status === 'error' && 'border-red-500',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-1">
      <!-- Icon -->
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-100 text-cyan-700 text-xs font-bold"
      >
        ⚡
      </div>

      <!-- Label -->
      <p class="text-sm font-semibold text-gray-800 truncate">
        {{ data.label }}
      </p>

      <p class="text-[11px] text-gray-500 capitalize">
        {{ status }}
      </p>
    </div>

    <!-- Subtitle -->
    <p class="text-[11px] text-gray-500">Webhook Trigger</p>

    <!-- Output Handle -->
    <Handle
      type="source"
      :position="P.Right"
      class="!bg-cyan-500 !border-cyan-600"
    />
  </div>
</template>
