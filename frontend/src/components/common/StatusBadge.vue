<template>
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
    :class="[statusStyles.background, statusStyles.text]"
  >
    <span class="mr-1.5">{{ statusStyles.icon }}</span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { capitalizeFirstLetter } from "@utils/formatters";
import { STATUS_STYLES } from "@/constants/experimentStyles";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const statusText = computed(() => {
  return capitalizeFirstLetter(props.status || "unknown");
});

const statusStyles = computed(() => {
  const status = props.status?.toLowerCase();
  return STATUS_STYLES[status] || STATUS_STYLES.default;
});
</script>
