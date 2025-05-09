import { Experiment } from "../models/experiment.model.js";
import { aggregateEntryData } from "../utils/experimentStats.js";
import { AppError, catchAsync } from "../utils/errors.js";

export const experimentStatsController = {
  getStats: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const numericMetrics = experiment.metrics
      .filter((metric) => metric.type === "number")
      .map((metric) => metric.name);

    const stats = await aggregateEntryData(req.params.id, numericMetrics);
    res.json(stats);
  }),
};
