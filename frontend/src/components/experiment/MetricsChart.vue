<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-800">Metrics Progress</h3>
      <div class="flex space-x-2">
        <button
          @click="showCharts = !showCharts"
          class="px-3 py-1 rounded-md text-sm mr-2"
          :class="
            showCharts
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          "
        >
          <svg
            v-if="showCharts"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          v-if="showCharts"
          v-for="type in chartTypes"
          :key="type.id"
          @click="activeChartType = type.id"
          class="px-3 py-1 rounded-md text-sm flex items-center"
          :class="
            activeChartType === type.id
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          "
        >
          <svg
            v-if="type.id === 'line'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-if="type.id === 'bar'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
            />
          </svg>
          {{ type.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-3 text-gray-600">Loading metrics data...</p>
    </div>

    <div v-else-if="!hasMetrics" class="text-center py-8 bg-gray-50 rounded-lg">
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p class="text-gray-600 font-medium">No metrics data available</p>
      <p class="text-gray-500 mt-1">Add entries to see metrics progress</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="(stat, metricName) in metricStats"
          :key="metricName"
          class="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <h4
            class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1"
          >
            {{ metricName }}
          </h4>
          <div class="flex justify-between items-end">
            <div>
              <div class="text-2xl font-semibold text-gray-900">
                {{ stat.current.toFixed(2) }}
              </div>
              <div class="text-sm text-gray-500">
                Avg: {{ stat.avg.toFixed(2) }} | Min:
                {{ stat.min.toFixed(2) }} | Max: {{ stat.max.toFixed(2) }}
              </div>
            </div>
            <div
              :class="{
                'text-green-500': stat.trend === 'improving',
                'text-red-500': stat.trend === 'declining',
                'text-gray-500': stat.trend === 'stable',
              }"
              class="flex items-center"
            >
              <svg
                v-if="stat.trend === 'improving'"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="stat.trend === 'declining'"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showCharts" class="border-t border-gray-200 pt-6">
        <div v-if="activeMetric" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-lg font-medium text-gray-800">
              {{ activeMetric }}
            </h4>
            <div class="flex space-x-2">
              <select
                v-model="activeMetric"
                class="rounded-md border-gray-300 text-sm"
              >
                <option
                  v-for="(stat, metricName) in metricStats"
                  :key="metricName"
                  :value="metricName"
                >
                  {{ metricName }}
                </option>
              </select>
            </div>
          </div>

          <div
            class="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden"
          >
            <div v-if="activeChartType === 'line'" class="h-64 w-full">
              <LineChart :chart-data="lineChartData" :options="chartOptions" />
            </div>
            <div v-else-if="activeChartType === 'bar'" class="h-64 w-full">
              <BarChart :chart-data="barChartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { LineChart, BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Chart configuration
const CHART_CONFIG = {
  line: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "rgba(59, 130, 246, 1)",
    tension: 0.4,
  },
  bar: {
    backgroundColor: "rgba(59, 130, 246, 0.6)",
  },
};

const props = defineProps({
  metricStats: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Chart types
const chartTypes = [
  { id: "line", label: "Line" },
  { id: "bar", label: "Bar" },
];

// UI state
const activeChartType = ref("line");
const activeMetric = ref(null);
const showCharts = ref(true);

// Check if we have metrics data
const hasMetrics = computed(() => {
  return Object.keys(props.metricStats).length > 0;
});

// Set active metric when metrics change
watch(
  () => props.metricStats,
  (newStats) => {
    if (Object.keys(newStats).length > 0 && !activeMetric.value) {
      activeMetric.value = Object.keys(newStats)[0];
    }
  },
  { immediate: true }
);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
};

// Get chart data for a specific metric
const getChartData = (metricName, type) => {
  const metric = props.metricStats[metricName];
  if (!metric) return { labels: [], datasets: [] };

  return {
    labels: metric.labels,
    datasets: [
      {
        label: metricName,
        ...CHART_CONFIG[type],
        data: metric.values,
      },
    ],
  };
};

// Memoized chart data
const lineChartData = computed(() =>
  activeMetric.value
    ? getChartData(activeMetric.value, "line")
    : { labels: [], datasets: [] }
);

const barChartData = computed(() =>
  activeMetric.value
    ? getChartData(activeMetric.value, "bar")
    : { labels: [], datasets: [] }
);
</script>
