import { Entry } from "../models/entry.model.js";
import { Experiment } from "../models/experiment.model.js";
import { AppError, catchAsync } from "../utils/errors.js";

export const entryController = {
  create: catchAsync(async (req, res, next) => {
    const { experimentId, values, conclusion } = req.body;

    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    if (!values || Object.keys(values).length === 0) {
      return next(new AppError(400, "At least one value is required"));
    }

    const entry = new Entry({
      experimentId,
      values: new Map(Object.entries(values)),
      conclusion,
    });

    await entry.save();
    res.status(201).json({
      message: "Entry added successfully",
    });
  }),
};
