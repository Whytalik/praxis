<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    @click="navigateToExperiment"
  >
    <h2 class="text-xl font-semibold mb-2">
      {{ experiment.name || "Untitled Experiment" }}
    </h2>
    <div class="space-y-2">
      <p class="text-gray-600">
        <span class="font-medium">Created:</span>
        {{ formatDate(experiment.createdAt) }}
      </p>
      <p v-if="experiment.duration" class="text-gray-600">
        <span class="font-medium">Duration:</span>
        {{ formatDuration(experiment.duration) }}
      </p>
      <p v-if="experiment.description" class="text-gray-600 line-clamp-2">
        {{ experiment.description }}
      </p>
      <div v-if="experiment.status" class="flex items-center mt-2">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="[statusStyles.background, statusStyles.text]"
        >
          <span class="mr-1.5">{{ statusStyles.icon }}</span>
          {{ statusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
import {
  formatDate,
  formatDuration,
  capitalizeFirstLetter,
} from "@/utils/formatters";
import { STATUS_STYLES } from "@/constants/experimentStyles";

const props = defineProps({
  experiment: {
    type: Object,
    required: true,
    validator: (value) => {
      console.log("Experiment data:", value);
      return true;
    },
  },
});

const router = useRouter();

const statusText = computed(() => {
  return capitalizeFirstLetter(props.experiment.status || "unknown");
});

const statusStyles = computed(() => {
  const status = props.experiment.status?.toLowerCase();
  return STATUS_STYLES[status] || STATUS_STYLES.default;
});

const navigateToExperiment = () => {
  router.push(`/experiments/${props.experiment.id}`);
};
</script>
