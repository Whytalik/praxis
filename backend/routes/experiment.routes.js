import { Router } from "express";
import { experimentCRUDController } from "../controllers/experimentCRUD.controller.js";
import { experimentStatsController } from "../controllers/experimentStats.controller.js";
import { validateStatus, validateMetric } from "../middleware/validation.js";

const router = Router();

router.get("/", experimentCRUDController.getAll);
router.get("/:id", experimentCRUDController.getById);
router.get("/:id/stats", experimentStatsController.getStats);
router.post("/", experimentCRUDController.create);
router.put("/:id", experimentCRUDController.update);
router.delete("/:id", experimentCRUDController.delete);
router.patch("/:id/status", validateStatus, experimentCRUDController.updateStatus);
router.post("/:id/metrics", validateMetric, experimentCRUDController.addMetric);

export default router;
