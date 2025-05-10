<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Timeline</h2>
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm font-medium">Created</span>
        <span class="text-sm text-gray-500">{{ formatDate(createdAt) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm font-medium">Last Updated</span>
        <span class="text-sm text-gray-500">{{ formatDate(updatedAt) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm font-medium">Duration</span>
        <span class="text-sm text-gray-500">{{
          formatDuration(duration)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatDuration } from "@utils/formatters";

defineProps({
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});
</script>
