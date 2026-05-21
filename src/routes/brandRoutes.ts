import { Router } from "express";
import { createBrand, getBrands } from "../controllers/BrandController";

const router = Router();

router.get("/", getBrands);
router.post("/", createBrand);

export default router;

