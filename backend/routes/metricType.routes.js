import { Router } from "express";
import { metricTypeController } from "../controllers/metricType.controller.js";

const router = Router();

router.get("/", metricTypeController.getAll);
router.get("/:id", metricTypeController.getById);
router.post("/", metricTypeController.create);
router.patch("/:id", metricTypeController.update);
router.delete("/:id", metricTypeController.delete);

export default router;
