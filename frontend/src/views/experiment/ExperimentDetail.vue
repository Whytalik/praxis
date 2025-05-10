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
      <ExperimentHeader :title="experiment.name" @delete="deleteExperiment" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <ExperimentDescription :description="experiment.description" />
          <DailyEntry v-if="experiment.id" :experiment="experiment" />
        </div>

        <div class="space-y-6">
          <ExperimentStatus :status="experiment.status" />

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
import { useRoute } from "vue-router";
import { useExperimentDetail } from "@/composables/useExperimentDetail";
import ExperimentHeader from "@components/experiment/ExperimentHeader.vue";
import ExperimentDescription from "@components/experiment/ExperimentDescription.vue";
import ExperimentStatus from "@components/experiment/ExperimentStatus.vue";
import ExperimentTimeline from "@components/experiment/ExperimentTimeline.vue";
import ExperimentActions from "@components/experiment/ExperimentActions.vue";
import DailyEntry from "@components/experiment/DailyEntry.vue";

const route = useRoute();
const experimentId = route.params.id;
const { experiment, error, updateStatus, deleteExperiment, loadExperiment } =
  useExperimentDetail(experimentId);

onMounted(() => {
  loadExperiment();
});
</script>
