import { Router } from "express";
import { ProductLogController } from "../controllers/productLog.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All product log routes require authentication
router.use(authMiddleware);

router.post("/", ProductLogController.create);
router.get("/", ProductLogController.getAll);
router.get("/deliveries", ProductLogController.getDeliveries);
router.get("/receipts", ProductLogController.getReceipts);
router.get("/adjustments", ProductLogController.getAdjustments);
router.get("/reference/:reference_id", ProductLogController.getByReferenceId);
router.get("/product/:product_id", ProductLogController.getByProductId);
router.get("/status/:status", ProductLogController.getByStatus);
router.get("/:id", ProductLogController.getById);
router.put("/:id", ProductLogController.update);
router.delete("/:id", ProductLogController.delete);

export default router;
