import { Experiment } from "../../models/experiment.model.js";
import { aggregateEntryData } from "../../utils/experimentStats/aggregation.js";
import { transformToChartData } from "../../utils/experimentStats/transformation.js";
import { AppError, catchAsync } from "../../utils/errors.js";

export const experimentStatsController = {
  getStats: catchAsync(async (req, res, next) => {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const numericMetrics = experiment.metrics
      .filter(
        (metric) =>
          metric.customValidation?.type === "number" ||
          !metric.customValidation?.type
      )
      .map((metric) => metric.name);

    const entries = await aggregateEntryData(req.params.id, numericMetrics);
    const stats = transformToChartData(entries, numericMetrics);

    res.json(stats);
  }),
};
