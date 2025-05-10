import { Experiment } from "../../models/experiment.model.js";
import { MetricType } from "../../models/metricType.model.js";
import { Entry } from "../../models/entry.model.js";
import { AppError, catchAsync } from "../../utils/errors.js";

export const experimentMetricController = {
  addMetric: catchAsync(async (req, res, next) => {
    const { name, typeId } = req.body;
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const metricType = await MetricType.findById(typeId);
    if (!metricType) {
      return next(new AppError(400, "Metric type not found"));
    }

    if (
      experiment.metrics.some(
        (m) => m.name === name || m.typeId.toString() === typeId
      )
    ) {
      return next(
        new AppError(400, "Metric already exists in this experiment")
      );
    }

    experiment.metrics.push({ name, typeId });
    experiment.updatedAt = new Date();
    await experiment.save();

    res.json(experiment);
  }),

  getEntries: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const entries = await Entry.find({ experimentId: req.params.id }).sort({
      date: 1,
    });
    res.json(entries);
  }),
};
