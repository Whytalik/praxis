import { AppError } from "../utils/errors.js";

export const validateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!["active", "paused", "completed"].includes(status)) {
    return next(new AppError(400, "Invalid status"));
  }
  next();
};

export const validateMetric = (req, res, next) => {
  const { metric } = req.body;
  if (!metric?.name) {
    return next(new AppError(400, "Metric name is required"));
  }
  if (metric.type && !["number", "text"].includes(metric.type)) {
    return next(new AppError(400, "Invalid metric type"));
  }
  next();
}; 