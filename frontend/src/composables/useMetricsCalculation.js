import { ref, computed } from "vue";

export function useMetricsCalculation(entries, metrics) {
  const metricStats = computed(() => {
    if (!entries.value || !metrics.value) return {};

    const stats = {};

    metrics.value.forEach((metric) => {
      const metricName = metric.name;
      const values = entries.value
        .map((entry) => {
          if (entry.values) {
            if (typeof entry.values.get === "function") {
              return parseFloat(entry.values.get(metricName));
            } else {
              return parseFloat(entry.values[metricName]);
            }
          }
          return NaN;
        })
        .filter((val) => !isNaN(val));

      if (values.length === 0) {
        stats[metricName] = {
          min: 0,
          max: 0,
          avg: 0,
          current: 0,
          trend: "stable",
          values: [],
          labels: [],
        };
        return;
      }

      const min = Math.min(...values);
      const max = Math.max(...values);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const current = values[values.length - 1];

      let trend = "stable";
      if (values.length > 1) {
        const prevValue = values[values.length - 2];
        if (current > prevValue) {
          trend = "improving";
        } else if (current < prevValue) {
          trend = "declining";
        }
      }

      const chartValues = [...values];
      const chartLabels = entries.value
        .filter((entry) => {
          const val =
            typeof entry.values.get === "function"
              ? entry.values.get(metricName)
              : entry.values[metricName];
          return !isNaN(parseFloat(val));
        })
        .map((entry) => {
          const date = new Date(entry.date);
          return date.toLocaleDateString();
        });

      stats[metricName] = {
        min,
        max,
        avg,
        current,
        trend,
        values: chartValues,
        labels: chartLabels,
      };
    });

    return stats;
  });

  return {
    metricStats,
  };
}
