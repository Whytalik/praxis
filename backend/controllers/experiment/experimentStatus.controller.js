import { Experiment } from "../../models/experiment.model.js";
import { AppError, catchAsync } from "../../utils/errors.js";

export const experimentStatusController = {
  updateStatus: catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return next(new AppError(404, "Experiment not found"));
    }

    if (!["pending", "in progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "in progress" && experiment.status === "completed") {
      return res.status(400).json({ message: "Cannot restart completed experiment" });
    }

    if (status === "completed" && experiment.status !== "in progress") {
      return res.status(400).json({ message: "Can only complete in-progress experiments" });
    }

    experiment.status = status;
    await experiment.save();

    res.json(experiment);
  }),
};
