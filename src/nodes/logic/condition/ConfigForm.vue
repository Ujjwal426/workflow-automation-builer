<template>
  <div class="space-y-4">
    <!-- Field -->
    <div>
      <label class="block text-sm font-medium mb-1"> Response Field </label>
      <select
        class="border p-2 w-full rounded"
        v-model="localValue.field"
        @change="emitChange"
      >
        <option value="status">Response Status</option>
      </select>

      <!-- Field error from ConfigPanel -->
      <p v-if="errors?.field" class="text-xs text-red-500 mt-1">
        {{ errors?.field }}
      </p>
    </div>

    <!-- Operator -->
    <div>
      <label class="block text-sm font-medium mb-1"> Operator </label>
      <select
        class="border p-2 w-full rounded"
        v-model="localValue.operator"
        @change="emitChange"
      >
        <option value="eq">Equals</option>
        <option value="neq">Not Equals</option>
      </select>
      <!-- Field error from ConfigPanel -->
      <p v-if="errors?.operator" class="text-xs text-red-500 mt-1">
        {{ errors.operator }}
      </p>
    </div>

    <!-- Value -->
    <div>
      <label class="block text-sm font-medium mb-1"> Value </label>
      <input
        type="number"
        class="border p-2 w-full rounded"
        v-model.number="localValue.value"
        @input="emitChange"
      />
      <!-- Field error from ConfigPanel -->
      <p v-if="errors?.value" class="text-xs text-red-500 mt-1">
        {{ errors.value }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from "vue";
import { conditionSchema } from "./schema";

const props = defineProps<{
  modelValue: {
    field: "status" | "ok";
    operator: "eq" | "neq";
    value: number;
  };
  errors?: Record<string, string>;
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = reactive({
  field: props.modelValue.field ?? "status",
  operator: props.modelValue.operator ?? "eq",
  value: props.modelValue.value ?? 200,
});

watch(
  () => props.modelValue,
  (v) => Object.assign(localValue, v),
  { deep: true },
);

function emitChange() {
  // optional inline validation
  conditionSchema.safeParse(localValue);
  emit("update:modelValue", { ...localValue });
}
</script>
