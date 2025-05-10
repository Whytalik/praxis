import fetch from "node-fetch";
import mongoose from "mongoose";
import { Experiment } from "../models/experiment.model.js";
import { MetricType } from "../models/metricType.model.js";

const API_URL = "http://localhost:3000/api";

describe("Experiment Tests", () => {
  let metricType;

  beforeAll(async () => {
    await Experiment.deleteMany({});
    await MetricType.deleteMany({});

    const metricResponse = await fetch(`${API_URL}/metric-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `TestMetric_${Date.now()}`,
        description: "Test metric",
        validation: {
          type: "number",
          min: 0,
          max: 100,
        },
      }),
    });

    metricType = await metricResponse.json();
  });

  describe("Create Experiment", () => {
    test("should create a valid experiment", async () => {
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Experiment",
          metrics: [
            {
              name: metricType.name,
              typeId: metricType._id,
            },
          ],
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data).toHaveProperty("_id");
      expect(data.title).toBe("Test Experiment");
      expect(data.metrics).toHaveLength(1);
      expect(data.metrics[0].name).toBe(metricType.name);
      expect(data.metrics[0].typeId).toBe(metricType._id);
    });

    test("should not create experiment without title", async () => {
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: [
            {
              name: metricType.name,
              typeId: metricType._id,
            },
          ],
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toBe("Title is required");
    });

    test("should not create experiment without metrics", async () => {
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Experiment",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toBe("At least one metric is required");
    });

    test("should not create experiment with invalid metric type", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Experiment",
          metrics: [
            {
              name: "Invalid Metric",
              typeId: fakeId,
            },
          ],
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toBe("Some metric types were not found");
    });
  });

  describe("Delete Experiment", () => {
    test("should delete experiment", async () => {
      const createResponse = await fetch(`${API_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Experiment to Delete",
          metrics: [
            {
              name: metricType.name,
              typeId: metricType._id,
            },
          ],
        }),
      });

      const experiment = await createResponse.json();
      expect(createResponse.status).toBe(201);

      const response = await fetch(`${API_URL}/experiments/${experiment._id}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);

      const checkResponse = await fetch(
        `${API_URL}/experiments/${experiment._id}`
      );
      expect(checkResponse.status).toBe(404);
    });
  });
});
