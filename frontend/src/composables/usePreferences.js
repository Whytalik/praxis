import { ref, watch } from "vue";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookies";

const COOKIE_EXPIRY = 365; // days

export const usePreferences = () => {
  const chartPreferences = ref({
    activeChartType: "line",
    showCharts: true,
    lastSelectedMetric: null,
  });

  const language = ref("en");
  const theme = ref("light");
  const lastExperiment = ref("");

  const loadPreferences = () => {
    const savedChartPrefs = getCookie("chart_preferences");
    if (savedChartPrefs) {
      chartPreferences.value = JSON.parse(savedChartPrefs);
    }

    const savedLanguage = getCookie("language");
    if (savedLanguage) {
      language.value = savedLanguage;
    }

    const savedTheme = getCookie("theme");
    if (savedTheme) {
      theme.value = savedTheme;
    }

    const savedExperiment = getCookie("last_experiment");
    if (savedExperiment) {
      lastExperiment.value = savedExperiment;
    }
  };

  const savePreferences = () => {
    setCookie(
      "chart_preferences",
      JSON.stringify(chartPreferences.value),
      COOKIE_EXPIRY
    );
    setCookie("language", language.value, COOKIE_EXPIRY);
    setCookie("theme", theme.value, COOKIE_EXPIRY);
    setCookie("last_experiment", lastExperiment.value, COOKIE_EXPIRY);
  };

  const clearPreferences = () => {
    deleteCookie("chart_preferences");
    deleteCookie("language");
    deleteCookie("theme");
    deleteCookie("last_experiment");
  };

  watch(
    [chartPreferences, language, theme, lastExperiment],
    () => {
      savePreferences();
    },
    { deep: true }
  );

  return {
    chartPreferences,
    language,
    theme,
    lastExperiment,
    loadPreferences,
    savePreferences,
    clearPreferences,
  };
};
