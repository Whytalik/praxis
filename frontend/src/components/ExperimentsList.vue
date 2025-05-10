<template>
  <div class="container mx-auto px-4 py-8">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <h1 class="text-2xl font-bold">Experiments</h1>
      <router-link
        to="/experiments/new"
        class="hidden sm:inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        New Experiment
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <div v-else-if="!experiments.length" class="text-center py-8 text-gray-500">
      No experiments available
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExperimentCard
        v-for="experiment in experiments"
        :key="experiment.id"
        :experiment="experiment"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExperimentsStore } from "@/stores/experiments";
import { storeToRefs } from "pinia";
import ExperimentCard from "./ExperimentCard.vue";

const router = useRouter();
const store = useExperimentsStore();
const { experiments, loading, error } = storeToRefs(store);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const navigateToExperiment = (id) => {
  router.push(`/experiments/${id}`);
};

onMounted(() => {
  store.fetchExperiments();
});
</script>
