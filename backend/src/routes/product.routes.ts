import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All product routes require authentication
router.use(authMiddleware);

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/product-stocks", ProductController.getProductStocks);
router.get("/sku/:sku_code", ProductController.getBySkuCode);
router.get("/:id", ProductController.getById);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
