import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function signToken(payload: { id: number; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserFromToken(token?: string) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.replace(/^Bearer\s+/i, ""), JWT_SECRET) as any;
    // Optionally load fresh user from DB
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role };
  } catch (e) {
    return null;
  }
}