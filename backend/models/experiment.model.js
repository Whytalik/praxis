import mongoose from "mongoose";
import { MetricType } from "./metricType.model.js";

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Experiment title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters long"],
      maxLength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [1000, "Description cannot be longer than 1000 characters"],
    },
    metrics: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          typeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MetricType",
            required: true,
          },
          customValidation: {
            type: mongoose.Schema.Types.Mixed,
          },
        },
      ],
      validate: [
        {
          validator: function (metrics) {
            return metrics.length >= 1;
          },
          message: "Add at least one metric",
        },
        {
          validator: function (metrics) {
            const names = metrics.map((m) => m.name);
            return names.length === new Set(names).size;
          },
          message: "Metric names must be unique",
        },
      ],
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

experimentSchema.virtual("duration").get(function () {
  return Math.round((this.updatedAt - this.createdAt) / (1000 * 60 * 60 * 24));
});

experimentSchema.virtual("entries", {
  ref: "Entry",
  localField: "_id",
  foreignField: "experimentId",
});

experimentSchema.methods.addMetric = async function (metric) {
  if (!metric.name) {
    throw new Error("Metric name is required");
  }

  if (!metric.typeId) {
    throw new Error("Metric type is required");
  }

  const metricType = await MetricType.findById(metric.typeId);
  if (!metricType) {
    throw new Error("Invalid metric type");
  }

  if (this.metrics.some((m) => m.name === metric.name)) {
    throw new Error("Metric with this name already exists");
  }

  this.metrics.push({
    name: metric.name,
    typeId: metric.typeId,
    customValidation: metric.customValidation,
  });

  return this.save();
};

experimentSchema.methods.updateStatus = async function (newStatus) {
  if (!["pending", "in progress", "completed"].includes(newStatus)) {
    throw new Error("Invalid status");
  }

  this.status = newStatus;
  return this.save();
};

experimentSchema.statics.findByStatus = function (status) {
  return this.find({ status });
};

experimentSchema.index({ status: 1, createdAt: -1 });
experimentSchema.index({ title: "text" });

export const Experiment = mongoose.model("Experiment", experimentSchema);
