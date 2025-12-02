import { Context } from "../context";

export const resolvers = {
  Query: {
    employees: async (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.employee.findMany({ orderBy: { id: "asc" } });
    },
    employee: async (_parent: any, args: { id: number }, ctx: Context) => {
      return ctx.prisma.employee.findUnique({ where: { id: args.id } });
    }
  },

  Mutation: {
    createEmployee: async (
      _parent: any,
      args: { input: { name: string; email: string; position?: string; salary?: number } },
      ctx: Context
    ) => {
      const { name, email, position, salary } = args.input;
      const created = await ctx.prisma.employee.create({
        data: { name, email, position, salary }
      });
      return created;
    },

    deleteEmployee: async (_parent: any, args: { id: number }, ctx: Context) => {
      const deleted = await ctx.prisma.employee.delete({ where: { id: args.id } });
      return deleted;
    }
  }
};
