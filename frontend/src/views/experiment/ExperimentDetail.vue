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
        <div class="flex gap-4">
          <button
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            @click="deleteExperiment"
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

          <ExperimentMetrics :metrics="experiment.metrics" />
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold mb-4">Status</h2>
            <div class="flex items-center">
              <StatusBadge :status="experiment.status" />
            </div>
          </div>

          <ExperimentTimeline
            :created-at="experiment.createdAt"
            :updated-at="experiment.updatedAt"
            :duration="experiment.duration"
          />

          <ExperimentActions
            :status="experiment.status"
            @update-status="updateStatus"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useExperimentsStore } from "@stores/experiments";
import { storeToRefs } from "pinia";
import StatusBadge from "@components/common/StatusBadge.vue";
import ExperimentMetrics from "@components/experiment/ExperimentMetrics.vue";
import ExperimentTimeline from "@components/experiment/ExperimentTimeline.vue";
import ExperimentActions from "@components/experiment/ExperimentActions.vue";

const route = useRoute();
const router = useRouter();
const store = useExperimentsStore();
const { experiments, error } = storeToRefs(store);

const experimentId = route.params.id;
const experiment = computed(() =>
  experiments.value.find((exp) => exp.id === experimentId)
);

const startExperiment = async () => {
  try {
    await store.updateExperimentStatus(experimentId, "in progress");
  } catch (error) {
    console.error("Failed to start experiment:", error);
  }
};

const completeExperiment = async () => {
  try {
    await store.updateExperimentStatus(experimentId, "completed");
  } catch (error) {
    console.error("Failed to complete experiment:", error);
  }
};

const updateStatus = async (newStatus) => {
  try {
    await store.updateExperimentStatus(experimentId, newStatus);
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};

const deleteExperiment = async () => {
  if (!confirm("Are you sure you want to delete this experiment?")) {
    return;
  }

  try {
    await store.deleteExperiment(experimentId);
    router.push("/experiments");
  } catch (error) {
    console.error("Failed to delete experiment:", error);
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
