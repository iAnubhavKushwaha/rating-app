//backend\controllers\userController.js

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { isValidAddress, isValidEmail, isValidName, isValidPassword, pickSort } from "../utils/validators.js";

const prisma = new PrismaClient();

// Admin: create any user (ADMIN / NORMAL / OWNER)
export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!isValidName(name)) return res.status(400).json({ message: "Name must be 20–60 chars" });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!isValidAddress(address)) return res.status(400).json({ message: "Address max 400 chars" });
    if (!isValidPassword(password)) return res.status(400).json({ message: "Password 8–16, 1 uppercase & 1 special" });
    if (!["ADMIN", "NORMAL", "OWNER"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, address, password: hashed, role }
    });

    res.status(201).json({ message: "User created", user: { id: user.id, name, email, role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: list users with filters & sorting
export const adminListUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "asc", page = 1, limit = 10 } = req.query;
    const where = {
      AND: [
        name ? { name: { contains: String(name), mode: "insensitive" } } : {},
        email ? { email: { contains: String(email), mode: "insensitive" } } : {},
        address ? { address: { contains: String(address), mode: "insensitive" } } : {},
        role ? { role: String(role).toUpperCase() } : {}
      ]
    };
    const skip = (Number(page) - 1) * Number(limit);
    const orderBy = pickSort(["name","email","address","role","createdAt","id"], sortBy, order);

    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: Number(limit), orderBy }),
      prisma.user.count({ where })
    ]);

    res.json({ total, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: user details (if OWNER, also return store + avg rating)
export const adminGetUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { store: true } // assuming 1 store per owner
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let ownerStats = null;
    if (user.role === "OWNER" && user.store) {
      const agg = await prisma.rating.aggregate({
        where: { storeId: user.store.id },
        _avg: { rating: true },
        _count: true
      });
      ownerStats = { storeId: user.store.id, averageRating: agg._avg.rating || 0, totalRatings: agg._count };
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role }, ownerStats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};


// Update user's password for logged-in users or via email for others
export const updateMyPassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Validate new password requirements
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ message: "New password invalid (8–16 characters, must include uppercase and special characters)" });
        }

        let user;

        // Check if the email is provided
        if (email) {
            // Find user by email
            user = await prisma.user.findUnique({ where: { email } });
            // If user not found, return a 404 error
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        } else {
            // For authenticated user: use req.user which should be set by authentication middleware
            user = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!user) return res.status(404).json({ message: "User not found" });
        }

        // Check if the current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user with the new password
        await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const userDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch ratings by this user
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: { store: true }
    });

    const totalRatings = ratings.length;
    const averageScore =
      totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    res.json({
      message: "User dashboard stats",
      data: {
        totalRatings,
        averageScore: Number(averageScore.toFixed(2)),
        ratedStores: ratings.map(r => ({
          storeId: r.storeId,
          storeName: r.store.name,
          rating: r.rating   // ✅ fixed field
        }))
      }
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: delete a user
export const adminDeleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: prevent deleting admins
    if (user.role === "ADMIN") {
      return res.status(403).json({ message: "Cannot delete an Admin user" });
    }

    // If the user owns a store, delete store & related ratings first
    if (user.role === "OWNER") {
      await prisma.rating.deleteMany({ where: { store: { ownerId: userId } } });
      await prisma.store.deleteMany({ where: { ownerId: userId } });
    }

    // Delete user's ratings
    await prisma.rating.deleteMany({ where: { userId } });

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Admin: update a user's role
export const adminUpdateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!["ADMIN", "OWNER", "NORMAL"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent admin from changing their own role
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ message: "User role updated", user: updatedUser });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
