<template>
  <div class="mb-4 last:mb-0">
    <div class="flex justify-between mb-1">
      <span class="font-medium">{{ metric.name }}</span>
      <span>{{ metric.value }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="bg-blue-600 h-2.5 rounded-full"
        :style="{ width: `${metric.value}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metric: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.name && typeof value.value === "number";
    },
  },
});
</script>
