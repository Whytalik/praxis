import { Experiment } from "../models/experiment.model.js";
import { AppError, catchAsync } from "../utils/errors.js";

export const experimentCRUDController = {
  getAll: catchAsync(async (req, res) => {
    const experiments = await Experiment.find().sort({ createdAt: -1 });
    res.json(experiments);
  }),

  getById: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }
    res.json(experiment);
  }),

  create: catchAsync(async (req, res, next) => {
    const { title, metrics } = req.body;

    if (!title) {
      return next(new AppError(400, "Experiment title is required"));
    }

    if (!metrics?.length) {
      return next(new AppError(400, "At least one metric is required"));
    }

    const experiment = new Experiment({
      title,
      metrics: metrics.map((metric) => ({
        name: metric.name,
        type: metric.type || "number",
      })),
    });

    const savedExperiment = await experiment.save();
    res.status(201).json({ id: savedExperiment._id });
  }),

  update: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    res.json(experiment);
  }),

  delete: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findByIdAndDelete(req.params.id);

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    res.json({ message: "Experiment deleted successfully" });
  }),

  updateStatus: catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const experiment = await Experiment.findById(req.params.id);
    
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }
    
    await experiment.updateStatus(status);
    res.json(experiment);
  }),

  addMetric: catchAsync(async (req, res, next) => {
    const { metric } = req.body;
    const experiment = await Experiment.findById(req.params.id);
    
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }
    
    await experiment.addMetric(metric);
    res.json(experiment);
  }),
};
