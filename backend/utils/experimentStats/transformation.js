export const transformToChartData = (entries, numericMetrics) => {
  const labels = entries.map((entry) => entry.date);
  const datasets = numericMetrics.map((metricName) => ({
    label: metricName,
    data: entries.map((entry) => {
      const value = entry.values[metricName];
      return value ? parseFloat(value) : null;
    }),
  }));

  return { labels, datasets };
};
