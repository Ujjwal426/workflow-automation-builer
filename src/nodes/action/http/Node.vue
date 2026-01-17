<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { computed } from "vue";
import { useWorkflowStore } from "../../../store/workflow.store";

const P = Position;

const props = defineProps<{
  id: string;
}>();

const store = useWorkflowStore();

const isActive = computed(() => store.runningNodeId === props.id);
const status = computed(() => store.nodeStatus[props.id] || "idle");
</script>

<template>
  <div
    class="relative min-w-[200px] rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/40 px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:border-blue-300"
    :class="[
      isActive && 'border-blue-500 ring-2 ring-blue-300',
      status === 'success' && 'border-green-500',
      status === 'error' && 'border-red-500',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-2">
      <!-- Icon -->
      <div
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-200 to-blue-100 text-blue-800 text-sm font-bold shadow-inner"
      >
        🌐
      </div>

      <!-- Title -->
      <p class="text-sm font-semibold text-blue-900 tracking-tight truncate">
        HTTP Request
      </p>

      <p class="text-[11px] text-gray-500 capitalize">
        {{ status }}
      </p>
    </div>

    <!-- Description -->
    <p class="text-[11px] text-blue-600 leading-snug mb-4">Call external API</p>

    <!-- Divider -->
    <div class="h-px bg-blue-200/60 mb-3"></div>

    <!-- Handles -->
    <!-- Input -->
    <Handle
      type="target"
      :position="P.Left"
      class="!bg-blue-500 !border-blue-600"
    />

    <!-- Output -->
    <Handle
      type="source"
      :position="P.Right"
      class="!bg-blue-500 !border-blue-600"
    />
  </div>
</template>
