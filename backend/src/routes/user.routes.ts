import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
