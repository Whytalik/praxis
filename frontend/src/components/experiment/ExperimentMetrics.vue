<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Metrics</h2>
    <div v-if="metrics && metrics.length">
      <MetricProgress
        v-for="(metric, index) in metrics"
        :key="index"
        :metric="metric"
      />
    </div>
    <p v-else class="text-gray-500 italic">No metrics available</p>
  </div>
</template>

<script setup>
import MetricProgress from "@components/common/MetricProgress.vue";

defineProps({
  metrics: {
    type: Array,
    default: () => [],
  },
});
</script>
