<template>
  <div class="space-y-4">
    <!-- Trigger Name -->
    <div>
      <label class="block text-sm font-medium mb-1"> Trigger Name </label>

      <input
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start Workflow"
        v-model="localValue.name"
        @input="emitChange"
      />

      <!-- Field error from ConfigPanel -->
      <p v-if="errors?.name" class="text-xs text-red-500 mt-1">
        {{ errors.name }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium mb-1"> Description </label>

      <textarea
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Optional description"
        rows="3"
        v-model="localValue.description"
        @input="emitChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps<{
  modelValue: {
    name?: string;
    description?: string;
  };
  errors?: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

/* local copy (safe for empty config) */
const localValue = reactive({
  name: props.modelValue?.name ?? "",
  description: props.modelValue?.description ?? "",
});

/* sync external → local */
watch(
  () => props.modelValue,
  (val) => {
    localValue.name = val?.name ?? "";
    localValue.description = val?.description ?? "";
  },
  { deep: true },
);

/* emit only value changes */
function emitChange() {
  emit("update:modelValue", { ...localValue });
}
</script>
