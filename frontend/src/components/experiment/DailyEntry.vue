<template>
  <div>
    <!-- Metrics Chart Section -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">Metrics Progress</h3>
          <div class="text-sm text-gray-500">
            <span class="font-medium">Last Updated:</span>
            {{ lastUpdatedText }}
          </div>
        </div>
        <MetricsChart :metric-stats="metricStats" :loading="loading" />
      </div>
    </div>

    <!-- Entry Form and Table Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h2 class="text-xl font-semibold text-gray-800">Experiment Entries</h2>
        <button
          @click="showEntryForm = !showEntryForm"
          class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span v-if="!showEntryForm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          {{ showEntryForm ? "Cancel" : "Add New Entry" }}
        </button>
      </div>

      <!-- Entry Form -->
      <div v-if="showEntryForm" class="mb-8">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                Add a new entry to track the progress of your experiment.
              </p>
            </div>
          </div>
        </div>

        <EntryForm
          v-if="experimentMetrics.length > 0"
          :metrics="experimentMetrics"
          :loading="formLoading"
          @submit="handleFormSubmit"
          @cancel="showEntryForm = false"
        />

        <div
          v-else
          class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-gray-600 font-medium">No metrics available</p>
          <p class="text-gray-500 mt-1">
            Please add metrics to the experiment first.
          </p>
        </div>
      </div>

      <!-- Entries Table -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 mb-4">Entry History</h3>
        <EntriesTable
          :entries="entries"
          :metrics="experimentMetrics"
          :loading="loading"
          :error="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import EntryForm from "@components/experiment/EntryForm.vue";
import EntriesTable from "@components/experiment/EntriesTable.vue";
import MetricsChart from "@components/experiment/MetricsChart.vue";
import { useEntries } from "@/composables/useEntries";
import { useMetricsCalculation } from "@/composables/useMetricsCalculation";

const props = defineProps({
  experiment: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === "object" && "id" in value;
    },
  },
});

const showEntryForm = ref(false);
const formLoading = ref(false);
const lastUpdated = ref(null);
const error = ref(null);

const experimentMetrics = computed(() => {
  return props.experiment?.metrics || [];
});

const experimentId = computed(() => props.experiment?.id || null);

const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return "Never";
  return new Date(lastUpdated.value).toLocaleString();
});

const {
  entries,
  loading,
  error: entriesError,
  fetchEntries,
  createEntry,
} = useEntries(experimentId);
const { metricStats } = useMetricsCalculation(entries, experimentMetrics);

const updateLastUpdated = () => {
  try {
    if (entries.value?.length > 0) {
      const sortedEntries = [...entries.value].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      lastUpdated.value = sortedEntries[0].date;
    } else if (props.experiment?.updatedAt) {
      lastUpdated.value = props.experiment.updatedAt;
    }
  } catch (err) {
    console.error("Error updating last updated timestamp:", err);
    error.value = "Failed to update timestamp";
  }
};

watch(
  [entries, () => props.experiment],
  () => {
    updateLastUpdated();
  },
  { immediate: true, deep: true }
);

const handleFormSubmit = async (formData) => {
  if (!experimentId.value) {
    error.value = "Invalid experiment ID";
    return;
  }

  try {
    formLoading.value = true;
    error.value = null;

    const success = await createEntry(formData.values, formData.conclusion);
    if (success) {
      showEntryForm.value = false;
      lastUpdated.value = new Date().toISOString();
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    error.value = "Failed to submit entry";
  } finally {
    formLoading.value = false;
  }
};

onMounted(async () => {
  if (experimentId.value) {
    try {
      await fetchEntries();
    } catch (err) {
      console.error("Error fetching entries:", err);
      error.value = "Failed to load entries";
    }
  }
});
</script>
