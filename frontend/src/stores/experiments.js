import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { EXPERIMENT_STATUS } from "@/types/experiment";

export const useExperimentsStore = defineStore("experiments", {
  state: () => ({
    experiments: [],
    error: null,
  }),

  getters: {
    getExperiments: (state) => state.experiments,
    getError: (state) => state.error,
  },

  actions: {
    async fetchExperiments() {
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
          metrics: exp.metrics || [],
          updatedAt: exp.updatedAt || exp.createdAt,
        }));

        console.log("Processed experiments:", this.experiments);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch experiments";
        console.error("Error fetching experiments:", error);
      }
    },

    async fetchExperiment(id) {
      this.error = null;
      try {
        const response = await axios.get(`/api/experiments/${id}`);
        const exp = response.data;
        
        const formattedExperiment = {
          id: exp._id,
          name: exp.title || `Experiment ${exp._id || "No ID"}`,
          createdAt: exp.createdAt || new Date().toISOString(),
          description: exp.description || "",
          status: exp.status || EXPERIMENT_STATUS.PENDING,
          duration: exp.duration || 0,
          metrics: exp.metrics || [],
          updatedAt: exp.updatedAt || exp.createdAt,
        };
        
        const index = this.experiments.findIndex(
          (e) => e.id === formattedExperiment.id
        );
        if (index >= 0) {
          this.experiments[index] = formattedExperiment;
        } else {
          this.experiments.push(formattedExperiment);
        }
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch experiment";
        console.error(`Error fetching experiment ${id}:`, error);
      }
    },

    async updateExperimentStatus(id, newStatus) {
      try {
        const response = await axios.patch(`/api/experiments/${id}/status`, {
          status: newStatus,
        });

        const updatedExperiment = response.data;
        const index = this.experiments.findIndex((e) => e.id === id);
        
        if (index >= 0) {
          this.experiments[index] = {
            ...this.experiments[index],
            status: updatedExperiment.status,
            updatedAt: updatedExperiment.updatedAt,
          };
        }

        return updatedExperiment;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          "Failed to update experiment status"
        );
      }
    },
  },
});
