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

/**
 * @swagger
 * /api/experiments:
 *   get:
 *     summary: Get all experiments
 *     tags: [Experiments]
 *     responses:
 *       200:
 *         description: List of experiments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Experiment'
 */
router.get("/", experimentController.getAll);

/**
 * @swagger
 * /api/experiments/{id}:
 *   get:
 *     summary: Get experiment by ID
 *     tags: [Experiments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Experiment ID
 *     responses:
 *       200:
 *         description: Experiment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experiment'
 *       404:
 *         description: Experiment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
