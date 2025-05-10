<template>
  <div
    v-if="!isAccepted"
    class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 z-50"
  >
    <div class="max-w-7xl mx-auto flex flex-col gap-4">
      <h3 class="m-0 text-gray-800 text-lg font-medium">Cookie Consent</h3>
      <p class="m-0 text-gray-600 text-sm">
        We use cookies to enhance your experience. By continuing to visit this
        site you agree to our use of cookies.
        <a
          href="/privacy-policy"
          target="_blank"
          class="text-blue-500 hover:underline"
          >Learn more</a
        >
      </p>
      <div class="flex gap-4">
        <button
          @click="acceptAll"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 font-medium"
        >
          Accept All
        </button>
        <button
          @click="acceptEssential"
          class="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors duration-200 font-medium"
        >
          Essential Only
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { setCookie, getCookie } from "@/utils/cookies";
import { usePreferences } from "@/composables/usePreferences";

const emit = defineEmits(["cookies-accepted"]);
const isAccepted = ref(false);
const { savePreferences, clearPreferences } = usePreferences();

const checkCookieConsent = () => {
  const cookieConsent = getCookie("cookieConsent");
  if (cookieConsent) {
    isAccepted.value = true;
    if (cookieConsent === "all") {
      savePreferences();
    }
  }
};

const acceptAll = () => {
  setCookie("cookieConsent", "all", 365);
  isAccepted.value = true;
  savePreferences();
  emit("cookies-accepted", "all");
};

const acceptEssential = () => {
  setCookie("cookieConsent", "essential", 365);
  isAccepted.value = true;
  clearPreferences();
  emit("cookies-accepted", "essential");
};

onMounted(() => {
  checkCookieConsent();
});
</script>
