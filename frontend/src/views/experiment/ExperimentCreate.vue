<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Create New Experiment</h1>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="saveExperiment">
        <div class="mb-6">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            v-model="experiment.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minlength="3"
            maxlength="100"
          />
        </div>

        <div class="mb-6">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            v-model="experiment.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Metrics
            </label>
            <button
              type="button"
              @click="addMetric"
              class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
            >
              Add Metric
            </button>
          </div>

          <div
            v-if="!experiment.metrics.length"
            class="text-sm text-gray-500 italic"
          >
            No metrics added yet. Please add at least one metric.
          </div>

          <div
            v-for="(metric, index) in experiment.metrics"
            :key="index"
            class="bg-gray-50 p-4 rounded-md mb-4"
          >
            <div class="flex justify-between mb-2">
              <h3 class="font-medium">Metric #{{ index + 1 }}</h3>
              <button
                type="button"
                @click="removeMetric(index)"
                class="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  :for="`metric-name-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  :id="`metric-name-${index}`"
                  v-model="metric.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  :for="`metric-type-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type
                </label>
                <select
                  :id="`metric-type-${index}`"
                  v-model="metric.typeId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a type</option>
                  <option
                    v-for="type in metricTypes"
                    :key="type._id"
                    :value="type._id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link
            to="/experiments"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            :disabled="!isFormValid"
          >
            Create Experiment
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExperimentsStore } from "@stores/experiments";
import axios from "@utils/axios";

const router = useRouter();
const store = useExperimentsStore();

const metricTypes = ref([]);
const experiment = ref({
  title: "",
  description: "",
  metrics: [],
});

const fetchMetricTypes = async () => {
  try {
    const response = await axios.get("/api/metric-types");
    metricTypes.value = response.data;
  } catch (error) {
    console.error("Failed to fetch metric types:", error);
  }
};

const addMetric = () => {
  experiment.value.metrics.push({
    name: "",
    typeId: "",
  });
};

const removeMetric = (index) => {
  experiment.value.metrics.splice(index, 1);
};

const isFormValid = computed(() => {
  return (
    experiment.value.title.length >= 3 &&
    experiment.value.metrics.length > 0 &&
    experiment.value.metrics.every((metric) => metric.name && metric.typeId)
  );
});

const saveExperiment = async () => {
  try {
    await store.createExperiment(experiment.value);
    router.push("/experiments");
  } catch (error) {
    console.error("Failed to create experiment:", error);
  }
};

onMounted(() => {
  fetchMetricTypes();
});
</script>
