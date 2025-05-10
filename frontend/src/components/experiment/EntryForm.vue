<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
    <h3 class="text-lg font-medium text-gray-800 mb-5">New Entry</h3>

    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-3 text-gray-600">Processing your entry...</p>
    </div>

    <form
      v-else-if="metrics && metrics.length"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="metric in metrics"
          :key="metric.name"
          class="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <label
            :for="metric.name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            {{ metric.name }}
          </label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <input
              :id="metric.name"
              v-model="formData.values[metric.name]"
              type="number"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 pl-3 pr-12 py-2"
              placeholder="0"
              required
            />
            <div class="absolute inset-y-0 right-0 flex items-center">
              <span class="text-gray-500 sm:text-sm px-3"> Value </span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            for="conclusion"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Conclusion
          </label>
          <div class="mt-1">
            <textarea
              id="conclusion"
              v-model="formData.conclusion"
              rows="4"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
              placeholder="Enter your observations and conclusions about this entry..."
            ></textarea>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Summarize your findings or note any important observations.
          </p>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="button"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="loading"
        >
          Save Entry
        </button>
      </div>
    </form>

    <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
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
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  metrics: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = ref({
  values: {},
  conclusion: "",
});

const initializeFormData = () => {
  const values = {};
  if (props.metrics) {
    props.metrics.forEach((metric) => {
      values[metric.name] = "";
    });
  }
  formData.value = {
    values,
    conclusion: "",
  };
};

const handleSubmit = () => {
  emit("submit", { ...formData.value });
  initializeFormData();
};

watch(
  () => props.metrics,
  (newMetrics) => {
    if (newMetrics && newMetrics.length) {
      initializeFormData();
    }
  },
  { immediate: true }
);
</script>
