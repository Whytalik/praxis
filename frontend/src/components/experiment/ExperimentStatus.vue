<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-4">Status</h2>
    <div class="flex items-center">
      <StatusBadge :status="status" />
    </div>
  </div>
</template>

<script setup>
import StatusBadge from "@components/common/StatusBadge.vue";

defineProps({
  status: {
    type: String,
    required: true,
  },
});
</script>
