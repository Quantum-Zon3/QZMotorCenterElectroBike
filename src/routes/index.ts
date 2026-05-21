import { Router } from "express";
import brandRoutes from "./brandRoutes";
import electroBikeRoutes from "./electroBikeRoutes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "qzmotorcenter-electrobike",
    timestamp: new Date().toISOString(),
  });
});

router.use("/marcas", brandRoutes);
router.use("/electrobikes", electroBikeRoutes);

export default router;

