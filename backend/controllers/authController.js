import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signJWT } from "../utils/jwt.js";
import {
  isValidAddress, isValidEmail, isValidName, isValidPassword
} from "../utils/validators.js";

const prisma = new PrismaClient();

// Normal user self-signup
export const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!isValidName(name)) return res.status(400).json({ message: "Name must be 20–60 chars" });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!isValidAddress(address)) return res.status(400).json({ message: "Address max 400 chars" });
    if (!isValidPassword(password)) return res.status(400).json({ message: "Password 8–16, 1 uppercase & 1 special" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, address, password: hashed, role: "NORMAL" }
    });

    // optional: auto-login after signup
    const token = signJWT({ id: user.id, role: user.role });
    res.status(201).json({ message: "Registered", token, user: { id: user.id, name, email, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Login (all roles)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signJWT({ id: user.id, role: user.role });
    res.json({ message: "Logged in", token, role: user.role, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
