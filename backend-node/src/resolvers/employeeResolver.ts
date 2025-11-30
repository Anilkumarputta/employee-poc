import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const resolvers = {
  Query: {
    employees: async (_parent: any, args: any, context: any) => {
      const prisma: PrismaClient = context.prisma;
      const page = args.page || 1;
      const perPage = args.perPage || 10;
      const skip = (page - 1) * perPage;
      const where: any = {};
      if (args.filter) {
        if (args.filter.query) {
          where.fullName = { contains: args.filter.query, mode: 'insensitive' };
        }
        if (args.filter.minAttendance != null) {
          where.attendancePercentage = { gte: args.filter.minAttendance };
        }
      }
      return prisma.employee.findMany({ where, skip, take: perPage });
    },
    employee: async (_parent: any, args: any, context: any) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.employee.findUnique({ where: { id: args.id } });
    }
  },
  Mutation: {
    login: async (_parent: any, args: any, context: any) => {
      const prisma: PrismaClient = context.prisma;
      const user = await prisma.user.findUnique({ where: { username: args.username } });
      if (!user) throw new Error('Invalid credentials');
      const valid = await bcrypt.compare(args.password, user.passwordHash);
      if (!valid) throw new Error('Invalid credentials');
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user: { id: user.id, username: user.username, role: user.role } };
    }
  }
};