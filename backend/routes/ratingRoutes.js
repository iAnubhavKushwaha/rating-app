import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { upsertMyRating,getStoreRatings } from "../controllers/ratingController.js";

const router = Router();

router.put("/:storeId", authenticate, requireRole("NORMAL"), upsertMyRating);
router.get("/store/:storeId", authenticate, getStoreRatings);

export default router;
