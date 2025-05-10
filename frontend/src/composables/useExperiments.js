import { computed } from "vue";
import { useExperimentsStore } from "@stores/experiments";
import { storeToRefs } from "pinia";
import axios from "@/utils/axios";

export function useExperiments() {
  const store = useExperimentsStore();
  const { experiments, error } = storeToRefs(store);

  const inProgressExperiments = computed(() => {
    return experiments.value.filter((exp) => exp.status === "in progress");
  });

  const experimentsWithEntries = computed(() => {
    return inProgressExperiments.value.filter((exp) => exp.hasEntries);
  });

  const experimentsWithoutEntries = computed(() => {
    return inProgressExperiments.value.filter((exp) => !exp.hasEntries);
  });

  const fetchExperimentsWithEntries = async () => {
    try {
      await store.fetchExperiments();
      for (const experiment of inProgressExperiments.value) {
        try {
          const response = await axios.get(
            `/experiments/${experiment.id}/entries`
          );
          experiment.hasEntries = response.data.length > 0;
        } catch (entryError) {
          console.error(
            `Failed to fetch entries for experiment ${experiment.id}:`,
            entryError
          );
          experiment.hasEntries = false;
        }
      }
    } catch (error) {
      console.error("Failed to fetch experiments:", error);
      throw error;
    }
  };

  return {
    experiments,
    error,
    inProgressExperiments,
    experimentsWithEntries,
    experimentsWithoutEntries,
    fetchExperimentsWithEntries,
  };
}
