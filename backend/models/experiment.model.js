import mongoose from "mongoose";

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Experiment title is required"],
    },
    metrics: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ["number", "text"],
            default: "number",
          },
        },
      ],
      validate: {
        validator: function (metrics) {
          return metrics.length >= 1;
        },
        message: "Add at least one metric",
      },
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
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
  return (
    (this.updatedAt.getTime() - this.createdAt.getTime()) /
    (1000 * 60 * 60 * 24)
  );
});

experimentSchema.statics.findByStatus = function (status) {
  return this.find({ status: status });
};

// Метод екземпляра для додавання нової метрики
experimentSchema.methods.addMetric = function (metric) {
  this.metrics.push(metric);
  return this.save();
};

export const Experiment = mongoose.model("Experiment", experimentSchema);
