import bcrypt from "bcryptjs";
import { Context } from "../context";
import { signToken } from "../auth";

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, ctx: Context) => {
      return ctx.user || null;
    },

    employees: async (
      _parent: any,
      args: { filter?: any; pagination?: { skip?: number; take?: number }; sort?: { field?: string; direction?: string } },
      ctx: Context
    ) => {
      // Allow both admin and employee to list; employees only limited fields are returned on frontend side
      const where: any = {};
      const { filter, pagination, sort } = args;

      if (filter) {
        if (filter.nameContains) {
          where.name = { contains: filter.nameContains, mode: "insensitive" };
        }
        if (filter.classEquals) {
          where.class = filter.classEquals;
        }
        if (typeof filter.minAge === "number" || typeof filter.maxAge === "number") {
          where.age = {};
          if (typeof filter.minAge === "number") where.age.gte = filter.minAge;
          if (typeof filter.maxAge === "number") where.age.lte = filter.maxAge;
        }
      }

      const total = await ctx.prisma.employee.count({ where });

      const orderBy: any = {};
      if (sort && sort.field) {
        const dir = sort.direction && sort.direction.toLowerCase() === "desc" ? "desc" : "asc";
        // Validate field to avoid injection
        const allowed = ["id", "name", "age", "class", "attendance", "createdAt", "email"];
        orderBy[sort.field] = allowed.includes(sort.field) ? dir : "asc";
      } else {
        orderBy.createdAt = "desc";
      }

      const items = await ctx.prisma.employee.findMany({
        where,
        skip: pagination?.skip,
        take: pagination?.take ?? 20,
        orderBy
      });

      return { items, total };
    },

    employee: async (_parent: any, args: { id: number }, ctx: Context) => {
      const emp = await ctx.prisma.employee.findUnique({ where: { id: args.id } });
      return emp;
    }
  },

  Mutation: {
    login: async (_parent: any, args: { email: string; password: string }, ctx: Context) => {
      const { email, password } = args;
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");
      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return { token, user };
    },

    createEmployee: async (_parent: any, args: { input: any }, ctx: Context) => {
      // Authorization: only admins can create
      if (!ctx.user || ctx.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      const input = args.input;
      const created = await ctx.prisma.employee.create({
        data: {
          name: input.name,
          email: input.email,
          age: input.age,
          class: input.class,
          subjects: input.subjects ?? [],
          attendance: input.attendance ?? 0
        }
      });
      return created;
    },

    updateEmployee: async (_parent: any, args: { id: number; input: any }, ctx: Context) => {
      // Authorization: only admins can update
      if (!ctx.user || ctx.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      const updated = await ctx.prisma.employee.update({
        where: { id: args.id },
        data: {
          name: args.input.name ?? undefined,
          email: args.input.email ?? undefined,
          age: args.input.age ?? undefined,
          class: args.input.class ?? undefined,
          subjects: args.input.subjects ?? undefined,
          attendance: args.input.attendance ?? undefined
        }
      });
      return updated;
    }
  }
};