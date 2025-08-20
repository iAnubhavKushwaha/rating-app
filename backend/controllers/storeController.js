import { PrismaClient } from "@prisma/client";
import { isValidAddress, isValidName, pickSort } from "../utils/validators.js";

const prisma = new PrismaClient();

// Admin: create store and assign to an OWNER user
export const adminCreateStore = async (req, res) => {
  try {
    const { name, address, ownerId, email } = req.body;

    if (!isValidName(name)) return res.status(400).json({ message: "Name must be 20–60 chars" });
    if (!isValidAddress(address)) return res.status(400).json({ message: "Address max 400 chars" });
    if (!ownerId) return res.status(400).json({ message: "ownerId required (OWNER user)" });

    const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
    if (!owner || owner.role !== "OWNER") return res.status(400).json({ message: "ownerId must refer to a STORE OWNER" });

    const store = await prisma.store.create({
      data: { name, address, email, ownerId: owner.id }
    });

    res.status(201).json({ message: "Store created", store });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Public/Authenticated: list stores with search/sort + include overall avg and user's own rating
export const listStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "asc", page = 1, limit = 10 } = req.query;

    const where = {
      AND: [
        name ? { name: { contains: String(name), mode: "insensitive" } } : {},
        address ? { address: { contains: String(address), mode: "insensitive" } } : {}
      ]
    };

    const skip = (Number(page) - 1) * Number(limit);
    const orderBy = pickSort(["name","address","createdAt","id"], sortBy, order);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where, skip, take: Number(limit), orderBy,
        include: { owner: { select: { id: true, email: true, name: true } } }
      }),
      prisma.store.count({ where })
    ]);

    // compute avg rating & (if logged in) user's rating
    const userId = req.user?.id;
    const storeIds = stores.map(s => s.id);

    const groups = await prisma.rating.groupBy({
      by: ["storeId"],
      where: { storeId: { in: storeIds } },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const byStore = Object.fromEntries(groups.map(g => [g.storeId, { avg: g._avg.rating ?? 0, count: g._count.rating }]));

    let userRatings = {};
    if (userId) {
      const urs = await prisma.rating.findMany({
        where: { userId, storeId: { in: storeIds } },
        select: { storeId: true, rating: true }
      });
      userRatings = Object.fromEntries(urs.map(r => [r.storeId, r.rating]));
    }

    const items = stores.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      owner: s.owner,
      overallRating: byStore[s.id]?.avg || 0,
      totalRatings: byStore[s.id]?.count || 0,
      myRating: userRatings[s.id] ?? null
    }));

    res.json({ total, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Store Owner dashboard: list raters + average
export const ownerDashboard = async (req, res) => {
  try {
    // find the store owned by current OWNER
    const store = await prisma.store.findFirst({
      where: { ownerId: req.user.id }
    });
    if (!store) return res.status(404).json({ message: "Store not found for this owner" });

    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      select: {
        id: true, rating: true, createdAt: true,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const agg = await prisma.rating.aggregate({
      where: { storeId: store.id },
      _avg: { rating: true },
      _count: true
    });

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      averageRating: agg._avg.rating || 0,
      totalRatings: agg._count,
      raters: ratings
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};


export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    // Optional: breakdown by role
    const roleCounts = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true }
    });

    res.json({
      message: "Admin dashboard stats",
      data: {
        totalUsers,
        totalStores,
        totalRatings,
        roleCounts
      }
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};