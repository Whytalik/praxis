import { EXPERIMENT_STATUS } from "@/types/experiment";

export const formatExperiment = (exp) => ({
  id: exp._id,
  name: exp.title || `Experiment ${exp._id || "No ID"}`,
  createdAt: exp.createdAt || new Date().toISOString(),
  description: exp.description || "",
  status: exp.status || EXPERIMENT_STATUS.PENDING,
  duration: exp.duration || 0,
  metrics: exp.metrics || [],
  updatedAt: exp.updatedAt || exp.createdAt,
});

export const formatExperiments = (experiments) => {
  if (!Array.isArray(experiments)) {
    console.error("Expected array but got:", typeof experiments);
    throw new Error("Invalid data format from API");
  }

  return experiments.map(formatExperiment);
};
