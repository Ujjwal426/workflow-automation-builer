<script setup lang="ts">
import Palette from "../components/layout/Palette.vue";
import WorkflowCanvas from "../components/canvas/WorkflowCanvas.vue";
import ConfigPanel from "../components/layout/ConfigPanel.vue";
import TopBar from "../components/layout/TopBar.vue";
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <Palette />

    <div class="flex flex-col flex-1">
      <TopBar />
      <WorkflowCanvas />
    </div>

    <ConfigPanel />
  </div>
</template>
