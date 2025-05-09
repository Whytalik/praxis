import { Experiment } from "../../models/experiment.model.js";
import { AppError, catchAsync } from "../../utils/errors.js";

export const experimentStatusController = {
  updateStatus: catchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!status || !["active", "paused", "completed"].includes(status)) {
      return next(
        new AppError(400, "Status must be one of: active, paused, completed")
      );
    }

    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    experiment.status = status;
    const updatedExperiment = await experiment.save();

    res.json(updatedExperiment);
  }),
};
