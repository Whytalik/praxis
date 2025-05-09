import { Router } from "express";
import { entryController } from "../controllers/entry.controller.js";

const router = Router();

router.post("/", entryController.create);

export default router;
