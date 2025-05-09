import mongoose from "mongoose";
import { AppError } from "./errors.js";
import { Entry } from "../models/entry.model.js";

export const aggregateEntryData = async (experimentId, numericMetrics) => {
  try {
    const entries = await Entry.aggregate([
      {
        $match: {
          experimentId: mongoose.Types.ObjectId(experimentId),
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
        $group: {
          _id: "$date",
          metrics: {
            $push: {
              k: { $objectToArray: "$values" },
              v: { $objectToArray: "$values" },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    if (!entries.length) {
      return { labels: [], datasets: [] };
    }

    const labels = entries.map((entry) => entry._id);
    const datasets = numericMetrics.map((metricName) => {
      const data = entries.map((entry) => {
        const metricValues = entry.metrics
          .map((m) => m.v)
          .flat()
          .filter((v) => v.k === metricName)
          .map((v) => parseFloat(v.v))
          .filter((v) => !isNaN(v));

        return metricValues.length > 0
          ? metricValues.reduce((a, b) => a + b) / metricValues.length
          : null;
      });

      return {
        label: metricName,
        data: data,
      };
    });

    return { labels, datasets };
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, "Invalid experiment ID format");
    }
    throw new AppError(500, "Error processing experiment statistics");
  }
};
