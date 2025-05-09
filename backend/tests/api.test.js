import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";
let metricType;
let experiment;

describe("API Tests", () => {
  describe("1. Metric Type Operations", () => {
    test("should create a new metric type", async () => {
      const timestamp = Date.now();
      const response = await fetch(`${API_URL}/metric-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Metric_${timestamp}`,
          description: "Test metric",
          validation: {
            type: "number",
            min: 0,
            max: 100,
          },
          format: "default",
          unit: "units",
        }),
      });

      metricType = await response.json();
      expect(response.status).toBe(201);
      expect(metricType).toHaveProperty("_id");
      expect(metricType.name).toBe(`Metric_${timestamp}`);
    });

    test("should get all metric types", async () => {
      const response = await fetch(`${API_URL}/metric-types`);
      const allMetricTypes = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(allMetricTypes)).toBe(true);
      expect(allMetricTypes.length).toBeGreaterThan(0);
    });
  });

  describe("2. Experiment Operations", () => {
    test("should create a new experiment", async () => {
      const timestamp = Date.now();
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Test Experiment ${timestamp}`,
          metrics: [
            {
              name: metricType.name,
              typeId: metricType._id,
            },
          ],
        }),
      });

      experiment = await response.json();
      expect(response.status).toBe(201);
      expect(experiment).toHaveProperty("_id");
      expect(experiment.title).toBe(`Test Experiment ${timestamp}`);
    });

    test("should get all experiments", async () => {
      const response = await fetch(`${API_URL}/experiments`);
      const allExperiments = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(allExperiments)).toBe(true);
      expect(allExperiments.length).toBeGreaterThan(0);
    });

    test("should update experiment status", async () => {
      const response = await fetch(
        `${API_URL}/experiments/${experiment._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "paused" }),
        }
      );
      const updatedExperiment = await response.json();

      expect(response.status).toBe(200);
      expect(updatedExperiment.status).toBe("paused");
    });
  });

  describe("3. Entry Operations", () => {
    test("should create multiple entries", async () => {
      const values = [50, 75, 60, 85, 90];

      for (const value of values) {
        const response = await fetch(`${API_URL}/entries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experimentId: experiment._id,
            values: {
              [metricType.name]: value,
            },
            conclusion: `Test entry with value ${value}`,
          }),
        });

        const entry = await response.json();
        expect(response.status).toBe(201);
        expect(entry).toHaveProperty("_id");
        expect(entry.values).toHaveProperty(metricType.name);
        expect(entry.values[metricType.name]).toBe(value);
      }
    });
  });

  describe("4. Statistics Operations", () => {
    test("should get experiment statistics", async () => {
      const response = await fetch(
        `${API_URL}/experiments/${experiment._id}/stats`
      );
      const stats = await response.json();

      expect(response.status).toBe(200);
      expect(stats).toHaveProperty("labels");
      expect(stats).toHaveProperty("datasets");
      expect(Array.isArray(stats.labels)).toBe(true);
      expect(Array.isArray(stats.datasets)).toBe(true);

      if (stats.datasets.length > 0) {
        const metricDataset = stats.datasets.find(
          (d) => d.label === metricType.name
        );
        expect(metricDataset).toBeDefined();
        expect(Array.isArray(metricDataset.data)).toBe(true);
        expect(metricDataset.data.length).toBeGreaterThan(0);
      }
    });
  });

  describe("5. Error Handling", () => {
    test("should handle invalid experiment creation", async () => {
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Invalid Experiment",
        }),
      });

      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result).toHaveProperty("message");
      expect(result.message).toBe("At least one metric is required");
    });
  });
});
