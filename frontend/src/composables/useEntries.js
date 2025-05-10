import { ref, watch, isRef, unref } from "vue";
import axios from "@/utils/axios";

export function useEntries(experimentId) {
  const entries = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchEntries = async () => {
    const id = unref(experimentId);
    if (!id) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`/api/experiments/${id}/entries`);
      entries.value = response.data;
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      error.value = "Failed to load entries. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const createEntry = async (values, conclusion) => {
    const id = unref(experimentId);
    if (!id) return false;

    loading.value = true;
    error.value = null;

    try {
      const payload = {
        experimentId: id,
        values,
        conclusion,
      };

      await axios.post("/api/entries", payload);
      await fetchEntries();
      return true;
    } catch (err) {
      console.error("Failed to save entry:", err);
      error.value =
        err.response?.data?.message ||
        "Failed to save entry. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  if (isRef(experimentId)) {
    watch(experimentId, (newId) => {
      if (newId) {
        fetchEntries();
      } else {
        entries.value = [];
      }
    });
  }

  return {
    entries,
    loading,
    error,
    fetchEntries,
    createEntry,
  };
}
