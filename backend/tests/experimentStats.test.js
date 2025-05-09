import fetch from "node-fetch";
import mongoose from "mongoose";
import { Entry } from "../models/entry.model.js";
import { Experiment } from "../models/experiment.model.js";
import { MetricType } from "../models/metricType.model.js";

const API_URL = "http://localhost:3000/api";

describe("Experiment Statistics Tests", () => {
  let metricType;
  let experiment;
  let entries = [];

  beforeAll(async () => {
    await Entry.deleteMany({});
    await Experiment.deleteMany({});
    await MetricType.deleteMany({});

    const metricResponse = await fetch(`${API_URL}/metric-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `TestMetric_${Date.now()}`,
        description: "Test metric for statistics",
        validation: {
          type: "number",
          min: 0,
          max: 100,
        },
      }),
    });

    metricType = await metricResponse.json();

    const experimentResponse = await fetch(`${API_URL}/experiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `TestExperiment_${Date.now()}`,
        metrics: [
          {
            name: metricType.name,
            typeId: metricType._id,
          },
        ],
      }),
    });

    experiment = await experimentResponse.json();

    const values = [50, 75, 60, 85, 90];
    for (const value of values) {
      const entryResponse = await fetch(`${API_URL}/entries`, {
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

      const entry = await entryResponse.json();
      entries.push(entry);
    }
  });

  describe("Get Statistics", () => {
    test("should get statistics for experiment with entries", async () => {
      const response = await fetch(
        `${API_URL}/experiments/${experiment._id}/stats`
      );
      const stats = await response.json();

      expect(response.status).toBe(200);
      expect(stats).toHaveProperty("labels");
      expect(stats).toHaveProperty("datasets");
      expect(Array.isArray(stats.labels)).toBe(true);
      expect(Array.isArray(stats.datasets)).toBe(true);
      expect(stats.datasets.length).toBe(1);

      const dataset = stats.datasets[0];
      expect(dataset.label).toBe(metricType.name);
      expect(Array.isArray(dataset.data)).toBe(true);
      expect(dataset.data.length).toBe(entries.length);
    });

    test("should return empty datasets for experiment without entries", async () => {
      const newExperimentResponse = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Empty Experiment",
          metrics: [
            {
              name: metricType.name,
              typeId: metricType._id,
            },
          ],
        }),
      });

      const newExperiment = await newExperimentResponse.json();
      const response = await fetch(
        `${API_URL}/experiments/${newExperiment._id}/stats`
      );
      const stats = await response.json();

      expect(response.status).toBe(200);
      expect(stats.labels).toHaveLength(0);
      expect(stats.datasets).toHaveLength(1);
      expect(stats.datasets[0].data).toHaveLength(0);
    });

    test("should return 404 for non-existent experiment", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await fetch(`${API_URL}/experiments/${fakeId}/stats`);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.message).toContain("not found");
    });

    test("should handle invalid experiment ID format", async () => {
      const response = await fetch(`${API_URL}/experiments/invalid-id/stats`);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("Invalid _id");
    });
  });

  describe("Statistics Calculations", () => {
    test("should calculate correct statistics for numeric metrics", async () => {
      const response = await fetch(
        `${API_URL}/experiments/${experiment._id}/stats`
      );
      const stats = await response.json();

      const dataset = stats.datasets[0];
      expect(dataset.data).toHaveLength(entries.length);

      const values = entries.map((entry) => entry.values[metricType.name]);
      expect(dataset.data).toEqual(expect.arrayContaining(values));
    });

    test("should handle missing values in entries", async () => {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {},
          conclusion: "Entry without metric value",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("required");
    });
  });
});
