<script setup lang="ts">
/**
 * Vue utilities
 * - reactive: local mutable form state
 * - watch: sync local state with parent model
 */
import { reactive, watch } from "vue";

/**
 * Component props
 * - modelValue: current node configuration
 * - errors: field-level validation errors
 */
const props = defineProps<{
  modelValue: {
    name: string;
    duration: number;
  };
  errors?: Record<string, string>;
}>();

/**
 * Emit update for v-model binding
 */
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

/**
 * Local copy of config values
 * - Prevents directly mutating props
 * - Enables controlled form updates
 */
const localValue = reactive({
  name: props.modelValue.name || "",
  duration: props.modelValue.duration || 1,
});

/**
 * Keep local state in sync when parent model changes
 */
watch(
  () => props.modelValue,
  (val) => {
    localValue.name = val.name || "";
    localValue.duration = val.duration || 1;
  },
  { deep: true },
);

/**
 * Emit updated configuration to parent
 */
function emitChange() {
  emit("update:modelValue", { ...localValue });
}
</script>

<template>
  <div class="space-y-4">
    <!-- Action Name field -->
    <div>
      <label class="block text-sm font-medium mb-1"> Action Name </label>

      <!-- Node display name input -->
      <input
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Wait before next step"
        v-model="localValue.name"
        @input="emitChange"
      />

      <!-- Validation error for name -->
      <p v-if="errors?.name" class="text-xs text-red-500 mt-1">
        {{ errors.name }}
      </p>
    </div>

    <!-- Delay duration field -->
    <div>
      <label class="block text-sm font-medium mb-1"> Delay (seconds) </label>

      <!-- Duration input (minimum 1 second) -->
      <input
        type="number"
        min="1"
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        v-model.number="localValue.duration"
        @input="emitChange"
      />

      <!-- Validation error for duration -->
      <p v-if="errors?.duration" class="text-xs text-red-500 mt-1">
        {{ errors.duration }}
      </p>
    </div>
  </div>
</template>
