<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <router-link
        to="/"
        class="inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      <div class="prose prose-blue max-w-none">
        <div
          v-html="formattedPolicy"
          class="[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-gray-800 [&>h2]:mb-4 [&>h2]:mt-8 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-gray-700 [&>h3]:mb-3 [&>h3]:mt-6 [&>p]:text-gray-600 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-4 [&>ul]:text-gray-600 [&>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-gray-800"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { marked } from "marked";

const privacyPolicy = ref("");

const formattedPolicy = computed(() => {
  if (!privacyPolicy.value) return "";
  return marked(privacyPolicy.value);
});

onMounted(async () => {
  try {
    const response = await axios.get("/PRIVACY_POLICY.md");
    privacyPolicy.value = response.data;
  } catch (error) {
    console.error("Error loading privacy policy:", error);
    privacyPolicy.value = "Privacy policy not available at the moment.";
  }
});
</script>
