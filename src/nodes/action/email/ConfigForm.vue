<template>
  <div class="space-y-4">
    <!-- Action Name -->
    <div>
      <label class="block text-sm font-medium mb-1"> Action Name </label>

      <input
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Send Welcome Email"
        v-model="localValue.name"
        @input="emitChange"
      />

      <p v-if="errors?.name" class="text-xs text-red-500 mt-1">
        {{ errors.name }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label class="block text-sm font-medium mb-1"> Email Message </label>

      <textarea
        class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Hello {{user.name}}, welcome!"
        rows="5"
        v-model="localValue.message"
        @input="emitChange"
      />

      <p v-if="errors?.message" class="text-xs text-red-500 mt-1">
        {{ errors.message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps<{
  modelValue: {
    name: string;
    message: string;
  };
  errors?: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const localValue = reactive({
  name: props.modelValue.name || "",
  message: props.modelValue.message || "",
});

watch(
  () => props.modelValue,
  (val) => {
    localValue.name = val.name || "";
    localValue.message = val.message || "";
  },
  { deep: true },
);

function emitChange() {
  emit("update:modelValue", { ...localValue });
}
</script>
