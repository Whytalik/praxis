import mongoose from "mongoose";
import { Experiment } from "./experiment.model.js";

const entrySchema = new mongoose.Schema(
  {
    experimentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiment",
      required: [true, "ExperimentId is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
      validate: [
        {
          validator: function (map) {
            return map.size >= 1;
          },
          message: "Should be at least one value.",
        },
        {
          validator: async function (map) {
            const experiment = await Experiment.findById(this.experimentId);
            if (!experiment) return false;

            const metrics = experiment.metrics.reduce((acc, metric) => {
              acc[metric.name] = metric.type;
              return acc;
            }, {});

            for (const [key, value] of map) {
              if (!metrics[key]) return false;
              if (metrics[key] === "number" && isNaN(value)) return false;
            }
            return true;
          },
          message: "Values must match metric types defined in experiment",
        },
      ],
    },
    conclusion: {
      type: String,
      maxLength: [1000, "Conclusion cannot be longer than 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

entrySchema.index({ experimentId: 1, date: 1 });
entrySchema.index({ date: 1 });

export const Entry = mongoose.model("Entry", entrySchema);
