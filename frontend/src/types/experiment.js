/**
 * @typedef {Object} Experiment
 * @property {string} id - Experiment ID
 * @property {string} name - Experiment name
 * @property {string} createdAt - Creation date
 * @property {string} [description] - Experiment description
 * @property {string} status - Experiment status
 * @property {number} [duration] - Experiment duration in days
 */

/**
 * @typedef {('active'|'completed'|'failed'|'pending')} ExperimentStatus
 */

export const EXPERIMENT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  FAILED: "failed",
  PENDING: "pending",
};
