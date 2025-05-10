<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">
      Active Experiments
    </h1>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ error }}
    </div>

    <div v-if="!experiments.length" class="text-center py-8 text-gray-500">
      No active experiments
    </div>

    <div v-else class="space-y-8">
      <ExperimentsList
        v-if="experimentsWithEntries.length"
        title="Experiments with Entries"
      >
        <ExperimentCard
          v-for="experiment in experimentsWithEntries"
          :key="experiment.id"
          :experiment="experiment"
        />
      </ExperimentsList>

      <ExperimentsList
        v-if="experimentsWithoutEntries.length"
        title="Experiments without Entries"
      >
        <ExperimentCard
          v-for="experiment in experimentsWithoutEntries"
          :key="experiment.id"
          :experiment="experiment"
        />
      </ExperimentsList>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ExperimentCard from "@components/experiment/ExperimentCard.vue";
import ExperimentsList from "@components/experiment/ExperimentsList.vue";
import { useExperiments } from "@/composables/useExperiments";

const {
  experiments,
  error,
  experimentsWithEntries,
  experimentsWithoutEntries,
  fetchExperimentsWithEntries,
} = useExperiments();

onMounted(async () => {
  try {
    await fetchExperimentsWithEntries();
  } catch (error) {
    console.error("Failed to fetch experiments:", error);
  }
});
</script>
