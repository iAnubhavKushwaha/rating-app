import { PrismaClient } from "@prisma/client";
import { clampRating } from "../utils/validators.js";

const prisma = new PrismaClient();

// Normal user: submit or update rating for a store
export const upsertMyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const rating = clampRating(req.body.rating);

    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" });

    // Ensure store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Ensure unique composite exists in schema: @@unique([userId, storeId])
    const result = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { rating },
      create: { rating, userId, storeId }
    });

    res.json({ message: "Rating saved", rating: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all ratings for a store
export const getStoreRatings = async (req, res) => {
  try {
    const { role, id } = req.user;
    const storeId = Number(req.params.storeId);

    // Ensure store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { owner: true }
    });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Role check
    if (role === "OWNER" && store.ownerId !== id) {
      return res.status(403).json({ message: "Not your store" });
    }

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    res.json({ store: store.name, ratings });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
