<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Actions</h2>
    <div class="space-y-3">
      <button
        class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        :disabled="status === 'active'"
        @click="$emit('update-status', 'active')"
      >
        Start Experiment
      </button>
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        :disabled="status === 'completed'"
        @click="$emit('update-status', 'completed')"
      >
        Complete Experiment
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
});

defineEmits(["update-status"]);
</script>
