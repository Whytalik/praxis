import fetch from "node-fetch";
import mongoose from "mongoose";
import { Entry } from "../models/entry.model.js";
import { Experiment } from "../models/experiment.model.js";
import { MetricType } from "../models/metricType.model.js";

const API_URL = "http://localhost:3000/api";

describe("Entry Tests", () => {
  let metricType;
  let experiment;
  let createdEntry;

  beforeAll(async () => {
    await Entry.deleteMany({});
    await Experiment.deleteMany({});
    await MetricType.deleteMany({});

    const metricResponse = await fetch(`${API_URL}/metric-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `TestMetric_${Date.now()}`,
        description: "Test metric for entries",
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
  });

  describe("Create Entry", () => {
    test("should create a valid entry", async () => {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {
            [metricType.name]: 75,
          },
          conclusion: "Test entry conclusion",
        }),
      });

      const data = await response.json();
      createdEntry = data;

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("_id");
      expect(data.experimentId).toBe(experiment._id);
      expect(data.values).toHaveProperty(metricType.name);
      expect(data.values[metricType.name]).toBe(75);
    });

    test("should not create entry with invalid experiment id", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: fakeId,
          values: {
            [metricType.name]: 75,
          },
        }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.message).toContain("Experiment not found");
    });

    test("should not create entry with invalid metric value", async () => {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {
            [metricType.name]: 150,
          },
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("must be between");
    });

    test("should not create entry with missing required metric", async () => {
      const response = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {},
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain("required");
    });
  });

  describe("Get Entries", () => {
    test("should get entries by experiment id", async () => {
      const response = await fetch(
        `${API_URL}/entries/experiment/${experiment._id}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].experimentId).toBe(experiment._id);
    });

    test("should return empty array for experiment with no entries", async () => {
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
        `${API_URL}/entries/experiment/${newExperiment._id}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });

  describe("Update Entry", () => {
    test("should update entry conclusion", async () => {
      const createResponse = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {
            [metricType.name]: 75,
          },
          conclusion: "Initial conclusion",
        }),
      });

      const createdEntry = await createResponse.json();
      expect(createResponse.status).toBe(201);

      const newConclusion = "Updated conclusion";
      const response = await fetch(`${API_URL}/entries/${createdEntry._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          conclusion: newConclusion,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.conclusion).toBe(newConclusion);
    });

    test("should update entry values", async () => {
      const createResponse = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {
            [metricType.name]: 75,
          },
          conclusion: "Initial conclusion",
        }),
      });

      const createdEntry = await createResponse.json();
      expect(createResponse.status).toBe(201);

      const newValue = 85;
      const response = await fetch(`${API_URL}/entries/${createdEntry._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          values: {
            [metricType.name]: newValue,
          },
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.values[metricType.name]).toBe(newValue);
    });
  });

  describe("Delete Entry", () => {
    test("should delete entry", async () => {
      const createResponse = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experiment._id,
          values: {
            [metricType.name]: 75,
          },
          conclusion: "Entry to delete",
        }),
      });

      const entryToDelete = await createResponse.json();
      expect(createResponse.status).toBe(201);

      const response = await fetch(`${API_URL}/entries/${entryToDelete._id}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);

      const checkResponse = await fetch(
        `${API_URL}/entries/${entryToDelete._id}`
      );
      expect(checkResponse.status).toBe(404);
    });
  });
});
