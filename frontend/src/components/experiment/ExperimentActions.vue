<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Actions</h2>
    <div class="space-y-3">
      <button
        class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isStartDisabled"
        @click="$emit('update-status', 'in progress')"
      >
        Start Experiment
      </button>
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isCompleteDisabled"
        @click="$emit('update-status', 'completed')"
      >
        Complete Experiment
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ["in progress", "completed", "pending"].includes(value),
  },
});

defineEmits(["update-status"]);

const isStartDisabled = computed(() => {
  return props.status === 'in progress' || props.status === 'completed';
});

const isCompleteDisabled = computed(() => {
  return props.status !== 'in progress';
});
</script>
