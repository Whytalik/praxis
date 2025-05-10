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
 * @typedef {('in progress'|'completed'|'pending')} ExperimentStatus
 */

export const EXPERIMENT_STATUS = {
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
  PENDING: "pending",
};
