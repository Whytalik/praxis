import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { EXPERIMENT_STATUS } from "@/types/experiment";

export const useExperimentsStore = defineStore("experiments", {
  state: () => ({
    experiments: [],
    loading: false,
    error: null,
  }),

  getters: {
    getExperiments: (state) => state.experiments,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchExperiments() {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching experiments...");
        const response = await axios.get("/api/experiments");
        console.log("API Response:", response.data);

        if (!Array.isArray(response.data)) {
          console.error("Expected array but got:", typeof response.data);
          throw new Error("Invalid data format from API");
        }

        this.experiments = response.data.map((exp) => ({
          id: exp._id,
          name: exp.title || `Experiment ${exp._id || "No ID"}`,
          createdAt: exp.createdAt || new Date().toISOString(),
          description: exp.description || "",
          status: exp.status || EXPERIMENT_STATUS.PENDING,
          duration: exp.duration || 0,
        }));

        console.log("Processed experiments:", this.experiments);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch experiments";
        console.error("Error fetching experiments:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
