import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError, AuthenticationError } from 'apollo-server';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Development-only rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(username: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(username);
  
  if (attempt) {
    if (now - attempt.lastAttempt > WINDOW_MS) {
      loginAttempts.set(username, { count: 1, lastAttempt: now });
    } else if (attempt.count >= MAX_ATTEMPTS) {
      throw new ApolloError('Too many login attempts. Please try again later.', 'RATE_LIMITED');
    } else {
      loginAttempts.set(username, { count: attempt.count + 1, lastAttempt: now });
    }
  } else {
    loginAttempts.set(username, { count: 1, lastAttempt: now });
  }
}

interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

interface Context {
  prisma: PrismaClient;
  user: JwtPayload | null;
}

function ensureAuthenticated(context: Context): void {
  if (!context.user) {
    throw new AuthenticationError('Authentication required');
  }
}

function ensureAdmin(context: Context): void {
  ensureAuthenticated(context);
  if (context.user!.role !== 'admin') {
    throw new AuthenticationError('Admin role required');
  }
}

function validateFullName(fullName: string): void {
  if (!fullName || fullName.trim().length === 0) {
    throw new ApolloError('fullName is required and cannot be empty', 'BAD_USER_INPUT');
  }
}

interface EmployeeInput {
  fullName: string;
  className?: string | null;
  attendancePercentage?: number | null;
}

export const resolvers = {
  Query: {
    employees: async (_parent: unknown, args: { page?: number; perPage?: number; filter?: { query?: string; minAttendance?: number } }, context: Context) => {
      const prisma = context.prisma;
      const page = args.page || 1;
      const perPage = args.perPage || 10;
      const skip = (page - 1) * perPage;
      const where: { fullName?: { contains: string; mode: 'insensitive' }; attendancePercentage?: { gte: number } } = {};
      if (args.filter) {
        if (args.filter.query) {
          where.fullName = { contains: args.filter.query, mode: 'insensitive' };
        }
        if (args.filter.minAttendance != null) {
          where.attendancePercentage = { gte: args.filter.minAttendance };
        }
      }
      const [items, total] = await Promise.all([
        prisma.employee.findMany({ where, skip, take: perPage }),
        prisma.employee.count({ where })
      ]);
      return { items, total, page, perPage };
    },
    employee: async (_parent: unknown, args: { id: number }, context: Context) => {
      const prisma = context.prisma;
      return prisma.employee.findUnique({ where: { id: args.id } });
    }
  },
  Mutation: {
    login: async (_parent: unknown, args: { username: string; password: string }, context: Context) => {
      const prisma = context.prisma;
      checkRateLimit(args.username);
      const user = await prisma.user.findUnique({ where: { username: args.username } });
      if (!user) throw new AuthenticationError('Invalid credentials');
      const valid = await bcrypt.compare(args.password, user.passwordHash);
      if (!valid) throw new AuthenticationError('Invalid credentials');
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user: { id: user.id, username: user.username, role: user.role } };
    },
    createEmployee: async (_parent: unknown, args: { input: EmployeeInput }, context: Context) => {
      ensureAdmin(context);
      validateFullName(args.input.fullName);
      const prisma = context.prisma;
      return prisma.employee.create({
        data: {
          fullName: args.input.fullName.trim(),
          className: args.input.className ?? null,
          attendancePercentage: args.input.attendancePercentage ?? null
        }
      });
    },
    updateEmployee: async (_parent: unknown, args: { id: number; input: EmployeeInput }, context: Context) => {
      ensureAdmin(context);
      validateFullName(args.input.fullName);
      const prisma = context.prisma;
      return prisma.employee.update({
        where: { id: args.id },
        data: {
          fullName: args.input.fullName.trim(),
          className: args.input.className ?? null,
          attendancePercentage: args.input.attendancePercentage ?? null
        }
      });
    },
    deleteEmployee: async (_parent: unknown, args: { id: number }, context: Context) => {
      ensureAdmin(context);
      const prisma = context.prisma;
      await prisma.employee.delete({ where: { id: args.id } });
      return true;
    }
  }
};