<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
  >
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading entries...</p>
    </div>

    <div v-else-if="error" class="p-6 bg-red-50 border-l-4 border-red-500">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Error loading entries
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!entries.length" class="text-center py-12 bg-gray-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p class="text-gray-600 font-medium text-lg">No entries available</p>
      <p class="text-gray-500 mt-2">
        Create your first entry to start tracking your experiment
      </p>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <template v-if="metrics && metrics.length">
                <th
                  v-for="metric in metrics"
                  :key="metric.name"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ metric.name }}
                </th>
              </template>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Conclusion
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(entry, index) in entries"
              :key="entry._id"
              :class="{ 'bg-blue-50': index % 2 === 0 }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(entry.date) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(entry.date) }}
                </div>
              </td>
              <template v-if="metrics && metrics.length">
                <td
                  v-for="metric in metrics"
                  :key="`${entry._id}-${metric.name}`"
                  class="px-6 py-4 whitespace-nowrap"
                >
                  <div class="text-sm text-gray-900 font-medium">
                    {{ getEntryValue(entry, metric.name) }}
                  </div>
                </td>
              </template>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-md">
                  {{ entry.conclusion || "-" }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-500">
          Showing {{ entries.length }}
          {{ entries.length === 1 ? "entry" : "entries" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  entries: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.every(
          (entry) => entry && typeof entry === "object" && "date" in entry
        )
      );
    },
  },
  metrics: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.every(
          (metric) => metric && typeof metric === "object" && "name" in metric
        )
      );
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const tableHeaders = computed(() => {
  const headers = ["Date"];
  if (props.metrics?.length) {
    headers.push(...props.metrics.map((metric) => metric.name));
  }
  headers.push("Conclusion");
  return headers;
});

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Invalid Date";
  }
}

function formatTime(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    console.error("Error formatting time:", err);
    return "Invalid Time";
  }
}

function getEntryValue(entry, metricName) {
  try {
    const value = entry.values?.[metricName];
    return value !== undefined ? value : "-";
  } catch (err) {
    console.error(`Error getting value for metric ${metricName}:`, err);
    return "-";
  }
}

const entryCountText = computed(() => {
  const count = props.entries.length;
  return `Showing ${count} ${count === 1 ? "entry" : "entries"}`;
});
</script>
