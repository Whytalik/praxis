import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useExperimentsStore } from "@/stores/experiments";
import { storeToRefs } from "pinia";

export function useExperimentDetail(experimentId) {
  const router = useRouter();
  const store = useExperimentsStore();
  const { experiments, error } = storeToRefs(store);
  const loading = ref(false);

  const experiment = computed(() => {
    if (!experiments.value || !experimentId) return null;
    return experiments.value.find((exp) => exp.id === experimentId) || null;
  });

  const startExperiment = async () => {
    if (!experimentId) return;

    try {
      await store.updateExperimentStatus(experimentId, "in progress");
    } catch (error) {
      console.error("Failed to start experiment:", error);
    }
  };

  const completeExperiment = async () => {
    if (!experimentId) return;

    try {
      await store.updateExperimentStatus(experimentId, "completed");
    } catch (error) {
      console.error("Failed to complete experiment:", error);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!experimentId) return;

    try {
      await store.updateExperimentStatus(experimentId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteExperiment = async () => {
    if (!experimentId) return;

    if (!confirm("Are you sure you want to delete this experiment?")) {
      return;
    }

    try {
      await store.deleteExperiment(experimentId);
      router.push("/experiments");
    } catch (error) {
      console.error("Failed to delete experiment:", error);
    }
  };

  const loadExperiment = async () => {
    if (!experimentId) return;

    loading.value = true;
    try {
      await store.fetchExperiments();
      if (!experiment.value) {
        await store.fetchExperiment(experimentId);
      }
    } catch (error) {
      console.error("Failed to fetch experiment:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    experiment,
    error,
    loading,
    startExperiment,
    completeExperiment,
    updateStatus,
    deleteExperiment,
    loadExperiment,
  };
}
