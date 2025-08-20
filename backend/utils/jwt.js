import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "Its-Developers-style";

export const signJWT = (payload, opts = {}) => jwt.sign(payload, SECRET, {expiresIn: "7d", ...opts});

export const verifyJWT = (token) => jwt.verify(token, SECRET);