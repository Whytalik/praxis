import { Router } from "express";
import { experimentController } from "../controllers/experiment/experiment.controller.js";
import { experimentMetricController } from "../controllers/experiment/experimentMetric.controller.js";
import { experimentStatusController } from "../controllers/experiment/experimentStatus.controller.js";
import { experimentStatsController } from "../controllers/experiment/experimentStats.controller.js";
import {
  validateStatus,
  validateMetric,
} from "../middleware/validation/experimentValidation.js";

const router = Router();

router.get("/", experimentController.getAll);
router.get("/:id", experimentController.getById);
router.post("/", experimentController.create);
router.put("/:id", experimentController.update);
router.delete("/:id", experimentController.delete);

router.get("/:id/entries", experimentMetricController.getEntries);
router.post(
  "/:id/metrics",
  validateMetric,
  experimentMetricController.addMetric
);

router.patch(
  "/:id/status",
  validateStatus,
  experimentStatusController.updateStatus
);

router.get("/:id/stats", experimentStatsController.getStats);

export default router;
