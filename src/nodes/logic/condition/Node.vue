<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { computed } from "vue";
import { useWorkflowStore } from "../../../store/workflow.store";

const P = Position;

const props = defineProps<{
  id: string;
  data: {
    label: string;
  };
}>();

const store = useWorkflowStore();

const isActive = computed(() => store.runningNodeId === props.id);
const status = computed(() => store.nodeStatus[props.id] || "idle");
</script>

<template>
  <div
    class="relative min-w-[200px] rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-100/40 px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:border-amber-300"
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
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 to-amber-100 text-amber-800 text-sm font-bold shadow-inner"
      >
        ?
      </div>

      <!-- Title -->
      <p class="text-sm font-semibold text-amber-900 tracking-tight truncate">
        Condition
      </p>

      <p class="text-[11px] text-gray-500 capitalize">
        {{ status }}
      </p>
    </div>

    <!-- Description -->
    <p class="text-[11px] text-amber-600 leading-snug mb-4">Evaluate rule</p>

    <!-- Divider -->
    <div class="h-px bg-amber-200/60 mb-3"></div>

    <!-- Handles -->

    <!-- Input -->
    <Handle
      type="target"
      :position="P.Left"
      class="!bg-amber-500 !border-amber-600"
    />

    <!-- True branch -->
    <div class="absolute right-[-8px] top-[32%] flex items-center gap-1.5">
      <span
        class="rounded-full bg-green-100 px-2 py-[1px] text-[10px] font-semibold text-green-700"
      >
        TRUE
      </span>
      <Handle
        id="true"
        type="source"
        :position="P.Right"
        class="!bg-green-500 !border-green-600"
      />
    </div>

    <!-- False branch -->
    <div class="absolute right-[-8px] top-[68%] flex items-center gap-1.5">
      <span
        class="rounded-full bg-red-100 px-2 py-[1px] text-[10px] font-semibold text-red-700"
      >
        FALSE
      </span>
      <Handle
        id="false"
        type="source"
        :position="P.Right"
        class="!bg-red-500 !border-red-600"
      />
    </div>
  </div>
</template>
