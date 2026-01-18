<script setup lang="ts">
import { Handle } from "@vue-flow/core";
import { Position } from "@vue-flow/core";
import { computed } from "vue";
import { useWorkflowStore } from "../../../store/workflow.store";

const P = Position;

const props = defineProps<{ id: string }>();

const store = useWorkflowStore();

const isActive = computed(() => store.runningNodeId === props.id);
const status = computed(() => store.nodeStatus[props.id] || "idle");
</script>

<template>
  <div
    class="relative min-w-[190px] rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-indigo-100/40 px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-indigo-300"
    :class="[
      isActive && 'border-indigo-500 ring-2 ring-indigo-300',
      status === 'success' && 'border-green-500',
      status === 'error' && 'border-red-500',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-2">
      <div
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-200 to-indigo-100 text-indigo-800 text-sm font-bold shadow-inner"
      >
        ⏱️
      </div>

      <p class="text-sm font-semibold text-indigo-900 truncate">Delay</p>

      <p class="text-[11px] text-gray-500 capitalize">
        {{ status }}
      </p>
    </div>

    <p class="text-[11px] text-indigo-600 mb-4">Wait before next step</p>

    <div class="h-px bg-indigo-200/60 mb-3"></div>

    <!-- Handles -->
    <Handle
      type="target"
      :position="P.Left"
      class="!bg-indigo-500 !border-indigo-600"
    />

    <Handle
      type="source"
      :position="P.Right"
      class="!bg-indigo-500 !border-indigo-600"
    />
  </div>
</template>
