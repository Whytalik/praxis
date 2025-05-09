import { MetricType } from "../../models/metricType.model.js";
import { AppError } from "../../utils/errors.js";

export const validateEntryValues = async (values, experiment) => {
  if (!values || typeof values !== "object") {
    throw new AppError(400, "Values must be an object");
  }

  const requiredMetrics = experiment.metrics.map((m) => m.name);
  const providedMetrics = Object.keys(values);

  if (requiredMetrics.some((metric) => !providedMetrics.includes(metric))) {
    throw new AppError(400, "All required metrics must be provided");
  }

  const validatedValues = {};
  for (const metric of experiment.metrics) {
    const value = values[metric.name];
    const metricType = await MetricType.findById(metric.typeId);

    if (!metricType) {
      throw new AppError(400, `Metric type not found for ${metric.name}`);
    }

    if (metricType.validation) {
      if (metricType.validation.type === "number") {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new AppError(400, `Value for ${metric.name} must be a number`);
        }
        if (
          numValue < metricType.validation.min ||
          numValue > metricType.validation.max
        ) {
          throw new AppError(
            400,
            `Value for ${metric.name} must be between ${metricType.validation.min} and ${metricType.validation.max}`
          );
        }
        validatedValues[metric.name] = numValue;
      }
    } else {
      validatedValues[metric.name] = value;
    }
  }

  return validatedValues;
};
