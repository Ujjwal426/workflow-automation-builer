<template>
  <div class="space-y-4">
    <!-- Request Name -->
    <div>
      <label class="block text-sm font-medium mb-1"> Action Name </label>

      <input
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Call CRM API"
        v-model="localValue.name"
        @input="emitChange"
      />

      <p v-if="errors?.name" class="text-xs text-red-500 mt-1">
        {{ errors?.name }}
      </p>
    </div>

    <!-- URL -->
    <div>
      <label class="block text-sm font-medium mb-1"> Request URL </label>

      <input
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="https://api.example.com/users"
        v-model="localValue.url"
        @input="emitChange"
      />

      <p v-if="errors?.url" class="text-xs text-red-500 mt-1">
        {{ errors?.url }}
      </p>
    </div>

    <!-- Method -->
    <div>
      <label class="block text-sm font-medium mb-1"> Method </label>

      <select
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="localValue.method"
        @change="emitChange"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
      </select>
    </div>

    <!-- Body -->
    <div v-if="localValue.method !== 'GET'">
      <label class="block text-sm font-medium mb-1"> Request Body </label>

      <textarea
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder='{"email":"test@example.com"}'
        rows="4"
        v-model="localValue.body"
        @input="emitChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

/**
 * Props
 */
const props = defineProps<{
  modelValue: {
    name: string;
    url: string;
    method: string;
    body?: string;
  };
  errors?: Record<string, string>;
}>();

/**
 * Emits
 */
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

/**
 * Local copy
 */
const localValue = reactive({
  name: props.modelValue.name || "",
  url: props.modelValue.url || "",
  method: props.modelValue.method || "GET",
  body: props.modelValue.body || "",
});

watch(
  () => props.modelValue,
  (val) => {
    localValue.name = val.name || "";
    localValue.url = val.url || "";
    localValue.method = val.method || "GET";
    localValue.body = val.body || "";
  },
  { deep: true },
);

/**
 * Emit + validate
 */
function emitChange() {
  emit("update:modelValue", { ...localValue });
}
</script>
