import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { adminCreateStore, listStores, ownerDashboard, adminDashboard} from "../controllers/storeController.js";

const router = Router();

router.post("/", authenticate, requireRole("ADMIN"), adminCreateStore);
router.get("/", authenticate, listStores); // normal users see their own rating in list
router.get("/owner/dashboard", authenticate, requireRole("OWNER"), ownerDashboard);
router.get("/admin/dashboard", authenticate, requireRole("ADMIN"), adminDashboard);

export default router;
