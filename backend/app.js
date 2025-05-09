import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConfig } from "./config/database.js";
import experimentRoutes from "./routes/experiment.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import metricTypeRoutes from "./routes/metricType.routes.js";
import { errorHandler } from "./middleware/error/errorHandler.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use("/api/experiments", experimentRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/metric-types", metricTypeRoutes);

mongoose
  .connect(dbConfig.url, dbConfig.options)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Praxis API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
