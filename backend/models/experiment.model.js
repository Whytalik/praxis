import mongoose from "mongoose";

const experimentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export const Experiment = mongoose.model("Experiment", experimentSchema);
