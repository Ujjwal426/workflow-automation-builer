<script setup lang="ts">
import { useWorkflowStore } from "../../store/workflow.store";

const store = useWorkflowStore();

function onRun() {
  store.runWorkflow();
}

function onPauseResume() {
  store.isPaused = !store.isPaused;
}

function onStep() {
  if (!store.isRunning) {
    store.startStepMode();
  }
  store.step();
}

function onReset() {
  store.resetExecution();
}
</script>

<template>
  <div class="h-14 px-4 flex items-center gap-4 border-b bg-white">
    <div class="font-semibold text-gray-800 tracking-tight">
      ⚡ Workflow Builder
    </div>

    <div class="ml-6 flex items-center gap-2">
      <button
        @click="onRun"
        :disabled="store.isRunning && !store.isPaused"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        ▶ Run
      </button>

      <button
        @click="onPauseResume"
        :disabled="!store.isRunning"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          store.isPaused
            ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300'
        "
      >
        {{ store.isPaused ? "▶ Resume" : "⏸ Pause" }}
      </button>

      <button
        @click="onStep"
        :disabled="store.isRunning && !store.isPaused"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        ⏭ Step
      </button>

      <button
        @click="onReset"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:border-red-400"
      >
        🔄 Reset
      </button>
    </div>

    <div class="flex-1"></div>

    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1.5 rounded-md text-sm font-medium bg-white border hover:bg-gray-50"
        @click="store.saveWorkflow"
      >
        💾 Save
      </button>

      <button
        class="px-3 py-1.5 rounded-md text-sm font-medium bg-white border hover:bg-gray-50"
        @click="store.loadWorkflow"
      >
        📂 Load
      </button>
    </div>

    <div class="flex items-center gap-1 ml-2">
      <button
        @click="store.undo"
        class="w-9 h-9 flex items-center justify-center rounded-md border bg-white text-gray-700 text-lg hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Undo (Ctrl + Z)"
      >
        ↶
      </button>

      <button
        @click="store.redo"
        class="w-9 h-9 flex items-center justify-center rounded-md border bg-white text-gray-700 text-lg hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Redo (Ctrl + Shift + Z)"
      >
        ↷
      </button>
    </div>
  </div>
</template>
