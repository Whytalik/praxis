import fetch from "node-fetch";
import mongoose from "mongoose";
import { MetricType } from "../models/metricType.model.js";

const API_URL = "http://localhost:3000/api";

describe("Metric Type Tests", () => {
  let createdMetricType;

  beforeAll(async () => {
    await MetricType.deleteMany({});
  });

  describe("Create Metric Type", () => {
    test("should create a valid metric type", async () => {
      const timestamp = Date.now();
      const response = await fetch(`${API_URL}/metric-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `TestMetric_${timestamp}`,
          description: "Test metric description",
          validation: {
            type: "number",
            min: 0,
            max: 100,
          },
          format: "default",
          unit: "points",
        }),
      });

      const data = await response.json();
      createdMetricType = data;

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("_id");
      expect(data.name).toBe(`TestMetric_${timestamp}`);
      expect(data.validation.type).toBe("number");
    });

    test("should not create metric type with duplicate name", async () => {
      const response = await fetch(`${API_URL}/metric-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createdMetricType.name,
          description: "Duplicate metric",
          validation: {
            type: "number",
            min: 0,
            max: 100,
          },
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("Duplicate field value");
    });

    test("should not create metric type without required fields", async () => {
      const response = await fetch(`${API_URL}/metric-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Invalid metric",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("required");
    });
  });

  describe("Get Metric Types", () => {
    test("should get all metric types", async () => {
      const response = await fetch(`${API_URL}/metric-types`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test("should get metric type by id", async () => {
      const response = await fetch(
        `${API_URL}/metric-types/${createdMetricType._id}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe(createdMetricType._id);
      expect(data.name).toBe(createdMetricType.name);
    });

    test("should return 404 for non-existent metric type", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await fetch(`${API_URL}/metric-types/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Update Metric Type", () => {
    test("should update metric type", async () => {
      const newDescription = "Updated description";
      const response = await fetch(
        `${API_URL}/metric-types/${createdMetricType._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: newDescription,
          }),
        }
      );

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.description).toBe(newDescription);
    });
  });

  describe("Delete Metric Type", () => {
    test("should delete metric type", async () => {
      const response = await fetch(
        `${API_URL}/metric-types/${createdMetricType._id}`,
        {
          method: "DELETE",
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe("Metric type deleted successfully");

      const checkResponse = await fetch(
        `${API_URL}/metric-types/${createdMetricType._id}`
      );
      expect(checkResponse.status).toBe(404);
    });
  });
});
