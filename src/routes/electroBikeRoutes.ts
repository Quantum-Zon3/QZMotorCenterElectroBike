import { Router } from "express";
import {
  createElectroBike,
  deleteElectroBike,
  getCatalogSummary,
  getElectroBikeById,
  getElectroBikes,
  updateElectroBike,
} from "../controllers/ElectroBikeController";

const router = Router();

router.get("/resumen", getCatalogSummary);
router.get("/", getElectroBikes);
router.post("/", createElectroBike);
router.get("/:id", getElectroBikeById);
router.put("/:id", updateElectroBike);
router.delete("/:id", deleteElectroBike);

export default router;

