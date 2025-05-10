import mongoose from "mongoose";
import { AppError } from "../errors.js";
import { Entry } from "../../models/entry.model.js";

export const aggregateEntryData = async (experimentId, numericMetrics) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(experimentId)) {
      throw new AppError(400, "Invalid experiment ID format");
    }

    const entries = await Entry.aggregate([
      {
        $match: {
          experimentId: new mongoose.Types.ObjectId(experimentId),
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          values: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return entries;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, "Invalid experiment ID format");
    }
    throw error;
  }
};
