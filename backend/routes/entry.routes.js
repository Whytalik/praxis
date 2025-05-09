import { Router } from "express";
import { entryController } from "../controllers/entry/entry.controller.js";

const router = Router();

router.post("/", entryController.create);
router.get("/experiment/:experimentId", entryController.getByExperimentId);
router.get("/:id", entryController.getById);
router.patch("/:id", entryController.update);
router.delete("/:id", entryController.delete);

export default router;
