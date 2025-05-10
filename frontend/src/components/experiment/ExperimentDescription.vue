<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Description</h2>
    <p v-if="description" class="text-gray-600">
      {{ description }}
    </p>
    <p v-else class="text-gray-500 italic">No description available</p>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: "",
  },
});
</script>
