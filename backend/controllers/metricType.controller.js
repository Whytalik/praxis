import { MetricType } from "../models/metricType.model.js";
import { AppError, catchAsync } from "../utils/errors.js";

export const metricTypeController = {
  getAll: catchAsync(async (req, res) => {
    const metricTypes = await MetricType.find();
    res.json(metricTypes);
  }),

  getById: catchAsync(async (req, res, next) => {
    const metricType = await MetricType.findById(req.params.id);
    if (!metricType) {
      return next(new AppError(404, "Metric type not found"));
    }
    res.json(metricType);
  }),

  create: catchAsync(async (req, res, next) => {
    const { name, description, validation, format, unit } = req.body;

    if (!name) {
      return next(new AppError(400, "Metric type name is required"));
    }

    if (!validation?.type) {
      return next(new AppError(400, "Validation type is required"));
    }

    const metricType = await MetricType.create({
      name,
      description,
      validation,
      format,
      unit,
    });

    res.status(201).json(metricType);
  }),

  update: catchAsync(async (req, res, next) => {
    const { description } = req.body;
    const metricType = await MetricType.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true, runValidators: true }
    );

    if (!metricType) {
      return next(new AppError(404, "Metric type not found"));
    }

    res.json(metricType);
  }),

  delete: catchAsync(async (req, res, next) => {
    const metricType = await MetricType.findByIdAndDelete(req.params.id);

    if (!metricType) {
      return next(new AppError(404, "Metric type not found"));
    }

    res.json({ message: "Metric type deleted successfully" });
  }),
};
