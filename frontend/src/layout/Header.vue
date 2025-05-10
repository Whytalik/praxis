<template>
  <header class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-xl font-semibold text-gray-900">
            Praxis
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.href"
            :to="item.href"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            :class="{ 'text-blue-600': isCurrentRoute(item.href) }"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const navigationItems = [
  { name: "Dashboard", href: "/" },
  { name: "Experiments", href: "/experiments" },
];

const isCurrentRoute = (href) => {
  return route.path === href;
};
</script>
