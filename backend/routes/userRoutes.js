import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { adminCreateUser, adminListUsers, adminGetUser, updateMyPassword, userDashboard,adminUpdateUserRole,adminDeleteUser } from "../controllers/userController.js";

const router = Router();

router.post("/", authenticate, requireRole("ADMIN"), adminCreateUser);
router.get("/", authenticate, requireRole("ADMIN"), adminListUsers);
router.get("/:id", authenticate, requireRole("ADMIN"), adminGetUser);
router.patch("/:id/role", authenticate, requireRole("ADMIN"), adminUpdateUserRole);
router.delete("/:id", authenticate, requireRole("ADMIN"), adminDeleteUser);

router.patch("/me/password", authenticate, updateMyPassword);

router.get("/me/dashboard", authenticate, requireRole("NORMAL"), userDashboard);

export default router;
