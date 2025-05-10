<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Experiment Metrics</h2>
    <div
      v-if="metrics && metrics.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="(metric, index) in metrics"
        :key="index"
        class="bg-gray-50 rounded-lg border border-gray-200 p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-md font-medium">{{ metric.name }}</h3>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="getMetricTypeClass(metric.type)"
          >
            {{ metric.type }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-2">
          {{ metric.description || "No description" }}
        </p>
        <div class="flex items-center text-sm text-gray-500">
          <span class="mr-2">Target:</span>
          <span class="font-medium text-gray-700">{{
            metric.target || "Not set"
          }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-500 mt-1">
          <span class="mr-2">Units:</span>
          <span class="font-medium text-gray-700">{{
            metric.units || "Not specified"
          }}</span>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500 italic py-4">
      No metrics available for this experiment
    </p>
  </div>
</template>

<script setup>
defineProps({
  metrics: {
    type: Array,
    default: () => [],
  },
});

function getMetricTypeClass(type) {
  switch (type?.toLowerCase()) {
    case "number":
      return "bg-blue-100 text-blue-700";
    case "percentage":
      return "bg-green-100 text-green-700";
    case "boolean":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
</script>
