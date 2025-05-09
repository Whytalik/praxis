<template>
  <footer class="bg-white border-t border-gray-100 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Praxis</h3>
        <p class="text-sm text-gray-600 mb-2">
          Optimize your habits through personal experiments and data-driven insights.
        </p>
        <p class="text-sm text-gray-500">
          &copy; {{ currentYear }} Praxis. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>
