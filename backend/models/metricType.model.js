import mongoose from "mongoose";

const metricTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Metric type name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    validation: {
      type: {
        type: String,
        enum: ["number", "text", "boolean", "date", "select", "custom"],
        required: true,
      },
      min: Number,
      max: Number,
      pattern: String,
      options: [String],
      customValidator: String,
    },
    format: {
      type: String,
      enum: ["default", "percentage", "currency", "scientific", "custom"],
      default: "default",
    },
    unit: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

metricTypeSchema.index({ isActive: 1 });

export const MetricType = mongoose.model("MetricType", metricTypeSchema);
