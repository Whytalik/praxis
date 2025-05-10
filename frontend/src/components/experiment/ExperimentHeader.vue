<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">
      {{ title || "Untitled Experiment" }}
    </h1>
    <div class="flex gap-4">
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        @click="$emit('delete')"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});

defineEmits(["delete"]);
</script>
