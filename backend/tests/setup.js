import mongoose from "mongoose";
import { dbConfig } from "../config/database.js";

beforeAll(async () => {
  try {
    await mongoose.connect(dbConfig.url, {
      ...dbConfig.options,
      dbName: "praxis_test",
    });
  } catch (error) {
    console.error("Error connecting to the test database:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
});
