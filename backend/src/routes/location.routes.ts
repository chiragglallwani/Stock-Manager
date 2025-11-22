import { Router } from "express";
import { LocationController } from "../controllers/location.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All location routes require authentication
router.use(authMiddleware);

router.post("/", LocationController.create);
router.get("/", LocationController.getAll);
router.get("/warehouse/:warehouse_code", LocationController.getByWarehouseCode);
router.get("/:id", LocationController.getById);
router.put("/:id", LocationController.update);
router.delete("/:id", LocationController.delete);

export default router;
