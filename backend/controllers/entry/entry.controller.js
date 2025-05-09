import { Entry } from "../../models/entry.model.js";
import { Experiment } from "../../models/experiment.model.js";
import { AppError, catchAsync } from "../../utils/errors.js";
import { validateEntryValues } from "./entryValidation.js";

export const entryController = {
  create: catchAsync(async (req, res, next) => {
    const { experimentId, values, conclusion } = req.body;

    if (!experimentId) {
      return next(new AppError(400, "Experiment ID is required"));
    }

    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const validatedValues = await validateEntryValues(values, experiment);

    const entry = await Entry.create({
      experimentId,
      values: validatedValues,
      conclusion,
      date: new Date(),
    });

    res.status(201).json(entry);
  }),

  getById: catchAsync(async (req, res, next) => {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return next(new AppError(404, "Entry not found"));
    }
    res.json(entry);
  }),

  getByExperimentId: catchAsync(async (req, res, next) => {
    const { experimentId } = req.params;

    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    const entries = await Entry.find({ experimentId });
    res.json(entries);
  }),

  update: catchAsync(async (req, res, next) => {
    const { values, conclusion } = req.body;

    if (!values && !req.body.hasOwnProperty("conclusion")) {
      return next(
        new AppError(400, "Either values or conclusion must be provided")
      );
    }

    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return next(new AppError(404, "Entry not found"));
    }

    const experiment = await Experiment.findById(entry.experimentId);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    if (values) {
      const validatedValues = await validateEntryValues(values, experiment);
      for (const [key, value] of Object.entries(validatedValues)) {
        entry.values.set(key, value);
      }
    }

    if (req.body.hasOwnProperty("conclusion")) {
      if (typeof conclusion !== "string" && conclusion !== null) {
        return next(new AppError(400, "Conclusion must be a string or null"));
      }
      entry.conclusion = conclusion;
    }

    await entry.save();
    const updatedEntry = await Entry.findById(req.params.id);
    res.json(updatedEntry);
  }),

  delete: catchAsync(async (req, res, next) => {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return next(new AppError(404, "Entry not found"));
    }
    res.json({ message: "Entry deleted successfully" });
  }),
};
