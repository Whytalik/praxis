import { Experiment } from "../../models/experiment.model.js";
import { MetricType } from "../../models/metricType.model.js";
import { Entry } from "../../models/entry.model.js";
import { AppError, catchAsync } from "../../utils/errors.js";

export const experimentController = {
  create: catchAsync(async (req, res, next) => {
    const { title, metrics } = req.body;

    if (!title) {
      return next(new AppError(400, "Title is required"));
    }

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return next(new AppError(400, "At least one metric is required"));
    }

    for (const metric of metrics) {
      if (!metric.name || !metric.typeId) {
        return next(
          new AppError(400, "Each metric must have a name and typeId")
        );
      }
    }

    const metricTypeIds = metrics.map((m) => m.typeId);
    const metricTypes = await MetricType.find({
      _id: { $in: metricTypeIds },
    });

    if (metricTypes.length !== metricTypeIds.length) {
      return next(new AppError(400, "Some metric types were not found"));
    }

    const experiment = await Experiment.create({
      title,
      metrics,
      status: "active",
    });

    res.status(201).json(experiment);
  }),

  getAll: catchAsync(async (req, res) => {
    const experiments = await Experiment.find();
    res.json(experiments);
  }),

  getById: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }
    res.json(experiment);
  }),

  update: catchAsync(async (req, res, next) => {
    const { title, metrics } = req.body;

    if (!title && !metrics) {
      return next(new AppError(400, "Nothing to update"));
    }

    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    if (title) {
      experiment.title = title;
    }

    if (metrics) {
      if (!Array.isArray(metrics) || metrics.length === 0) {
        return next(new AppError(400, "At least one metric is required"));
      }

      for (const metric of metrics) {
        if (!metric.name || !metric.typeId) {
          return next(
            new AppError(400, "Each metric must have a name and typeId")
          );
        }
      }

      const metricTypeIds = metrics.map((m) => m.typeId);
      const metricTypes = await MetricType.find({
        _id: { $in: metricTypeIds },
      });

      if (metricTypes.length !== metricTypeIds.length) {
        return next(new AppError(400, "Some metric types were not found"));
      }

      experiment.metrics = metrics;
    }

    const updatedExperiment = await experiment.save();
    res.json(updatedExperiment);
  }),

  delete: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    try {
      await Entry.deleteMany({ experimentId: req.params.id });
      await Experiment.findByIdAndDelete(req.params.id);
      res.json({ message: "Experiment deleted successfully" });
    } catch (error) {
      return next(new AppError(500, "Error deleting experiment"));
    }
  }),
};
