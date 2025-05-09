<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Main Content Area -->
      <section class="bg-white rounded-lg shadow-sm p-6">
        <slot></slot>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "./layout/Header.vue";
import Footer from "./layout/Footer.vue";
</script>
