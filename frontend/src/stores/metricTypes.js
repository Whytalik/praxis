import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useMetricTypesStore = defineStore("metricTypes", {
  state: () => ({
    metricTypes: [],
    error: null,
  }),

  getters: {
    getMetricTypes: (state) => state.metricTypes,
    getError: (state) => state.error,
  },

  actions: {
    async fetchMetricTypes() {
      this.error = null;
      try {
        const response = await axios.get("/api/metric-types");
        console.log("Metric types response:", response.data);
        this.metricTypes = response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch metric types";
        console.error("Error fetching metric types:", error);
      }
    },

    async createMetricType(metricTypeData) {
      this.error = null;
      try {
        const response = await axios.post("/api/metric-types", metricTypeData);
        this.metricTypes.push(response.data);
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to create metric type";
        console.error("Error creating metric type:", error);
        throw error;
      }
    },

    async updateMetricType(id, metricTypeData) {
      this.error = null;
      try {
        const response = await axios.patch(
          `/api/metric-types/${id}`,
          metricTypeData
        );
        const index = this.metricTypes.findIndex((type) => type._id === id);
        if (index !== -1) {
          this.metricTypes[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to update metric type";
        console.error("Error updating metric type:", error);
        throw error;
      }
    },

    async deleteMetricType(id) {
      this.error = null;
      try {
        await axios.delete(`/api/metric-types/${id}`);
        this.metricTypes = this.metricTypes.filter((type) => type._id !== id);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete metric type";
        console.error("Error deleting metric type:", error);
        throw error;
      }
    },
  },
});
