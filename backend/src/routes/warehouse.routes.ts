import { Router } from "express";
import { WarehouseController } from "../controllers/warehouse.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All warehouse routes require authentication
router.use(authMiddleware);

router.post("/", WarehouseController.create);
router.get("/", WarehouseController.getAll);
router.get("/code/:short_code", WarehouseController.getByShortCode);
router.get("/:id", WarehouseController.getById);
router.put("/:id", WarehouseController.update);
router.delete("/:id", WarehouseController.delete);

export default router;
