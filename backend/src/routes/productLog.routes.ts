import { Router } from "express";
import { ProductLogController } from "../controllers/productLog.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All product log routes require authentication
router.use(authMiddleware);

router.post("/", ProductLogController.create);
router.post("/receipt", ProductLogController.createReceipt);
router.post("/delivery", ProductLogController.createDelivery);
router.put("/receipt/:reference_id/status", ProductLogController.updateReceiptStatus);
router.put("/delivery/:reference_id/status", ProductLogController.updateDeliveryStatus);
router.get("/stats/receipt", ProductLogController.getReceiptStats);
router.get("/stats/delivery", ProductLogController.getDeliveryStats);
router.get("/", ProductLogController.getAll);
router.get("/with-product-name", ProductLogController.getAllWithProductName);
router.get("/deliveries", ProductLogController.getDeliveries);
router.get("/deliveries/with-product-name", ProductLogController.getDeliveriesWithProductName);
router.get("/receipts", ProductLogController.getReceipts);
router.get("/receipts/with-product-name", ProductLogController.getReceiptsWithProductName);
router.get("/adjustments", ProductLogController.getAdjustments);
router.get("/reference/:reference_id", ProductLogController.getByReferenceId);
router.get("/product/:product_id", ProductLogController.getByProductId);
router.get("/status/:status", ProductLogController.getByStatus);
router.get("/:id", ProductLogController.getById);
router.put("/:id", ProductLogController.update);
router.delete("/:id", ProductLogController.delete);

export default router;
