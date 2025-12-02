import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: { id: number; email: string; role: string } | null;
}

export const createContext = (user?: { id: number; email: string; role: string } | null): Context => {
  return { prisma, user: user || null };
};