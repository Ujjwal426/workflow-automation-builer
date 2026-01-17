<template>
  <div class="w-80 border-l p-4 bg-white h-full">
    <h3 class="font-semibold mb-4">Configuration</h3>

    <p v-if="!selectedNode" class="text-gray-400 text-sm">
      Select a node to configure
    </p>

    <div v-else>
      <p class="text-sm mb-3">
        <b>Type:</b> {{ selectedNode?.type?.split(".")[1] }}
      </p>

      <component
        v-if="nodeDef?.configForm"
        :is="nodeDef.configForm"
        v-model="selectedNode.data.config"
        :errors="fieldErrors"
      />

      <button
        class="mt-4 w-full p-2 rounded text-white bg-blue-600"
        @click="save"
      >
        Save
      </button>

      <p
        v-if="successMessage"
        class="mt-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700 text-center font-medium shadow-sm"
      >
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWorkflowStore } from "../../store/workflow.store";
import { nodeRegistry } from "../../nodes";

const store = useWorkflowStore();
const { selectedNode } = storeToRefs(store);

const hasSubmitted = ref<boolean>(false);
const fieldErrors = ref<Record<string, string>>({});
const successMessage = ref<string>("");

const nodeDef = computed(() =>
  selectedNode.value ? nodeRegistry[selectedNode.value.type] : null,
);

const schema = computed(() => nodeDef.value?.schema ?? null);

watch(selectedNode, () => {
  fieldErrors.value = {};
  hasSubmitted.value = false;
});

function save() {
  hasSubmitted.value = true;
  fieldErrors.value = {};

  if (!schema.value || !selectedNode.value) return;

  const result = schema.value.safeParse(selectedNode.value.data.config);

  if (!result.success) {
    JSON.parse(result?.error?.message).forEach((err: any) => {
      const key = err.path[0];
      console.log("key", key);
      fieldErrors.value[key] = err.message;
    });

    console.log("fieldErrors", fieldErrors.value);

    return;
  }

  fieldErrors.value = {};

  const config = selectedNode.value.data.config;

  if (config && typeof config.name === "string") {
    selectedNode.value.data.label = config.name;
  }

  store.snapshot();

  successMessage.value = "Configuration saved successfully";

  setTimeout(() => {
    successMessage.value = "";
  }, 2000);
}
</script>
