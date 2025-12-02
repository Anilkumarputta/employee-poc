import { Context } from "../context";

/**
 * Resolver module for employee-specific mutations.
 * Ensure this file only writes fields that exist in the Prisma schema:
 *  - name, email, age, class, subjects, attendance
 */

export const employeeResolver = {
  Mutation: {
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
          // subjects is string[] in Prisma schema
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
      const input = args.input;
      const updated = await ctx.prisma.employee.update({
        where: { id: args.id },
        data: {
          name: input.name ?? undefined,
          email: input.email ?? undefined,
          age: input.age ?? undefined,
          class: input.class ?? undefined,
          subjects: input.subjects ?? undefined,
          attendance: input.attendance ?? undefined
        }
      });
      return updated;
    }
  }
};

export default employeeResolver;