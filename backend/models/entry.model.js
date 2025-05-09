import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
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
    validate: {
      validator: function (map) {
        return map.size >= 1;
      },
      message: "Should be at least one value.",
    },
  },
  conclusion: {
    type: String,
  },
});

entrySchema.index({ experimentId: 1, date: 1 });

export const Entry = mongoose.model("Entry", entrySchema);
