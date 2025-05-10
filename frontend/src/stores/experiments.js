import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { formatExperiment, formatExperiments } from "@/utils/experiment";

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

        this.experiments = formatExperiments(response.data);
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
        const formattedExperiment = formatExperiment(response.data);

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

    async createExperiment(experimentData) {
      this.error = null;
      try {
        const response = await axios.post("/api/experiments", experimentData);
        const formattedExperiment = formatExperiment(response.data);
        this.experiments.push(formattedExperiment);
        return formattedExperiment;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to create experiment";
        console.error("Error creating experiment:", error);
        throw error;
      }
    },

    async updateExperimentStatus(id, status) {
      this.error = null;
      try {
        const response = await axios.patch(`/api/experiments/${id}/status`, {
          status,
        });
        const updatedExperiment = formatExperiment(response.data);
        const index = this.experiments.findIndex((e) => e.id === id);
        if (index !== -1) {
          this.experiments[index] = updatedExperiment;
        }
        return updatedExperiment;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to update experiment status";
        console.error("Error updating experiment status:", error);
        throw error;
      }
    },

    async deleteExperiment(id) {
      this.error = null;
      try {
        await axios.delete(`/api/experiments/${id}`);
        this.experiments = this.experiments.filter((exp) => exp.id !== id);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete experiment";
        console.error("Error deleting experiment:", error);
        throw error;
      }
    },
  },
});
