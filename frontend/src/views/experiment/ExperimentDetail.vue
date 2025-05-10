<template>
  <div class="container mx-auto px-4 py-8">
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <div v-else-if="!experiment" class="text-center py-8 text-gray-500">
      Experiment not found
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          {{ experiment.name || "Untitled Experiment" }}
        </h1>
        <div class="flex gap-2">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Description</h2>
            <p v-if="experiment.description" class="text-gray-600">
              {{ experiment.description }}
            </p>
            <p v-else class="text-gray-500 italic">No description available</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Metrics</h2>
            <div v-if="experiment.metrics && experiment.metrics.length">
              <div
                v-for="(metric, index) in experiment.metrics"
                :key="index"
                class="mb-4 last:mb-0"
              >
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
            </div>
            <p v-else class="text-gray-500 italic">No metrics available</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Status</h2>
            <div class="flex items-center">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="[statusStyles.background, statusStyles.text]"
              >
                <span class="mr-1.5">{{ statusStyles.icon }}</span>
                {{ statusText }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Timeline</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm font-medium">Created</span>
                <span class="text-sm text-gray-500">{{
                  formatDate(experiment.createdAt)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium">Last Updated</span>
                <span class="text-sm text-gray-500">{{
                  formatDate(experiment.updatedAt)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium">Duration</span>
                <span class="text-sm text-gray-500">{{
                  formatDuration(experiment.duration)
                }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Actions</h2>
            <div class="space-y-3">
              <button
                class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                :disabled="experiment.status === 'active'"
                @click="updateStatus('active')"
              >
                Start Experiment
              </button>
              <button
                class="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                :disabled="experiment.status === 'paused'"
                @click="updateStatus('paused')"
              >
                Pause Experiment
              </button>
              <button
                class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                :disabled="experiment.status === 'completed'"
                @click="updateStatus('completed')"
              >
                Complete Experiment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useExperimentsStore } from "@stores/experiments";
import { storeToRefs } from "pinia";
import {
  formatDate,
  formatDuration,
  capitalizeFirstLetter,
} from "@utils/formatters";
import { STATUS_STYLES } from "@/constants/experimentStyles";

const route = useRoute();
const store = useExperimentsStore();
const { experiments, error } = storeToRefs(store);

const experimentId = route.params.id;
const experiment = computed(() =>
  experiments.value.find((exp) => exp.id === experimentId)
);

const statusText = computed(() => {
  return capitalizeFirstLetter(experiment.value?.status || "unknown");
});

const statusStyles = computed(() => {
  const status = experiment.value?.status?.toLowerCase();
  return STATUS_STYLES[status] || STATUS_STYLES.default;
});

const updateStatus = async (newStatus) => {
  try {
    await store.updateExperimentStatus(experimentId, newStatus);
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};

onMounted(async () => {
  try {
    await store.fetchExperiments();
    if (!experiment.value) {
      await store.fetchExperiment(experimentId);
    }
  } catch (error) {
    console.error("Failed to fetch experiment:", error);
  }
});
</script>
