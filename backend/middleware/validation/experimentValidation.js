import { AppError } from "../../utils/errors.js";

export const validateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!["pending", "in progress", "completed"].includes(status)) {
    return next(new AppError(400, "Invalid status"));
  }
  next();
};

export const validateMetric = (req, res, next) => {
  const { name, typeId } = req.body;
  if (!name) {
    return next(new AppError(400, "Metric name is required"));
  }
  if (!typeId) {
    return next(new AppError(400, "Metric type ID is required"));
  }
  next();
};
