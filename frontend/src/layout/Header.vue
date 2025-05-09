<template>
  <header class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="/" class="text-xl font-semibold text-gray-900"> Praxis </a>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <a
            v-for="item in navigationItems"
            :key="item.href"
            :href="item.href"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <button
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Sign In
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            type="button"
            class="text-gray-600 hover:text-gray-900"
            aria-expanded="false"
          >
            <span class="sr-only">Open menu</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const navigationItems = [
  { name: "Dashboard", href: "/" },
  { name: "Experiments", href: "/experiments" },
];
</script>
